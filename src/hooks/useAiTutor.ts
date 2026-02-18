
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
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: `Você é um tutor especialista em Psiquiatria para provas de título (ABP). 
                            Sua base de conhecimento principal é o DSM-5-TR e o Tratado de Psiquiatria da ABP.
                            Explique a questão fornecida, detalhando por que a alternativa correta é a correta e por que as outras estão incorretas.
                            Cite as referências (livro e capítulo/seção) quando possível.
                            Seja conciso, didático e direto.`
                        },
                        {
                            role: 'user',
                            content: `Questão: ${question}\n\nContexto/Alternativas: ${context}`
                        }
                    ]
                }),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('API não encontrada. (Se estiver rodando localmente, use "vercel dev" ou configure o backend).');
                }
                throw new Error('Falha na comunicação com a IA');
            }

            const data = await response.json();
            setExplanation(data.content || data.reply || "Sem resposta da IA.");

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro desconhecido');

            // Fallback for local dev demo if API is missing
            if (import.meta.env.DEV && err.message.includes('API não encontrada')) {
                setExplanation("**MOCK DEV:** A API da IA não está rodando localmente (requer Vercel Functions). \n\n" +
                    "Em produção, aqui apareceria a explicação detalhada baseada no DSM-5-TR, citando os critérios diagnósticos específicos e diferenciando das outras alternativas.");
            }

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
