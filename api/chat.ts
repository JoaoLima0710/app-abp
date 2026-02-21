
// Vercel Serverless Function — IA multi-provider com fallback automático
// POE (primário, RAG com documentos) → Gemini (fallback, conhecimento geral)

const PROMPTS = {
    explain: `Você é um tutor especialista em Psiquiatria para provas de título da ABP.
Sua função é explicar questões de prova de forma clara e aprofundada.

REGRAS:
- Responda EXCLUSIVAMENTE com base nos documentos da sua base de conhecimento (DSM-5-TR e Tratado de Psiquiatria da ABP).
- Se a informação não constar nos documentos fornecidos, diga explicitamente: "Esta informação não consta nos materiais de referência."
- NUNCA invente ou extrapole informações além do que está nos documentos.
- Cite a fonte (livro e seção/capítulo) sempre que possível.

FORMATO DA RESPOSTA:
1. **Por que a alternativa correta está certa**: Explique o raciocínio clínico e os critérios diagnósticos que sustentam a resposta.
2. **Por que as outras alternativas estão erradas**: Analise brevemente cada alternativa incorreta, explicando o erro conceitual.
3. **Conceito-chave**: Resuma o conceito central que a questão está testando.
4. **Dica de prova**: Se aplicável, dê uma dica prática para lembrar o conteúdo em provas futuras.

Cite critérios diagnósticos (ex: "Critério A do DSM-5-TR para Esquizofrenia") sempre que possível.
Use linguagem didática e acessível, como se estivesse explicando para um residente.`,

    study_guide: `Você é um tutor e mentor especialista em Psiquiatria para a Prova de Título da ABP.
Sua função é criar um GUIA DE ESTUDOS PROFUNDO e DENSO sobre um ÚNICO TEMA específico que o usuário solicitar.

REGRAS:
- Aprofunde-se ao máximo no tema, focando nos critérios diagnósticos do DSM-5-TR, epidemiologia clínica, quadro clínico, diagnósticos diferenciais e tratamento (psicofarmacologia e psicoterapia).
- Traga detalhes que costumam cair em provas (pegadinhas, exceções à regra, efeitos adversos específicos de medicações).
- Responda EXCLUSIVAMENTE com base na literatura médica psiquiátrica atualizada (DSM-5-TR e Tratado de Psiquiatria da ABP).
- NUNCA invente informações.
- Use formatação Markdown rica: títulos (##), listas, negritos para destacar palavras-chave, e blocos de citação (>) para dicas ou "Red Flags".
- O guia deve parecer uma aula transcrita, altamente didática, estruturada e focada em residentes de psiquiatria.
- Não faça introduções genéricas conversacionais, vá direto ao conteúdo de alto rendimento.`,

    generate_flashcards: `Você é um especialista em criação de Flashcards estilo Anki para a Prova de Título de Psiquiatria da ABP.
Sua função é gerar questões curtas, diretas e de alto rendimento (high-yield) sobre o tema solicitado.

REGRAS ESTABELECIDAS:
- Os flashcards devem focar na memorização de critérios diagnósticos, mecanismos de ação, efeitos colaterais genéricos e específicos, antídotos, e conceitos-chave do DSM-5-TR.
- A pergunta (front) deve ser direta e provocar a recordação ativa.
- A resposta (back) deve ser precisa e concisa. Use mnemônicos se aplicável.
- Retorne EXCLUSIVAMENTE um array JSON válido contendo os flashcards. NENHUM texto adicional antes ou depois do colchete do JSON. NUNCA use aspas triplas ou marcadores markdown ao redor do JSON. Mande APENAS o JSON puro.

FORMATO DE SAÍDA OBRIGATÓRIO (JSON STRICT):
[
  {
    "front": "Qual é a alteração no ECG mais característica associada ao uso de lítio?",
    "back": "Inversão da onda T."
  },
  {
    "front": "Quais os 3 componentes da Tríade de Beck (Depressão)?",
    "back": "Visão negativa de si mesmo, do mundo e do futuro."
  }
]

Gere entre 5 e 8 flashcards rigorosamente precisos para o tema solicitado.`
};

type ActionType = keyof typeof PROMPTS;

// ── POE (OpenAI-compatible) ──────────────────────────────────────────
async function callPoe(question: string, context: string, action: ActionType): Promise<string> {
    const apiKey = process.env.POE_API_KEY;
    const botName = process.env.POE_BOT_NAME || 'GPT-4o';
    if (!apiKey) throw new Error('POE_API_KEY ausente');

    const systemPrompt = PROMPTS[action] || PROMPTS.explain;
    const userPrompt = action === 'explain'
        ? `Questão: ${question}\n\n${context || ''}`
        : `Tema a ser abordado: ${question}\n\n${context || ''}`;

    const res = await fetch('https://api.poe.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: botName,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: action === 'generate_flashcards' ? 0.1 : 0.3,
            stream: false,
        }),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`POE ${res.status}: ${text.substring(0, 200)}`);
    const data = JSON.parse(text);
    return data.choices?.[0]?.message?.content || 'Sem resposta da IA.';
}

// ── Gemini ───────────────────────────────────────────────────────────
async function callGemini(question: string, context: string, action: ActionType): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    if (!apiKey) throw new Error('GEMINI_API_KEY ausente');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const systemPrompt = PROMPTS[action] || PROMPTS.explain;
    const userPrompt = action === 'explain'
        ? `Questão: ${question}\n\n${context || ''}`
        : `Tema a ser abordado: ${question}\n\n${context || ''}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [
                { role: 'user', parts: [{ text: userPrompt }] },
            ],
            generationConfig: {
                temperature: action === 'generate_flashcards' ? 0.1 : 0.3,
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
        const { question, context, action = 'explain' } = req.body;
        if (!question) return res.status(400).json({ error: 'Campo "question" é obrigatório' });

        let content: string;
        let provider: string;

        // Tenta POE primeiro (RAG com documentos)
        try {
            console.log('Tentando POE (primário)...');
            content = await callPoe(question, context, action);
            provider = 'poe';
            console.log('POE respondeu com sucesso');
        } catch (poeError: any) {
            console.warn('POE falhou:', poeError.message);

            // Fallback para Gemini
            try {
                console.log('Fallback → Gemini...');
                content = await callGemini(question, context, action);
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
