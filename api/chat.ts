
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

MUITO IMPORTANTE: Caso o usuário forneça um CONTEXTO contendo as "Questões que o usuário errou", você DEVE centralizar a explicação nesses tópicos! O guia deve garantir que o aluno sane exatamente as dúvidas que o levou a errar essas questões, sem deixar de cobrir as bases do tema.

REGRAS E ESTRUTURA:
1. Comece o guia com um parágrafo de introdução chamado "🎯 Foco de Estudo Personalizado".
   - SE houver questões erradas no contexto, analise-as rapidamente e Diga (como um professor): "João, analisando o seu histórico, notei que precisamos focar principalmente em [Subtema 1] e [Subtema 2], que foram os pontos dos seus erros recentes. Vamos revisar a base, mas aprofundar exatamente nessas fraquezas."
   - SE NÃO houver questões erradas no contexto, faça uma introdução clássica sobre a importância do tema para a prova da ABP.
2. Aprofunde-se ao máximo no tema principal, focando nos critérios diagnósticos do DSM-5-TR, epidemiologia clínica, quadro clínico, diagnósticos diferenciais e tratamento.
3. Traga detalhes que costumam cair em provas (pegadinhas, exceções à regra, efeitos adversos específicos de medicações).
4. Dê super destaque à resolução dos conceitos que o usuário demonstrou dificuldade.
5. Responda EXCLUSIVAMENTE com base na literatura médica psiquiátrica atualizada (DSM-5-TR e Tratado de Psiquiatria da ABP).
6. Use formatação Markdown rica: títulos (##), listas, negritos para destacar palavras-chave, e blocos de citação (>) para dicas ou "Red Flags".
7. O guia deve parecer uma aula transcrita, altamente didática, estruturada e focada em residentes de psiquiatria.`,

    generate_flashcards: `Você é um especialista em criação de Flashcards estilo Anki para a Prova de Título de Psiquiatria da ABP.
Sua função é gerar questões curtas, diretas e de alto rendimento (high-yield) sobre o tema solicitado.

MUITO IMPORTANTE: Caso o usuário forneça um CONTEXTO contendo as "Questões que o usuário errou", os flashcards gerados DEVEM priorizar maciçamente a fixação dos conceitos falhos exibidos nessas questões.

REGRAS ESTABELECIDAS:
- Os flashcards devem focar na memorização de critérios diagnósticos, mecanismos de ação, efeitos colaterais genéricos e específicos, antídotos, e conceitos-chave do DSM-5-TR, especialmente os que o usuário errou.
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

Gere entre 5 e 8 flashcards rigorosamente precisos para o tema solicitado.`,

    analyze_plan: `Você é um Estrategista Especialista em Provas de Residência Médica e Título de Especialista em Psiquiatria (ABP).
Sua função é analisar os DADOS DE DESEMPENHO ESTATÍSTICO do aluno que serão enviados no prompt, e gerar um Laudo Estratégico de Estudos em Markdown puro.

MUITO IMPORTANTE (CRUZAMENTO DE INCIDÊNCIA):
Você, como conhecedor da prova da ABP, sabe quais temas despencam na prova (Alto Rendimento / High Yield) como Psicofarmacologia, Esquizofrenia, Transtornos do Humor, etc, e quais caem pouco (Low Yield).
Você DEVE avaliar os erros do aluno pesando a gravidade deles com base na incidência na prova.
Exemplo: Se o aluno tem 40% de acerto em Psicofarmacologia, isso é CRÍTICO (alerta vermelho). Se ele tem 40% em Psiquiatria Geriátrica, é ruim, mas menos urgente no curto prazo.

ESTRUTURA OBRIGATÓRIA DA SUA RESPOSTA:
1. Comece com um cabeçalho: "# 📊 Análise Estratégica do Seu Plano de Estudos"
2. Faça um breve RESUMO de como o aluno está de forma geral (considerando o volume de questões feitas).
3. Crie a seção "🎯 Alvos Críticos (Alto Rendimento)": Destaque os temas muito incidentes na ABP onde o aluno está com aproveitamento baixo ou tendência de queda. Explique *por que* é perigoso negligenciar isso.
4. Crie a seção "💡 Onde você está mandando bem": Reconheça os acertos e temas de boa performance.
5. Termine com a seção "📝 Plano de Ação Prático": Dê 3 orientações aplicáveis (ex: "Foque suas próximas 48h fazendo apenas simulados de Psicofarmaco", "Crie flashcards de critério A para Esquizofrenia", etc).

REGRAS ESTÉTICAS:
- Seu retorno será postado dentro de uma página da web já muito bonita e moderna.
- Use emojis moderadamente, negritos para nomes de temas, e blocos de citação (>) para destacar regras mentais ou insights centrais.
- Mantenha um tom profissional, acolhedor e instigante. Sem rodeios exagerados.`,
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
        if (!question && action !== 'analyze_plan') return res.status(400).json({ error: 'Campo "question" é obrigatório' });

        let content: string;
        let provider: string;

        // Se a ação for analyze_plan, pular o POE e usar estritamente o Gemini (pois exige alta capacidade de raciocínio de volume numérico que o prompt do POE não está otimizado para)
        if (action === 'analyze_plan') {
            console.log('Action: analyze_plan apontada diretamente para Gemini');
            content = await callGemini(question, context, action);
            provider = 'gemini';
            return res.status(200).json({ role: 'assistant', content, provider });
        }

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
