
// Vercel Serverless Function — Proxy para API do POE (OpenAI-compatible)
// A chave fica protegida no servidor (env var), nunca exposta ao frontend.

const POE_API_URL = 'https://api.poe.com/v1/chat/completions';

export default async function handler(req: any, res: any) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.POE_API_KEY;
    const botName = process.env.POE_BOT_NAME || 'GPT-4o';

    if (!apiKey) {
        return res.status(500).json({ error: 'Configuração do servidor: API Key ausente' });
    }

    try {
        const { question, context } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Campo "question" é obrigatório' });
        }

        const systemPrompt = `Você é um tutor especialista em Psiquiatria para provas de título da ABP.
Responda EXCLUSIVAMENTE com base nos documentos da sua base de conhecimento (DSM-5-TR e Tratado de Psiquiatria da ABP).
Se a informação não constar nos documentos fornecidos, diga explicitamente: "Esta informação não consta nos materiais de referência."
NUNCA invente ou extrapole informações além do que está nos documentos.
Cite a fonte (livro e seção/capítulo) sempre que possível.
Seja conciso, didático e direto.`;

        const requestBody = {
            model: botName,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Questão: ${question}\n\n${context || ''}` },
            ],
            temperature: 0.3,
            stream: false,
        };

        console.log('POE Request:', JSON.stringify({ url: POE_API_URL, model: botName, keyPrefix: apiKey.substring(0, 8) + '...' }));

        const response = await fetch(POE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();
        console.log('POE Response status:', response.status, 'body:', responseText.substring(0, 500));

        if (!response.ok) {
            return res.status(502).json({
                error: `Erro POE API (${response.status})`,
                details: responseText.substring(0, 300),
            });
        }

        const data = JSON.parse(responseText);
        const aiMessage = data.choices?.[0]?.message?.content || 'Sem resposta da IA.';

        return res.status(200).json({
            role: 'assistant',
            content: aiMessage,
        });
    } catch (error: any) {
        console.error('AI Proxy error:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor',
            details: error.message || String(error),
        });
    }
}
