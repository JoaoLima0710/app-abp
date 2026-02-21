// ==================== TYPES ====================

// New consolidated theme taxonomy (v2)
export type PsychiatryTheme =
    | 'transtornos_humor'
    | 'transtornos_ansiedade'
    | 'esquizofrenia_psicose'
    | 'transtornos_personalidade'
    | 'psicofarmacologia'
    | 'neurociencias'
    | 'psiquiatria_infantojuvenil'
    | 'psicogeriatria'
    | 'dependencia_quimica'
    | 'psicopatologia_diagnostico'
    | 'etica_forense_legal'
    | 'urgencias_psiquiatricas'
    | 'psicoterapia'
    | 'transtornos_alimentares'
    | 'saude_publica'
    | 'geral'
    | 'diagnostico'
    | 'etica_legal'
    | 'psiquiatria_forense'
    | 'neurociencias_diagnostico'
    | 'psiquiatria_geriatrica';

export const THEME_LABELS: Record<PsychiatryTheme, string> = {
    transtornos_humor: 'Transtornos do Humor',
    transtornos_ansiedade: 'Transtornos de Ansiedade',
    esquizofrenia_psicose: 'Psicoses',
    transtornos_personalidade: 'Transtornos de Personalidade',
    psicofarmacologia: 'Psicofarmacologia',
    neurociencias: 'Neurociência',
    psiquiatria_infantojuvenil: 'Psiquiatria Infantojuvenil',
    psicogeriatria: 'Psicogeriatria',
    dependencia_quimica: 'Dependência Química',
    psicopatologia_diagnostico: 'Psicopatologia e Diagnóstico',
    etica_forense_legal: 'Ética, Forense e Legislação',
    urgencias_psiquiatricas: 'Urgências Psiquiátricas',
    psicoterapia: 'Psicoterapia',
    transtornos_alimentares: 'Transtornos Alimentares',
    saude_publica: 'Saúde Pública',
    geral: 'Geral (Legado)',
    diagnostico: 'Diagnóstico (Legado)',
    etica_legal: 'Ética Legal (Legado)',
    psiquiatria_forense: 'Forense (Legado)',
    neurociencias_diagnostico: 'Neurociência (Legado)',
    psiquiatria_geriatrica: 'Geriátrica (Legado)',
};

export const THEME_COLORS: Record<PsychiatryTheme, string> = {
    transtornos_humor: '#8b5cf6',
    transtornos_ansiedade: '#eab308',
    esquizofrenia_psicose: '#f43f5e',
    transtornos_personalidade: '#14b8a6',
    psicofarmacologia: '#06b6d4',
    neurociencias: '#a855f7',
    psiquiatria_infantojuvenil: '#f97316',
    psicogeriatria: '#64748b',
    dependencia_quimica: '#7c3aed',
    psicopatologia_diagnostico: '#be185d',
    etica_forense_legal: '#6366f1',
    urgencias_psiquiatricas: '#ef4444',
    psicoterapia: '#10b981',
    transtornos_alimentares: '#ec4899',
    saude_publica: '#3b82f6',
    geral: '#94a3b8',
    diagnostico: '#be185d',
    etica_legal: '#6366f1',
    psiquiatria_forense: '#6366f1',
    neurociencias_diagnostico: '#a855f7',
    psiquiatria_geriatrica: '#64748b',
};

export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionTaxonomy {
    tier: 1 | 2 | 3 | 4;
    axis:
    | 'diagnostico'
    | 'farmacologia'
    | 'psicopatologia'
    | 'epidemiologia'
    | 'tratamento_nao_farmacologico'
    | 'etica_legislacao'
    | 'fundamentos'
    | 'gestao'
    | 'intervencao';
    cognitiveSkill:
    | 'memorizacao'
    | 'compreensao'
    | 'aplicacao'
    | 'analise'
    | 'sintese'
    | 'raciocinio_clinico'
    | 'aplicacao_pratica';
}

export const AXIS_LABELS: Record<QuestionTaxonomy['axis'], string> = {
    diagnostico: 'Diagnóstico',
    farmacologia: 'Farmacologia',
    psicopatologia: 'Psicopatologia',
    epidemiologia: 'Epidemiologia',
    tratamento_nao_farmacologico: 'Tratamento não Farmacológico',
    etica_legislacao: 'Ética e Legislação',
    fundamentos: 'Fundamentos',
    gestao: 'Gestão',
    intervencao: 'Intervenção',
};

export const SKILL_LABELS: Record<QuestionTaxonomy['cognitiveSkill'], string> = {
    memorizacao: 'Memorização',
    compreensao: 'Compreensão',
    aplicacao: 'Aplicação',
    analise: 'Análise',
    sintese: 'Síntese',
    raciocinio_clinico: 'Raciocínio Clínico',
    aplicacao_pratica: 'Aplicação Prática',
};

export interface ItemAnalysis {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
}

export interface Question {
    id: string;
    theme: PsychiatryTheme;
    subtheme?: string;
    difficulty: 1 | 2 | 3;
    statement: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: AnswerOption;
    explanation: {
        correct: string;
        wrongA?: string;
        wrongB?: string;
        wrongC?: string;
        wrongD?: string;
        wrongE?: string;
        keyConcepts: string[];
        examTip?: string;
    };
    itemAnalysis?: ItemAnalysis;
    source?: string;
    tags: string[];
    taxonomy?: QuestionTaxonomy;
    commentary?: string;
}

export interface SimulationQuestion {
    questionId: string;
    userAnswer?: AnswerOption;
    isCorrect?: boolean;
    timeSpentSeconds?: number;
    answeredAt?: Date;
}

export interface ThemeStats {
    total: number;
    correct: number;
    accuracy: number;
}

export interface SimulationStats {
    totalQuestions: number;
    answered: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    avgTimePerQuestion: number;
    byTheme: Partial<Record<PsychiatryTheme, ThemeStats>>;
}

export interface Simulation {
    id: string;
    createdAt: Date;
    completedAt?: Date;
    questionCount: number;
    focusTheme?: PsychiatryTheme;
    questions: SimulationQuestion[];
    stats: SimulationStats;
}

export interface ThemeProgress {
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    recentAccuracy: number;
    commonMistakes: string[];
}

export interface TrendAnalysis {
    overallTrend: 'improving' | 'stable' | 'declining';
    strongThemes: PsychiatryTheme[];
    weakThemes: PsychiatryTheme[];
    recommendations: string[];
}

export interface SpacedRepetitionItem {
    questionId: string;
    nextReviewDate: Date;
    interval: number;
    repetition: number;
    easeFactor: number;
    lastReviewed: Date;
}

export interface UserProgress {
    id?: string;
    name?: string;
    lastLogin?: Date;
    totalSimulations: number;
    totalQuestionsAnswered: number;
    overallAccuracy: number;
    byTheme: Partial<Record<PsychiatryTheme, ThemeProgress>>;
    trends: TrendAnalysis;
    streak: number;
    lastActivityDate?: Date;
    lastUpdated: Date;
}

export interface StudyRecommendation {
    type: 'priority' | 'review' | 'maintain' | 'celebrate';
    theme: PsychiatryTheme;
    message: string;
    suggestedAction: string;
}

export interface CustomFlashcard {
    id: string;
    theme: PsychiatryTheme;
    front: string;
    back: string;
    createdAt: Date;
    userId?: string;
}
