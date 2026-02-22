
import { useState } from 'react';

export function useAiTutor() {
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [provider, setProvider] = useState<string | null>(null);

    const askAi = async (question: string, context: string, action: 'explain' | 'study_guide' | 'generate_flashcards' | 'analyze_plan' = 'explain'): Promise<any> => {
        setIsLoading(true);
        setError(null);
        setExplanation(null);
        setProvider(null);

        if (!navigator.onLine) {
            setError('Você está offline. Conecte-se à internet para usar o Tutor de IA.');
            setIsLoading(false);
            throw new Error('Você está offline. Conecte-se à internet para usar o Tutor de IA.');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, context, action }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const detail = errorData.details ? ` — ${errorData.details}` : '';
                throw new Error((errorData.error || `Erro ${response.status}`) + detail);
            }

            const data = await response.json();

            if (action === 'generate_flashcards') {
                try {
                    // Limpar formatação de markdown se houver (ex: ```json\n...\n```)
                    let contentStr = data.content.trim();
                    if (contentStr.startsWith('```json')) {
                        contentStr = contentStr.replace(/^```json\n?/, '').replace(/```\n?$/, '');
                    } else if (contentStr.startsWith('```')) {
                        contentStr = contentStr.replace(/^```\n?/, '').replace(/```\n?$/, '');
                    }
                    return JSON.parse(contentStr); // Retorna o array de flashcards
                } catch (e) {
                    throw new Error("Erro ao parsear flashcards da IA");
                }
            } else {
                setExplanation(data.content || 'Sem resposta da IA.');
                setProvider(data.provider || null);
                return data.content;
            }

        } catch (err: any) {
            console.error('AI Tutor error:', err);

            if (err.name === 'AbortError') {
                const timeoutMsg = 'O servidor de IA demorou muito para responder (Timeout). Tente novamente em alguns instantes.';
                setError(timeoutMsg);
                throw new Error(timeoutMsg);
            }

            setError(err.message || 'Erro desconhecido');
            throw err; // Re-throw para o chamador capturar
        } finally {
            setIsLoading(false);
        }
    };

    return {
        askAi,
        isLoading,
        explanation,
        error,
        provider,
    };
}
