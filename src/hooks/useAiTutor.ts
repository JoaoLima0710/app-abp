
import { useState } from 'react';

export function useAiTutor() {
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [provider, setProvider] = useState<string | null>(null);

    const askAi = async (
        question: string, 
        context: string, 
        action: 'explain' | 'study_guide' | 'generate_flashcards' | 'analyze_plan' | 'sync_dossier' = 'explain'
    ): Promise<any> => {
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

    /**
     * Synthesizes newly missed questions into the rolling AI Dossier paragraph.
     * Normally called in the background after finishing a simulation.
     */
    const syncSocraticDossier = async (currentDossier: string, missedQuestionsData: any[]): Promise<string | null> => {
        if (!navigator.onLine || missedQuestionsData.length === 0) return null;

        const context = `Dossiê Atual do Aluno:\n"${currentDossier}"\n\nErros Recentes Submetidos:\n${missedQuestionsData.map(q => `- Tema: ${q.theme}\n  Pergunta: ${q.statement}\n  Resposta Correta: ${q.correctAnswer}`).join('\n\n')}`;
        
        const prompt = `Sintetize as novas falhas junto com o dossiê antigo em um ÚNICO parágrafo (máx 500 palavras) sobre o perfil de aprendizado clínico do aluno. 
PRIORIDADE ABSOLUTA: 
1. Mantenha um tom descritivo de "prontuário" sobre as fraquezas dele. 
2. NUNCA remova uma fraqueza teórica do dossiê antigo a menos que o espaço exija compressão (nesse caso agrupe problemas similares, ex: "Dificuldade na família do Espectro da Esquizofrenia"). 
3. Retorne APENAS o texto do novo dossiê, sem saudações ou comentários.`;

        try {
            const newDossier = await askAi(prompt, context, 'sync_dossier');
            return typeof newDossier === 'string' ? newDossier.trim() : null;
        } catch (e) {
            console.error("Failed to sync AI dossier:", e);
            return null; // Ensure we don't accidentally wipe it out if it fails
        }
    };

    return {
        askAi,
        syncSocraticDossier,
        isLoading,
        explanation,
        error,
        provider,
    };
}
