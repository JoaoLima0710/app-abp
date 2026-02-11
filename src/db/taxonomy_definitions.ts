// ============================================
// 📄 src/data/taxonomy_definitions_v2.ts
// ============================================
//
// ESTRUTURA DE 3 NÍVEIS:
//   Nível 1 → Tema (PsychiatryTheme)       ex: 'psicofarmacologia'
//   Nível 2 → Categoria (SubthemeCategory)  ex: 'Antidepressivos — ISRS'
//   Nível 3 → Tópicos (string[])           ex: ['Fluoxetina', 'Sertralina', ...]

import { PsychiatryTheme, QuestionTaxonomy } from '../types';

// ─── Interfaces ──────────────────────────────────────────────

export interface SubthemeCategory {
    /** Nome da categoria intermediária (nível 2) */
    label: string;
    /** Tópicos específicos dentro desta categoria (nível 3) */
    topics: string[];
}

// Mantém os exports antigos para retrocompatibilidade
export const TAXONOMY_TIERS: Record<number, string> = {
    1: 'Fundamentos Essenciais (Must Know)',
    2: 'Diagnóstico e Psicopatologia (Core)',
    3: 'Terapêutica e Manejo (Advanced)',
    4: 'Minúcias e Rodapé (Expert)',
};

export const TAXONOMY_AXIS_LABELS: Record<QuestionTaxonomy['axis'], string> = {
    diagnostico: 'Diagnóstico e Quadro Clínico',
    farmacologia: 'Psicofarmacologia',
    psicopatologia: 'Psicopatologia',
    epidemiologia: 'Epidemiologia',
    tratamento_nao_farmacologico: 'Terapias Não-Farmacológicas',
    etica_legislacao: 'Ética e Legislação',
    fundamentos: 'Fundamentos e Neurociências',
    gestao: 'Gestão e Saúde Pública',
    intervencao: 'Intervenção e Manejo',
};

export const COGNITIVE_SKILLS_LABELS: Record<QuestionTaxonomy['cognitiveSkill'], string> = {
    memorizacao: 'Memorização (Recall)',
    compreensao: 'Compreensão de Conceitos',
    aplicacao: 'Aplicação Médica',
    analise: 'Análise de Casos',
    sintese: 'Síntese de Dados',
    raciocinio_clinico: 'Raciocínio Clínico',
    aplicacao_pratica: 'Conduta e Manejo',
};

// ─── TAXONOMIA V2 — 3 NÍVEIS ────────────────────────────────

export const THEME_SUBDIVISIONS_V2: Record<PsychiatryTheme, SubthemeCategory[]> = {

    // 1. DEPENDÊNCIA QUÍMICA
    dependencia_quimica: [
        { label: 'Conceitos e Classificação', topics: ['Conceitos Fundamentais', 'Classificação DSM-5', 'Dependência Química', 'Neurobiologia da Dependência', 'Tolerância e Sensibilização', 'Sistema de Recompensa e Dopamina'] },
        { label: 'Álcool', topics: ['Álcool', 'Genética do Álcool', 'Abstinência Alcoólica', 'Delirium Tremens', 'Síndrome de Wernicke-Korsakoff', 'Esteatose e Hepatopatia Alcoólica', 'Tratamento Farmacológico (Naltrexona, Dissulfiram, Acamprosato)', 'CAGE e AUDIT'] },
        { label: 'Cannabis', topics: ['Cannabis', 'Cannabis Medicinal', 'Abstinência de Cannabis', 'Maconha e Comorbidades', 'Mitologia vs Fatos: Maconha', 'Síndrome de Hiperêmese Canabinoide'] },
        { label: 'Estimulantes', topics: ['Estimulantes', 'Cocaína e Crack', 'Anfetaminas e Metanfetamina', 'Intoxicação e Abstinência por Estimulantes'] },
        { label: 'Opioides', topics: ['Opioides', 'Abstinência de Opioides', 'Terapia de Substituição (Metadona/Buprenorfina)', 'Overdose e Naloxona'] },
        { label: 'Tabaco e Nicotina', topics: ['Abstinência de Nicotina (DSM-5)', 'Tratamento do Tabagismo (Vareniclina, TRN, Bupropiona)', 'Escala de Fagerström'] },
        { label: 'Alucinógenos e Outras Substâncias', topics: ['Transtorno Persistente da Percepção por Alucinógenos (HPPD)', 'LSD e Psilocibina', 'MDMA/Ecstasy', 'Inalantes', 'Novas Substâncias Psicoativas (NSP)', 'GHB e Cetamina Recreativa'] },
        { label: 'Dependências Comportamentais', topics: ['Transtorno do Jogo', 'Dependência de Internet e Jogos Eletrônicos', 'Compras Compulsivas'] },
        { label: 'Tratamento e Reabilitação', topics: ['Psicoterapia', 'TCC', 'Entrevista Motivacional', 'Prevenção de Recaída (Marlatt)', 'Comunidades Terapêuticas', 'Redução de Danos', 'Grupos de Mútua Ajuda (AA/NA)'] },
        { label: 'Políticas e Gestão', topics: ['Gestão e Organização (Portaria 3.588/2017)', 'CAPS AD (Tipos e Funcionamento)', 'Internação Compulsória e Involuntária'] },
    ],

    // 2. ESQUIZOFRENIA E PSICOSE
    esquizofrenia_psicose: [
        { label: 'Esquizofrenia — Clínica e Diagnóstico', topics: ['Esquizofrenia', 'Sintomas Positivos', 'Sintomas Negativos', 'Cognição', 'Subtipos Catatônicos', 'Critérios DSM-5 e CID-11', 'Fases da Esquizofrenia (Prodrômica, Ativa, Residual)'] },
        { label: 'Outros Transtornos do Espectro Psicótico', topics: ['Psicose Breve', 'Transtorno Esquizofreniforme (Duração)', 'Transtorno Esquizoafetivo (Critérios)', 'Transtorno Delirante vs Esquizofrenia', 'Psicose Induzida por Substâncias', 'Psicose em Condições Médicas Gerais'] },
        { label: 'Psicopatologia da Psicose', topics: ['Psicopatologia', 'Delírio', 'Alucinações', 'Desorganização do Pensamento', 'Neuropsicologia'] },
        { label: 'Neurobiologia e Genética', topics: ['Neurobiologia', 'Genética', 'Fisiopatologia (Ácido Quinurênico)', 'Teoria Serotoninérgica (Glutamato)', 'Hipótese Dopaminérgica', 'Hipótese Glutamatérgica', 'Causalidade: Cannabis e Psicose', 'Neurodesenvolvimento e Esquizofrenia'] },
        { label: 'Tratamento', topics: ['Tratamento', 'Primeiro Episódio Psicótico', 'Esquizofrenia Resistente e Clozapina', 'Reabilitação Psicossocial na Esquizofrenia', 'Antipsicóticos LAI na Esquizofrenia'] },
    ],

    // 3. ÉTICA, FORENSE E LEGAL
    etica_forense_legal: [
        { label: 'Bioética e Princípios Fundamentais', topics: ['Bioética', 'Ética Médica', 'Ética vs Moral (Conceitos)', 'Principialismo', 'Princípios Bioéticos (Justiça)', 'Ética e Legislação', 'Consentimento Informado', 'Sigilo Médico e Quebra de Sigilo'] },
        { label: 'Legislação Psiquiátrica', topics: ['Legislação', 'Lei 10.216 (Internação)', 'Lei da Reforma Psiquiátrica (Lei 10.216/2001)', 'Lei 13.146 (Estatuto da Pessoa com Deficiência)', 'Lei de Drogas (Lei 13.840/2019)', 'Resolução CFM 2.336/2023', 'Regulação Sanitária', 'Resolução ANVISA RDC 327', 'Tipos de Internação (Voluntária, Involuntária, Compulsória)'] },
        { label: 'Suicídio e Prevenção', topics: ['Suicídio', 'Prevenção do Suicídio', 'Prevenção do Suicídio (Lei 13.819/2019)', 'Lei 13.819/2019 (Vovó Rose)', 'Posvenção (Cuidado aos Sobreviventes)'] },
        { label: 'Perícia e Psiquiatria Forense', topics: ['Perícia', 'Perícia Médica', 'Simulação e Falsidade em Perícias', 'Avaliação de Risco de Violência e Reincidência', 'Imputabilidade', 'Incapacidade Civil (Art. 3º e 4º Código Civil)', 'Capacidade Testamentária', 'Atestados Médicos (Tipologia e Falsidade)', 'Saúde Mental Prisional', 'Medida de Segurança', 'Semi-imputabilidade'] },
        { label: 'Ética Profissional e Regulação', topics: ['Publicidade Médica', 'Publicidade Médica (Resolução CFM 1.974/2011)', 'Ética em Psiquiatria Infantil', 'Código de Ética Médica (Princípios)'] },
        { label: 'Identidade de Gênero e Sexualidade', topics: ['Identidade de Gênero', 'Ética e Legislação (Resolução CFM 2.265/2019)', 'Pedofilia: Critérios do DSM-5'] },
        { label: 'Estigma e Sociedade', topics: ['Estigma e Repercussões Familiares', 'Estigma e Trabalho', 'Violência Urbana e Saúde Mental'] },
        { label: 'Espiritualidade e Religiosidade', topics: ['Espiritualidade e Saúde', 'Espiritualidade/Religiosidade'] },
        { label: 'Psicopatologia Forense', topics: ['Psicopatologia', 'Transtornos do Controle dos Impulsos'] },
    ],

    // 4. NEUROCIÊNCIAS
    neurociencias: [
        { label: 'Neuroanatomia', topics: ['Neuroanatomia', 'Neuroanatomia Límbica', 'Neuroanatomia da Ansiedade', 'Neuroanatomia da Emoção', 'Embriologia do SN', 'Exame Neurológico', 'Gânglios da Base', 'Córtex Pré-Frontal (DLPFC, VMPFC, OFC)', 'Amígdala e Hipocampo'] },
        { label: 'Neurotransmissão — Serotonina', topics: ['Sistemas de Neurotransmissão: Serotonina', 'Síntese da Serotonina', 'Receptores 5-HT (Subtipos)', 'Núcleos da Rafe'] },
        { label: 'Neurotransmissão — Dopamina', topics: ['Via Tuberoinfundibular (Dopamina)', 'Via Mesolímbica', 'Via Mesocortical', 'Via Nigroestriatal', 'Receptores D1-D5'] },
        { label: 'Neurotransmissão — GABA e Glutamato', topics: ['Receptores GABA-A (Efeitos Iônicos)', 'Sistema Glutamatérgico (NMDA, AMPA)', 'Balanço Excitação/Inibição'] },
        { label: 'Neurotransmissão — Outros Sistemas', topics: ['Neurotransmissores', 'Sistema Noradrenérgico (Locus Coeruleus)', 'Sistema Colinérgico (Núcleo Basal de Meynert)', 'Sistema Histaminérgico'] },
        { label: 'Sistema Endocanabinoide', topics: ['Endocanabinoides (Sinalização)', 'Sistema Endocanabinoide (Degradação do 2-AG)', 'Sistemas Regulados por Endocanabinoides', 'Neurotransmissão (Endocanabinoides)', 'Receptores CB1 e CB2'] },
        { label: 'Neurocircuitos e Redes Neurais', topics: ['Neurocircuitos', 'Redes Neurais (DMN)', 'Default Mode Network (DMN) e Depressão', 'DMN e Ruminação na Depressão', 'Circuitos Cerebrais no TDM', 'Circuitos de Ansiedade', 'Salience Network', 'Central Executive Network'] },
        { label: 'Neurobiologia e Plasticidade', topics: ['Neurobiologia', 'Neurobiologia - Alzheimer', 'Neurobiologia da Ansiedade', 'Neurobiologia do Desenvolvimento (Poda)', 'Neuroplasticidade', 'Potenciação de Longo Prazo (LTP)', 'BDNF', 'Neurofisiologia', 'Neurogênese Adulta'] },
        { label: 'Neuroendocrinologia', topics: ['Neuroendocrinologia', 'TEPT e Eixo HPA', 'Eixo Hipotálamo-Hipófise-Adrenal (HPA)', 'Eixo Hipotálamo-Hipófise-Tireoide (HPT)', 'Eixo Hipotálamo-Hipófise-Gonadal (HPG)', 'Cortisol e Estresse Crônico'] },
        { label: 'Neuroimagem', topics: ['Neuroimagem', 'Neuroimagem (DTI no TOC)', 'Neuroimagem em Psiquiatria', 'Neuroimagem em Psiquiatria (TC vs Ressonância)', 'Neuroimagem funcional', 'Neuroimagem na Doença de Alzheimer', 'Espectroscopia (ERM)', 'PET e SPECT', 'Ressonância Magnética Funcional (fMRI)'] },
        { label: 'Neuroestimulação e Neuromodulação', topics: ['Neuroestimulação', 'Neuromodulação', 'Estimulação Magnética', 'Estimulação Magnética Transcraniana (EMT)', 'TMS', 'Estimulação (tDCS)', 'Eletroconvulsoterapia (ECT)', 'Contraindicações da ECT', 'Neurocirurgia/Estimulação', 'Estimulação do Nervo Vago (VNS)', 'Deep Brain Stimulation (DBS)'] },
        { label: 'Genética e Epigenética', topics: ['Genética', 'Epigenética', 'GWAS e Poligenia', 'Metilação do DNA'] },
        { label: 'Cognição e Neuropsicologia', topics: ['Funções Cognitivas', 'Neuropsicologia', 'Domínios da Cognição Social', 'Funcionalidade', 'Teoria da Mente'] },
        { label: 'Psicopatologia (Bases Neurais)', topics: ['Psicopatologia', 'Psicopatologia - Afetividade', 'Psicopatologia - Conação', 'Psicopatologia - Consciência', 'Psicopatologia - Pensamento'] },
        { label: 'Sono e Cronobiologia', topics: ['Sono e Vigília', 'Transtornos do Sono', 'Arquitetura do Sono (NREM/REM)', 'Polissonografia', 'Ritmo Circadiano e Melatonina'] },
        { label: 'Demências (Neurociência)', topics: ['Demências', 'Aducanumabe e Efeitos ARIA', 'CCL', 'Proteínas Tau e Beta-Amiloide'] },
        { label: 'Neurobiologia de Transtornos Específicos', topics: ['TEPT', 'TEPT: Alterações de Cognição e Humor', 'Transtornos Alimentares', 'Transtornos Dissociativos', 'Transtorno Explosivo Intermitente (TEI)', 'Endofenótipos no TOC'] },
        { label: 'Modelos Nosológicos', topics: ['Modelos Nosológicos (HiTOP)', 'RDoC', 'RDoC (Research Domain Criteria)', 'RDoC (Sistemas de Valência)'] },
        { label: 'Metodologia, Tecnologia e Inovação', topics: ['Ensaios Clínicos (Intenção de Tratamento)', 'Metodologia Científica (Crossover)', 'Psicometria', 'Inteligência Artificial', 'Psiquiatria Digital'] },
        { label: 'Tópicos Especiais', topics: ['Oncopsiquiatria', 'Esteroides Anabólicos Androgênicos (EAA)', 'Sexualidade', 'Espiritualidade e Saúde', 'NeuroAIDS: Déficits Neurocognitivos', 'Ataque Isquêmico Transitório (AIT)', 'Afasia de Condução'] },
    ],

    // 5. PSICOFARMACOLOGIA
    psicofarmacologia: [
        { label: 'Farmacologia Básica e Princípios', topics: ['Farmacocinética', 'Farmacodinâmica vs Farmacocinética', 'Mecanismos de Ação (Agonistas)', 'Biodisponibilidade e Genéricos', 'Farmacogenética', 'Hepatotoxicidade', 'Receptores Serotoninérgicos', 'Receptor como Alvo (Ocupância)'] },
        { label: 'Interações Medicamentosas e CYP', topics: ['Interações Medicamentosas', 'Interações Medicamentosas (CYP3A4)', 'CYP2D6 — Metabolizadores Lentos e Rápidos', 'CYP1A2 — Tabaco e Fluvoxamina', 'CYP2C19 — Citalopram e Omeprazol', 'UGT (Glicuronidação — Lamotrigina/Valproato)'] },
        { label: 'Antidepressivos — ISRS', topics: ['Fluoxetina', 'Sertralina', 'Paroxetina', 'Citalopram', 'Escitalopram', 'Fluvoxamina', 'ISRS e Prolongamento do Intervalo QTc', 'ISRS — Mecanismo de Ação', 'Síndrome de Descontinuação de ISRS', 'ISRS na Gestação (Risco Neonatal)'] },
        { label: 'Antidepressivos — IRSN', topics: ['Venlafaxina', 'Desvenlafaxina', 'Duloxetina', 'Milnaciprano/Levomilnaciprano', 'Hipertensão por IRSN (Dose-Dependente)'] },
        { label: 'Antidepressivos — Tricíclicos (ADT)', topics: ['Amitriptilina', 'Nortriptilina', 'Clomipramina', 'Imipramina', 'Cardiotoxicidade dos ADT', 'Janela Terapêutica (Nortriptilina)', 'Efeitos Anticolinérgicos dos ADT'] },
        { label: 'Antidepressivos — IMAO', topics: ['Inibidores da MAO (Seletividade)', 'Tranilcipromina', 'Moclobemida (IMAO-A Reversível)', 'Selegilina Transdérmica', 'Restrições Alimentares (Tiramina)', 'Crise Hipertensiva por IMAO'] },
        { label: 'Antidepressivos — Atípicos e Multimodais', topics: ['Antidepressivos (Vortioxetina)', 'Bupropiona', 'Mirtazapina', 'Trazodona', 'Agomelatina', 'Vilazodona'] },
        { label: 'Antidepressivos — Conceitos e Estratégias', topics: ['Antidepressivos', 'Escolha do Antidepressivo', 'Cardiopatia e Antidepressivos', 'Disfunção Sexual', 'Segurança Cardiovascular', 'Síndrome Serotoninérgica', 'Otimização Terapêutica (Depressão)', 'Depressão Maior', 'Estratégias de Potencialização (Lítio, T3, Aripiprazol)', 'Troca de Antidepressivos (Switch e Washout)', 'Depressão Resistente ao Tratamento (TRD)', 'Latência de Ação dos Antidepressivos'] },
        { label: 'Antipsicóticos — Primeira Geração (Típicos)', topics: ['Haloperidol', 'Clorpromazina', 'Levomepromazina', 'Pimozida', 'Efeitos Extrapiramidais (SEP)', 'Distonia Aguda e Acatisia', 'Discinesia Tardia'] },
        { label: 'Antipsicóticos — Segunda Geração (Atípicos)', topics: ['Risperidona', 'Olanzapina', 'Quetiapina', 'Aripiprazol (Agonista Parcial D2)', 'Ziprasidona', 'Lurasidona', 'Cariprazina', 'Brexpiprazol', 'Clozapina: Contraindicações e Associações', 'Monitoramento Metabólico (Antipsicóticos)', 'Síndrome Metabólica e Antipsicóticos', 'Hiperprolactinemia por Antipsicóticos'] },
        { label: 'Antipsicóticos — LAI', topics: ['Antipsicóticos de Depósito (Efeitos Adversos)', 'Haloperidol Decanoato', 'Palmitato de Paliperidona (1 mês / 3 meses)', 'Risperidona LAI', 'Aripiprazol LAI (Maintena / Aristada)'] },
        { label: 'Antipsicóticos — Conceitos Gerais', topics: ['Antipsicóticos', 'Esquizofrenia', 'Efeitos Adversos', 'Bloqueio D2 e Janela Terapêutica', 'Equivalência de Doses (Clorpromazina-Equivalente)'] },
        { label: 'Estabilizadores de Humor — Lítio', topics: ['Lítio', 'Litemia Profilática (Consenso)', 'Lítio e Alterações no ECG', 'Lítio e Função Renal', 'Farmacocinética do Lítio: Excreção', 'Interações e Níveis de Lítio', 'Intoxicação por Lítio', 'Lítio na Gestação (Anomalia de Ebstein)', 'Monitoramento Laboratorial do Lítio', 'Lítio e Função Tireoidiana', 'Diabetes Insipidus Nefrogênico'] },
        { label: 'Estabilizadores de Humor — Anticonvulsivantes', topics: ['Estabilizadores de Humor', 'Valproato (Ácido Valproico/Divalproato)', 'Carbamazepina', 'Lamotrigina', 'Oxcarbazepina', 'Valproato na Gestação (Teratogenicidade)', 'Síndrome de Stevens-Johnson (Lamotrigina)', 'Hiponatremia por Carbamazepina/Oxcarbazepina'] },
        { label: 'Benzodiazepínicos e Hipnóticos', topics: ['Benzodiazepínicos — Mecanismo GABA-A', 'Diazepam', 'Clonazepam', 'Lorazepam', 'Alprazolam', 'Midazolam', 'Zolpidem e Z-Drugs', 'Dependência e Desmame de BZD', 'Flumazenil', 'BZD de Meia-Vida Longa vs Curta'] },
        { label: 'Novas Terapias e Psicodélicos', topics: ['Cetamina e Intervenções em Crise', 'Ketamina/Esketamina', 'Psicodélicos Clássicos (Mecanismos)', 'Cannabis Medicinal', 'Psilocibina (Ensaios Clínicos)', 'MDMA Assistida por Psicoterapia', 'Esketamina Intranasal (Spravato)'] },
        { label: 'Estimulantes e Fármacos para TDAH', topics: ['Estimulantes (Lisdexanfetamina)', 'Metilfenidato', 'Atomoxetina', 'Guanfacina', 'Clonidina'] },
        { label: 'Fármacos para Demências', topics: ['Inibidores da Colinesterase (Galantamina)', 'Inibidores da Colinesterase (Tacrina)', 'Donepezila', 'Rivastigmina', 'Memantina (Antagonista NMDA)', 'Aducanumabe e Lecanemabe'] },
        { label: 'Neuromodulação e ECT', topics: ['Neuromodulação', 'ECT na Catatonia Maligna', 'Mecanismos da ECT', 'Indicações da ECT', 'ECT de Manutenção'] },
        { label: 'Populações Especiais', topics: ['Gestação e Lactação', 'Psicofarmacologia no Idoso', 'Psicofarmacologia na Insuficiência Renal', 'Psicofarmacologia na Insuficiência Hepática', 'Psicofarmacologia na Infância e Adolescência', 'Polifarmácia e Desprescrição'] },
        { label: 'Indicações Terapêuticas Específicas', topics: ['Espectro TOC', 'Psicofarmacologia da Ansiedade', 'Impulsividade', 'Insônia (Farmacoterapia)', 'Dor Crônica e Psicofármacos'] },
        { label: 'Metodologia, Evidência e Outros', topics: ['Neurobiologia', 'Sexualidade', 'Sexualidade Humana', 'Psico-Oncologia', 'Níveis de Evidência (CANMAT)', 'Estatística Médica', 'Metodologia de Pesquisa', 'História da Psiquiatria'] },
    ],

    // 6. PSICOGERIATRIA
    psicogeriatria: [
        { label: 'Doença de Alzheimer', topics: ['Neuropatologia', 'Genética', 'Biomarcadores Plasmáticos na DA', 'DMD no Alzheimer (Alvos)', 'Neuroimagem (PET na DA)', 'Critérios NIA-AA', 'Framework ATN (Amiloide/Tau/Neurodegeneração)'] },
        { label: 'Comprometimento Cognitivo Leve (CCL)', topics: ['Comprometimento Cognitivo Leve', 'Comprometimento Cognitivo Leve (CCL)', 'Prejuízo Cognitivo Leve (CCL)', 'Avaliação Cognitiva', 'CCL Amnéstico vs Não-Amnéstico', 'Rastreio Cognitivo (MEEM, MoCA)'] },
        { label: 'Demências — Tipos', topics: ['Demência', 'Demências', 'Demência Frontotemporal', 'Demência Vascular', 'Demência com Corpos de Lewy (DCL)', 'Demência de Lewy', 'Demência por Doença de Parkinson', 'Pseudodemência vs Demência', 'Hidrocefalia de Pressão Normal'] },
        { label: 'Diagnóstico Diferencial', topics: ['Diagnóstico', 'Diagnóstico Diferencial', 'Causas Reversíveis de Demência'] },
        { label: 'Sintomas Neuropsiquiátricos e Comportamentais', topics: ['Sintomas Neuropsiquiátricos', 'Depressão no Idoso', 'Agitação e Psicose na Demência', 'Apatia no Idoso', 'Sundowning'] },
        { label: 'Delirium no Idoso', topics: ['Delirium', 'Fatores Precipitantes e Predisponentes', 'CAM (Confusion Assessment Method)'] },
        { label: 'Sono no Idoso', topics: ['Medicina do Sono', 'Apneia Obstrutiva do Sono no Idoso'] },
    ],

    // 7. PSICOPATOLOGIA E DIAGNÓSTICO
    psicopatologia_diagnostico: [
        { label: 'Consciência e Orientação', topics: ['Consciência e Atitude', 'Consciência e Orientação', 'Alterações Quantitativas (Obnubilação, Coma)', 'Alterações Qualitativas (Estado Crepuscular)'] },
        { label: 'Atenção', topics: ['Atenção', 'Psicopatologia da Atenção/Atitude', 'Psicopatologia: Alterações da Atenção', 'Hipoprosexia e Hiperprosexia'] },
        { label: 'Sensopercepção', topics: ['Sensopercepção (Sinestesia)', 'Psicopatologia (Pareidolia)', 'Alucinações (Tipos e Classificação)', 'Ilusões', 'Pseudoalucinações'] },
        { label: 'Memória', topics: ['Alterações da Memória', 'Alterações da Memória (Confabulação)', 'Psicopatologia da Memória', 'Amnésia Anterógrada vs Retrógrada', 'Déjà Vu e Jamais Vu'] },
        { label: 'Afetividade', topics: ['Afetividade', 'Labilidade Afetiva', 'Embotamento e Anedonia', 'Disforia e Irritabilidade'] },
        { label: 'Pensamento e Linguagem', topics: ['Psicopatologia: Alterações do Curso do Pensamento', 'Psicopatologia: Alterações do Conteúdo do Pensamento', 'Delírios (Classificação)', 'Ideias Sobrevaloradas'] },
        { label: 'Vontade, Psicomotricidade e Insight', topics: ['Vontade e Psicomotricidade', 'Exame Psicomotor (Qualitativo)', 'Psicopatologia - Insight', 'Catatonia', 'Abulia e Hipobulia'] },
        { label: 'Funções Executivas e Cognição', topics: ['Funções Executivas (Muriel Lezak)', 'Domínios Cognitivos (DSM-5)', 'Inteligência'] },
        { label: 'Exame Psiquiátrico e Avaliação', topics: ['Exame Mental', 'Exame Mental (Aparência e Atitude)', 'Exame do Estado Mental', 'Exame Neurológico', 'Exame Neuropsicológico', 'Exame Físico', 'Exames Laboratoriais', 'Escalas de Avaliação', 'Psicometria', 'Matriz Idiográfica', 'Consultoria Psiquiátrica'] },
        { label: 'Classificação e Sistemas Diagnósticos', topics: ['Classificação', 'Classificações', 'Classificações (DSM/CID/RDoC)', 'Sistemas Classificatórios', 'Diagnóstico', 'Psicopatologia', 'História da Psiquiatria', 'História da Psiquiatria (Leme Lopes)'] },
        { label: 'Transtornos do Controle de Impulsos', topics: ['Transtornos do Controle de Impulsos', 'Cleptomania', 'Cleptomania (Diagnóstico Diferencial)', 'Piromania', 'Piromania (Critérios)', 'Transtorno Explosivo Intermitente', 'Neurobiologia do TEI', 'Transtorno do Jogo (Diagnóstico Diferencial)'] },
        { label: 'Transtornos Dissociativos', topics: ['Transtornos Dissociativos', 'Transtorno Dissociativo (Possessão)', 'Dissociação e Cultura', 'Psicopatologia: Estados de Transe', 'Amnésia Dissociativa', 'Transtorno de Despersonalização/Desrealização'] },
        { label: 'Transtornos Somatoformes e Factícios', topics: ['Somatização', 'Transtorno Factício', 'Transtornos Factícios (Munchausen)', 'Transtorno de Sintomas Somáticos', 'Transtorno Conversivo (Funcional)', 'Transtorno de Ansiedade de Doença'] },
        { label: 'Sono — Diagnóstico e Avaliação', topics: ['Insônia', 'Transtorno de Insônia (Critérios)', 'Higiene do Sono', 'Sono (Cheyne-Stokes)', 'Sono - Exames', 'Síndrome das Pernas Inquietas', 'Narcolepsia', 'Parassonias'] },
        { label: 'Sexualidade, Gênero e Parafilias', topics: ['Disfunções Sexuais', 'Parafilias', 'Disforia de Gênero', 'Transtorno Pedofílico (Etiologia)', 'Ciclo de Resposta Sexual'] },
        { label: 'Espectro Obsessivo-Compulsivo', topics: ['Espectro Obsessivo-Compulsivo', 'Tricotilomania', 'Transtorno de Escoriação', 'Dismorfismo Corporal'] },
        { label: 'Trauma e Estresse', topics: ['TEPT (DSM-5 - Critério de Exposição)', 'NSSI (Autolesão não suicida)', 'Transtorno de Adaptação (Critérios Temporais)'] },
        { label: 'Espiritualidade e Cultura', topics: ['Espiritualidade', 'Coping Religioso (Negativo)', 'Problemas Religiosos e Espirituais (DSM-5)', 'Psicofobia (Etimologia)'] },
        { label: 'Demências (Psicopatologia)', topics: ['Demência com Corpos de Lewy (DCL)', 'Demências', 'Critérios de Síndrome Metabólica'] },
        { label: 'Teoria e Mecanismos de Defesa', topics: ['Mecanismos de Defesa', 'Teoria Psicanalítica'] },
        { label: 'Epidemiologia e Outros', topics: ['Esquizofrenia', 'Epidemiologia (SP Megacity)'] },
    ],

    // 8. PSICOTERAPIA
    psicoterapia: [
        { label: 'Terapias Cognitivo-Comportamentais', topics: ['TCC', 'DBT (Dialética Comportamental)', 'Terapia de Aceitação e Compromisso (ACT)', 'Exposição e Prevenção de Resposta (EPR)', 'Reestruturação Cognitiva', 'Ativação Comportamental', 'Terapia do Esquema'] },
        { label: 'Terapias para Trauma', topics: ['EMDR', 'Terapia de Processamento Cognitivo (CPT)', 'Exposição Prolongada (Foa)'] },
        { label: 'Terapias Psicodinâmicas', topics: ['Psicoterapia Psicodinâmica Breve', 'Mentalização (MBT)', 'Psicoterapia Focada na Transferência (TFP)'] },
        { label: 'Terapias Somáticas e Neuromodulação', topics: ['Eletroconvulsoterapia (ECT)', 'Neuromodulação'] },
        { label: 'Relação Terapêutica e Entrevista', topics: ['Entrevista Psiquiátrica', 'Relação Médico-Paciente', 'Transferência na Relação Médico-Paciente', 'Contratransferência', 'Aliança Terapêutica', 'Entrevista Motivacional'] },
        { label: 'Temas Específicos em Psicoterapia', topics: ['Espiritualidade em Psicoterapia', 'Sexualidade', 'Transtornos Dissociativos', 'Psicoeducação', 'Terapia de Grupo', 'Terapia Familiar e de Casal'] },
    ],

    // 9. PSIQUIATRIA INFANTOJUVENIL
    psiquiatria_infantojuvenil: [
        { label: 'Desenvolvimento Normal', topics: ['Desenvolvimento', 'Desenvolvimento Adolescente', 'Desenvolvimento Cognitivo na Adolescência (Elkind)', 'Desenvolvimento Moral (Lawrence Kohlberg)', 'Marcos do Desenvolvimento', 'Adolescência', 'Fatores de Risco e Desenvolvimento', 'Psicopatologia do Desenvolvimento', 'Teoria do Apego (Bowlby/Ainsworth)', 'Teoria de Piaget', 'Teoria de Vygotsky'] },
        { label: 'Transtorno do Espectro Autista (TEA)', topics: ['TEA', 'TEA no Adulto (Camuflagem)', 'TEA no DSM-5 (Exclusão de Rett)', 'TEA: Nível 1 vs Asperger', 'TEA: Transição DSM-IV para DSM-5', 'Transtorno do Espectro Autista', 'Síndrome de Asperger (Legado)', 'Transtorno do Neurodesenvolvimento (Síndrome de Rett)', 'Triagem Precoce (M-CHAT)', 'Intervenções no TEA (ABA, TEACCH, Denver)'] },
        { label: 'TDAH', topics: ['TDAH', 'TDAH (Contextualização)', 'Persistência do TDAH no Adulto', 'Comorbidades do TDAH', 'Diagnóstico Diferencial do TDAH', 'Tratamento do TDAH (Farmacológico e Não-Farmacológico)'] },
        { label: 'Transtornos do Humor e Comportamento na Infância', topics: ['Transtornos do Humor', 'Transtornos Disruptivos', 'DMDD (Transtorno Disruptivo de Desregulação do Humor)', 'Transtorno de Oposição Desafiante (TOD)', 'Transtorno de Conduta', 'Depressão na Infância e Adolescência'] },
        { label: 'Outros Transtornos do Neurodesenvolvimento', topics: ['Transtornos do Desenvolvimento', 'Transtornos do Neurodesenvolvimento', 'Deficiência Intelectual', 'Transtorno de Comunicação', 'Transtorno Específico de Aprendizagem', 'Diagnóstico Diferencial: Tourette vs TOC', 'Síndrome de Tourette', 'Transtorno de Tiques'] },
        { label: 'Ansiedade na Infância', topics: ['Ansiedade de Separação', 'Mutismo Seletivo', 'Fobia Escolar'] },
        { label: 'Identidade de Gênero na Infância', topics: ['Disforia de Gênero na Infância (Continuidade)'] },
        { label: 'Tratamento na Infância e Adolescência', topics: ['Psicofarmacologia na Infância', 'Psicofarmacologia na Lactação', 'Psicoterapia Infantil', 'Terapia Familiar', 'Ludoterapia'] },
        { label: 'Epidemiologia e Genética', topics: ['Epidemiologia', 'Genética', 'História e Epidemiologia'] },
    ],

    // 10. SAÚDE PÚBLICA
    saude_publica: [
        { label: 'Reforma Psiquiátrica e Políticas', topics: ['Reforma Psiquiátrica', 'Política de Saúde Mental', 'Políticas de Saúde', 'Legislação', 'Nota Técnica 11/2019', 'Conferências Nacionais de Saúde Mental', 'Luta Antimanicomial'] },
        { label: 'RAPS e Organização de Serviços', topics: ['Rede de Atenção Psicossocial (RAPS)', 'Níveis de Atenção', 'Níveis de Prevenção e Atenção à Saúde', 'Reabilitação Psicossocial', 'CAPS I, II, III, AD, i (Tipos e Funcionamento)', 'Residências Terapêuticas', 'Matriciamento em Saúde Mental', 'Consultório na Rua', 'De Volta para Casa'] },
        { label: 'Epidemiologia Psiquiátrica', topics: ['Epidemiologia', 'Prevalência Global dos Transtornos Mentais', 'Carga Global de Doença (GBD)', 'Treatment Gap'] },
        { label: 'Estigma e Determinantes Sociais', topics: ['Estigma', 'Combate ao Estigma', 'Suicídio (Sobreviventes e Estigma)', 'Sociologia e Cultura', 'Determinantes Sociais da Saúde Mental', 'Saúde Mental e População LGBTQIA+', 'Saúde Mental e Populações Vulneráveis'] },
        { label: 'Saúde Mental e Crises Coletivas', topics: ['Psiquiatria e COVID-19', 'Desastres e Saúde Mental', 'Primeiros Socorros Psicológicos'] },
    ],

    // 11. TRANSTORNOS ALIMENTARES
    transtornos_alimentares: [
        { label: 'Anorexia Nervosa', topics: ['Anorexia Nervosa', 'Subtipos (Restritivo vs Purgativo)', 'Complicações Clínicas da AN', 'Síndrome de Realimentação', 'Tratamento da AN'] },
        { label: 'Bulimia Nervosa', topics: ['Bulimia Nervosa', 'Sinal de Russell', 'Alterações Eletrolíticas na BN', 'Tratamento da BN (ISRS + TCC)'] },
        { label: 'Transtorno de Compulsão Alimentar (TCA)', topics: ['TAR/E', 'TARE', 'Critérios Diagnósticos do TCA', 'Lisdexanfetamina no TCA'] },
        { label: 'Outros Transtornos Alimentares', topics: ['Outros Transtornos Alimentares', 'Pica', 'Transtorno de Ruminação', 'ARFID (Transtorno Alimentar Restritivo/Evitativo)', 'Ortorexia Nervosa', 'Vigorexia'] },
        { label: 'Temas Transversais', topics: ['Transtornos Alimentares', 'Comorbidades', 'Neurobiologia dos TA', 'Imagem Corporal', 'Epidemiologia dos TA'] },
    ],

    // 12. TRANSTORNOS DE ANSIEDADE
    transtornos_ansiedade: [
        { label: 'Transtorno de Ansiedade Generalizada (TAG)', topics: ['TAG', 'Duração do TAG (DSM-5)', 'Modelo de Intolerância à Incerteza'] },
        { label: 'Transtorno de Pânico e Agorafobia', topics: ['Pânico e Agorafobia', 'Substâncias Panicogênicas', 'Modelo Cognitivo do Pânico (Clark)', 'Sensibilidade à Ansiedade'] },
        { label: 'Fobias', topics: ['Fobias', 'Ansiedade Social: Diagnóstico Diferencial', 'Ansiedade de Separação (Adulto)', 'Fobia Específica (Subtipos)', 'Mutismo Seletivo'] },
        { label: 'TOC — Diagnóstico e Clínica', topics: ['TOC', 'TOC (Epidemiologia dos Sintomas)', 'Epidemiologia do TOC', 'Especificador de Insight no TOC', 'Obsessões', 'Comorbidade TOC e Depressão', 'Dimensões Sintomáticas do TOC'] },
        { label: 'TEPT e Transtornos Relacionados a Trauma', topics: ['TEPT', 'TEPT - Agrupamentos de Sintomas', 'TEPT - História', 'TEPT Complexo (CID-11)', 'Teoria Cognitiva do TEPT', 'Transtorno de Estresse Pós-Traumático (TEPT)', 'Transtorno de Estresse Agudo', 'Crescimento Pós-Traumático'] },
        { label: 'Transtorno de Acumulação', topics: ['Transtorno de Acumulação (Hoarding)', 'Transtorno de Acumulação (Neurobiologia)', 'Transtorno de Acumulação e Comorbidades'] },
        { label: 'Transtorno de Adaptação', topics: ['Transtorno de Adaptação', 'Diferença entre TA e TEPT'] },
        { label: 'Neurobiologia e Tratamento da Ansiedade', topics: ['Neurobiologia', 'Benzodiazepínicos (Uso e Limitações)', 'Diagnóstico Diferencial', 'Pregabalina', 'Buspirona', 'Tratamento do TOC (ISRS + EPR)'] },
        { label: 'Outros', topics: ['Covid-19'] },
    ],

    // 13. TRANSTORNOS DO HUMOR
    transtornos_humor: [
        { label: 'Depressão — Diagnóstico e Clínica', topics: ['Depressão', 'Depressão Maior', 'Transtorno Depressivo', 'Transtorno Depressivo Maior (TDM)', 'Sintomas Cardinais da Depressão', 'Especificador de Características Melancólicas', 'Biotipos da Depressão', 'Escalas de Avaliação', 'Especificadores (Atípica, Psicótica, Sazonal, Peripartum)'] },
        { label: 'Depressão — Neurobiologia e Fisiopatologia', topics: ['Neurobiologia do TDM', 'Neuroimagem', 'Inflamação', 'Recorrência Depressiva (Fatores)', 'Teoria Monoaminérgica', 'Teoria Neuroinflamatória', 'Microbiota Intestinal e Depressão'] },
        { label: 'Distimia e Depressão Crônica', topics: ['Distimia', 'Transtorno Depressivo Persistente (Distimia)', 'Depressão Dupla'] },
        { label: 'Transtorno Bipolar — Diagnóstico e Clínica', topics: ['Transtorno Bipolar', 'Transtorno Bipolar I: Diagnóstico', 'Transtorno Bipolar II', 'Ciclotimia', 'Especificador de Características Mistas (DSM-5)', 'Mania Induzida por Tratamento', 'Subgrupos Cognitivos no TB', 'Maconha e TB', 'Ciclagem Rápida', 'Transtorno Bipolar de Início Tardio'] },
        { label: 'Transtorno Bipolar — Tratamento', topics: ['Tratamento da Mania', 'Manutenção no Transtorno Bipolar', 'Psicoeducação no TB', 'Lítio e Hipotireoidismo', 'Depressão Bipolar (Tratamento)', 'Algoritmos de Tratamento (CANMAT, WFSBP)'] },
        { label: 'Populações Especiais', topics: ['Perimenopausa', 'TDPM na Perimenopausa', 'Transtorno Bipolar Perinatal', 'Transtorno Bipolar na Gestação', 'Psiquiatria Geriátrica', 'Depressão Pós-Parto', 'Depressão na Infância'] },
        { label: 'Suicídio nos Transtornos de Humor', topics: ['Suicídio', 'Fatores de Risco e Proteção', 'Avaliação de Risco Suicida'] },
        { label: 'Outros', topics: ['Delírios Epônimos (Erotomania)'] },
    ],

    // 14. TRANSTORNOS DE PERSONALIDADE
    transtornos_personalidade: [
        { label: 'Classificação e Modelos Diagnósticos', topics: ['Classificação', 'Agrupamentos (Cluster B)', 'CID-11', 'CID-11 (Padrão Dissocial)', 'Epidemiologia dos TPs', 'Cluster A (Paranoide, Esquizoide, Esquizotípico)', 'Cluster B (Antissocial, Borderline, Histriônico, Narcisista)', 'Cluster C (Evitativo, Dependente, Obsessivo-Compulsivo)', 'Modelo Dimensional da CID-11', 'Modelo Alternativo do DSM-5 (AMPD)'] },
        { label: 'Transtorno de Personalidade Borderline', topics: ['Transtorno Borderline', 'Mecanismos de Defesa: Borderline', 'Tratamento do TPB (DBT, MBT, TFP)', 'Automutilação e Suicidabilidade no TPB'] },
        { label: 'Transtorno de Personalidade Antissocial', topics: ['Neurobiologia do TP Antissocial', 'Psicopatia (PCL-R de Hare)', 'Transtorno de Conduta como Precursor'] },
        { label: 'Transtorno de Personalidade Narcisista', topics: ['Narcisismo Grandioso vs Vulnerável', 'Diagnóstico Diferencial do TPN'] },
        { label: 'Outros Transtornos de Personalidade', topics: ['TP Esquizotípico', 'TP Evitativo', 'TP Dependente', 'TP Obsessivo-Compulsivo (TPOC)'] },
        { label: 'Transtornos do Impulso Associados', topics: ['Transtorno Explosivo Intermitente (TEI)', 'Comportamento Sexual Compulsivo'] },
    ],

    // 15. URGÊNCIAS PSIQUIÁTRICAS
    urgencias_psiquiatricas: [
        { label: 'Agitação Psicomotora e Contenção', topics: ['Agitação Psicomotora', 'Contenção Mecânica', 'Tranquilização Rápida (Protocolos)', 'Projeto BETA (AAEP)', 'Técnicas de Desescalada Verbal'] },
        { label: 'Delirium na Emergência', topics: ['Delirium', 'Delirium vs Outros Estados', 'CAM (Confusion Assessment Method)', 'Etiologia do Delirium (Mnemônico I WATCH DEATH)'] },
        { label: 'Crise Suicida na Emergência', topics: ['Suicídio', 'Suicídio e Antidepressivos', 'Avaliação de Risco Suicida na Emergência', 'Plano de Segurança (Safety Plan)', 'Internação Psiquiátrica de Urgência'] },
        { label: 'Síndromes Emergenciais Psiquiátricas', topics: ['SNM', 'Síndrome Neuroléptica Maligna (SNM)', 'Efeitos Adversos', 'Síndrome Serotoninérgica na Emergência', 'Intoxicação por Lítio', 'Catatonia Maligna', 'Intoxicação Exógena (Drogas de Abuso)', 'Rabdomiólise'] },
        { label: 'Organização e Epidemiologia', topics: ['Organização de Serviços', 'Epidemiologia', 'Psiquiatria de Emergência (Modelos de Atendimento)'] },
    ],

    // 16. GERAL
    geral: [
        { label: 'História e Fundamentos da Psiquiatria', topics: ['Conceitos Básicos', 'História da Psiquiatria', 'Reforma Psiquiátrica', 'Psicologia Médica', 'Grandes Autores (Kraepelin, Bleuler, Schneider, Jaspers)'] },
        { label: 'Metodologia Científica e Bioestatística', topics: ['Metodologia Científica', 'Estatística', 'Psicometria', 'Tipos de Estudo (ECR, Coorte, Caso-Controle, Transversal)', 'Vieses em Pesquisa', 'NNT e NNH', 'Sensibilidade, Especificidade, VPP e VPN', 'Revisão Sistemática e Meta-análise', 'Odds Ratio vs Risco Relativo', 'Intervalo de Confiança e Valor-p'] },
        { label: 'Temas Transversais', topics: ['Estigma e Sociologia', 'Comunicação de Más Notícias (SPIKES)', 'Cuidado Centrado na Pessoa', 'Medicina Baseada em Evidências'] },
    ],

    // Legacy themes — empty
    diagnostico: [],
    etica_legal: [],
    psiquiatria_forense: [],
    neurociencias_diagnostico: [],
    psiquiatria_geriatrica: [],
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════════

export function flattenThemeTopics(theme: PsychiatryTheme): string[] {
    const categories = THEME_SUBDIVISIONS_V2[theme];
    if (!categories) return [];
    return categories.flatMap((cat) => cat.topics);
}

export function getFlatSubdivisions(): Partial<Record<PsychiatryTheme, string[]>> {
    const result: Partial<Record<PsychiatryTheme, string[]>> = {};
    const themes = Object.keys(THEME_SUBDIVISIONS_V2) as PsychiatryTheme[];
    for (const theme of themes) {
        result[theme] = flattenThemeTopics(theme);
    }
    return result;
}

export function findTopicLocation(
    topic: string
): { theme: PsychiatryTheme; category: string } | null {
    const themes = Object.keys(THEME_SUBDIVISIONS_V2) as PsychiatryTheme[];
    for (const theme of themes) {
        const categories = THEME_SUBDIVISIONS_V2[theme];
        for (const cat of categories) {
            if (cat.topics.includes(topic)) {
                return { theme, category: cat.label };
            }
        }
    }
    return null;
}

export function getCategoryLabels(theme: PsychiatryTheme): string[] {
    const categories = THEME_SUBDIVISIONS_V2[theme];
    if (!categories) return [];
    return categories.map((cat) => cat.label);
}

export function getTopicsByCategory(
    theme: PsychiatryTheme,
    categoryLabel: string
): string[] {
    const categories = THEME_SUBDIVISIONS_V2[theme];
    if (!categories) return [];
    const found = categories.find((cat) => cat.label === categoryLabel);
    return found ? found.topics : [];
}

/** @deprecated Use THEME_SUBDIVISIONS_V2 para a estrutura em 3 níveis */
export const THEME_SUBDIVISIONS = getFlatSubdivisions();
