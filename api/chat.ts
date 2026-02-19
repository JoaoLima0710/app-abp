
// Vercel Serverless Function — IA multi-provider com fallback automático
// POE (primário, RAG com documentos) → Gemini (fallback, conhecimento geral)

const SYSTEM_PROMPT = `Você é um tutor especialista em Psiquiatria para provas de título da ABP.
Responda EXCLUSIVAMENTE com base nos documentos da sua base de conhecimento (DSM-5-TR e Tratado de Psiquiatria da ABP).
Se a informação não constar nos documentos fornecidos, diga explicitamente: "Esta informação não consta nos materiais de referência."
NUNCA invente ou extrapole informações além do que está nos documentos.
Cite a fonte (livro e seção/capítulo) sempre que possível.
Seja conciso, didático e direto.`;

// ── POE (OpenAI-compatible) ──────────────────────────────────────────
async function callPoe(question: string, context: string): Promise<string> {
    const apiKey = process.env.POE_API_KEY;
    const botName = process.env.POE_BOT_NAME || 'GPT-4o';
    if (!apiKey) throw new Error('POE_API_KEY ausente');

    const res = await fetch('https://api.poe.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: botName,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Questão: ${question}\n\n${context || ''}` },
            ],
            temperature: 0.3,
            stream: false,
        }),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`POE ${res.status}: ${text.substring(0, 200)}`);
    const data = JSON.parse(text);
    return data.choices?.[0]?.message?.content || 'Sem resposta da IA.';
}

// ── Gemini ───────────────────────────────────────────────────────────
async function callGemini(question: string, context: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    if (!apiKey) throw new Error('GEMINI_API_KEY ausente');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [
                { role: 'user', parts: [{ text: `Questão: ${question}\n\n${context || ''}` }] },
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2048,
            },
        }),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${text.substring(0, 200)}`);
    const data = JSON.parse(text);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta da IA.';
}

// ── Handler com fallback automático ──────────────────────────────────
export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { question, context } = req.body;
        if (!question) return res.status(400).json({ error: 'Campo "question" é obrigatório' });

        let content: string;
        let provider: string;

        // Tenta POE primeiro (RAG com documentos)
        try {
            console.log('Tentando POE (primário)...');
            content = await callPoe(question, context);
            provider = 'poe';
            console.log('POE respondeu com sucesso');
        } catch (poeError: any) {
            console.warn('POE falhou:', poeError.message);

            // Fallback para Gemini
            try {
                console.log('Fallback → Gemini...');
                content = await callGemini(question, context);
                provider = 'gemini';
                console.log('Gemini respondeu com sucesso');
            } catch (geminiError: any) {
                console.error('Gemini também falhou:', geminiError.message);
                return res.status(502).json({
                    error: 'Ambos os provedores falharam',
                    details: `POE: ${poeError.message} | Gemini: ${geminiError.message}`,
                });
            }
        }

        return res.status(200).json({
            role: 'assistant',
            content,
            provider, // frontend pode mostrar qual provider respondeu
        });
    } catch (error: any) {
        console.error('AI Proxy error:', error.message);
        return res.status(500).json({ error: 'Erro interno', details: error.message });
    }
}
