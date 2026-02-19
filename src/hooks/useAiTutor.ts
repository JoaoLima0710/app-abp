
import { useState } from 'react';

export function useAiTutor() {
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const askAi = async (question: string, context: string) => {
        setIsLoading(true);
        setError(null);
        setExplanation(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, context }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erro ${response.status}`);
            }

            const data = await response.json();
            setExplanation(data.content || 'Sem resposta da IA.');

        } catch (err: any) {
            console.error('AI Tutor error:', err);
            setError(err.message || 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        askAi,
        isLoading,
        explanation,
        error
    };
}
