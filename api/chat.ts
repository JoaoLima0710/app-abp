
// Vercel Serverless Function — IA multi-provider com fallback automático
// POE (primário, RAG com documentos) → Gemini (fallback, conhecimento geral)

const PROMPTS = {
    explain: `Você é um tutor especialista em Psiquiatria para provas de título da ABP.
Sua função é explicar questões de prova de forma clara e aprofundada.

REGRAS:
- Responda EXCLUSIVAMENTE com base na Psiquiatria Clínica Baseada em Evidências, DSM-5-TR e Tratado de Psiquiatria da ABP.
- PROIBIÇÃO ABSOLUTA: NUNCA utilize termos de psicanálise, coaching, jargões terapêuticos genéricos ou filosofias sem comprovação clínica robusta. Seu foco é NEUROBIOLOGIA, PSICOFARMACOLOGIA e DIAGNÓSTICO ESTRITO.
- Se a informação não constar nos documentos fornecidos ou na literatura psiquiátrica clínica, diga explicitamente: "Esta informação não consta nos materiais de referência."
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
2. Aprofunde-se ao máximo no tema principal, focando EXCLUSIVAMENTE nos critérios diagnósticos do DSM-5-TR, epidemiologia clínica, quadro clínico, neurobiologia, diagnósticos diferenciais estruturados e tratamento (psicofarmacologia e abordagens validadas).
3. PROIBIÇÃO ABSOLUTA: JAMAIS utilize linguagem psicanalítica, devaneios filosóficos, conselhos de coaching ou explicações não amparadas pela Psiquiatria Baseada em Evidências.
4. Traga detalhes que costumam cair em provas (pegadinhas, exceções à regra, efeitos adversos específicos de medicações, interações medicamentosas clássicas).
5. Dê super destaque à resolução dos conceitos que o usuário demonstrou dificuldade.
6. Responda EXCLUSIVAMENTE com base na literatura médica psiquiátrica atualizada (DSM-5-TR e Tratado de Psiquiatria da ABP).
7. Use formatação Markdown rica: títulos (##), listas, negritos para destacar palavras-chave médicas, e blocos de citação (>) para dicas ou "Red Flags Clínicas".
8. O guia deve parecer uma aula magistral transcrita, altamente didática, focada e pragmática para residentes de psiquiatria.`,

    generate_flashcards: `Você é um especialista em criação de Flashcards estilo Anki para a Prova de Título de Psiquiatria da ABP.
Sua função é gerar questões curtas, diretas e de alto rendimento (high-yield) sobre o tema solicitado.

MUITO IMPORTANTE: Caso o usuário forneça um CONTEXTO contendo as "Questões que o usuário errou", você DEVE EXTRAIR APENAS O CONCEITO TEÓRICO DESSAS QUESTÕES.
PROIBIÇÃO ABSOLUTA 1: NUNCA copie o texto do enunciado ou referências bibliográficas (como "referência: Nardi...", "De acordo com...", "Assinale a alternativa incorreta").
PROIBIÇÃO ABSOLUTA 2: NUNCA crie flashcards com formato de múltipla escolha ("Qual a alternativa correta?"). O flashcard DEVE ser uma pergunta clínica conceitual direta.

REGRAS ESTABELECIDAS:
1. PROIBIDO FORMATO VERDADEIRO OU FALSO: NUNCA crie flashcards de julgamento (V/F). O cérebro médico aprende por associação de sintomas e condutas.
2. FOCO CLÍNICO DIRETIVO: Crie perguntas de "Associação Clínica", "Gatilho Diagnóstico", "Qual o tratamento de primeira linha?", "Qual o mecanismo de ação?".
3. A pergunta (front) deve ser ultra direta e provocar a recordação ativa rápida. (Ex: "Mecanismo de ação do Aripiprazol na via tuberoinfundibular?").
4. A resposta (back) deve ser EXTREMAMENTE concisa, ideal para leitura em 2 segundos. Use mnemônicos se aplicável.
5. Retorne EXCLUSIVAMENTE um array JSON válido contendo os flashcards. NENHUM texto adicional antes ou depois do colchete do JSON. NUNCA use aspas triplas ou marcadores markdown ao redor do JSON. Mande APENAS o JSON puro.

FORMATO DE SAÍDA OBRIGATÓRIO (JSON STRICT):
[
  {
    "front": "Qual é a alteração no ECG mais característica associada ao uso de lítio?",
    "back": "Inversão ou achatamento da onda T."
  },
  {
    "front": "Paciente com depressão bipolar + obesidade severa. Qual o anticonvulsivante de escolha para estabilização de humor que favorece perda de peso?",
    "back": "Topiramato."
  },
  {
    "front": "Qual o principal efeito colateral metabólico associado à Clozapina e Olanzapina?",
    "back": "Ganho de peso e Síndrome Metabólica."
  }
]

Gere entre 5 e 8 flashcards rigorosamente precisos e objetivos para o tema solicitado.`,

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

    guided_review: `Você é um Tutor Socrático Especialista na Prova de Título de Psiquiatria da ABP.
O aluno acabou de finalizar um simulado e ERROU a questão que ele está te apresentando.
Ele quer entender o porquê errou.

REGRA DE OURO (MÉTODO SOCRÁTICO CLÍNICO):
- NUNCA DÊ A RESPOSTA DIRETAMENTE NO PRIMEIRO CONTATO.
- Seu objetivo é fazer o aluno raciocinar e chegar à conclusão sozinho usando lógica médica.
- Inicie a conversa de forma empática, mas direta e pragmática ("Vi que você marcou a alternativa X, mas vamos revisar o critério...").
- Faça UMA pergunta direcionada sobre o critério diagnóstico principal, mecanismo de ação, ou pista clínica que ele deixou passar no enunciado.
- PROIBIÇÃO ABSOLUTA: JAMAIS adote postura de coaching, perguntas psicanalíticas ("o que você sentiu ao errar?") ou divagações. Seu método socrático deve ser estritamente focado em Semiologia, Psicopatologia, Neurobiologia, Psicofarmacologia e DSM-5-TR.

ESTRUTURA DAS SUAS MENSAGENS:
- Seja extremamente conciso (pareça um chat de WhatsApp com um colega supervisor).
- Se o aluno responder corretamente a sua pergunta socrática, parabenize-o e então libere o resumo completo do conceito clínico.
- Se o aluno continuar errando ou pedir a resposta, explique de forma brilhante e didática usando mnemônicos e o DSM-5-TR.`,
};

type ActionType = keyof typeof PROMPTS;

// ── POE (OpenAI-compatible) ──────────────────────────────────────────
async function callPoe(question: string, context: string, action: ActionType): Promise<string> {
    const apiKey = process.env.POE_API_KEY;
    const botName = process.env.POE_BOT_NAME || 'GPT-4o';
    if (!apiKey) throw new Error('POE_API_KEY ausente');

    const systemPrompt = PROMPTS[action] || PROMPTS.explain;
    const userPrompt = action === 'explain' || action === 'guided_review'
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
    const userPrompt = action === 'explain' || action === 'guided_review'
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

        // Cleanup AI artifacts and formatting
        if (content) {
            // Remove POE citations like [[1]] or [[1]][doc_1]
            content = content.replace(/\[\[\d+\]\](\[doc_\d+\])?/g, '');
            // Remove fallback citations like [1]
            content = content.replace(/\[\d+\]/g, '');
            // Remove Markdown bolding asterisks to prevent literal '**' bleeding into UI
            content = content.replace(/\*\*(.*?)\*\*/g, '$1');
            // Safely trim 
            content = content.trim();
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
