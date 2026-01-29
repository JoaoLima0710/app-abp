// ==================== TYPES ====================

export type PsychiatryTheme =
    | 'transtornos_humor'
    | 'psicofarmacologia'
    | 'esquizofrenia_psicose'
    | 'psiquiatria_infantojuvenil'
    | 'urgencias_psiquiatricas'
    | 'psicoterapia'
    | 'etica_legal'
    | 'neurociencias_diagnostico'
    | 'transtornos_ansiedade'
    | 'transtornos_personalidade'
    | 'dependencia_quimica'
    | 'psiquiatria_geriatrica';

export const THEME_LABELS: Record<PsychiatryTheme, string> = {
    transtornos_humor: 'Transtornos do Humor',
    psicofarmacologia: 'Psicofarmacologia',
    esquizofrenia_psicose: 'Esquizofrenia e Psicose',
    psiquiatria_infantojuvenil: 'Psiquiatria Infantojuvenil',
    urgencias_psiquiatricas: 'Urgências Psiquiátricas',
    psicoterapia: 'Psicoterapia',
    etica_legal: 'Ética e Psiquiatria Legal',
    neurociencias_diagnostico: 'Neurociências e Diagnóstico',
    transtornos_ansiedade: 'Transtornos de Ansiedade',
    transtornos_personalidade: 'Transtornos de Personalidade',
    dependencia_quimica: 'Dependência Química',
    psiquiatria_geriatrica: 'Psiquiatria Geriátrica',
};

export const THEME_COLORS: Record<PsychiatryTheme, string> = {
    transtornos_humor: '#8b5cf6',
    psicofarmacologia: '#06b6d4',
    esquizofrenia_psicose: '#f43f5e',
    psiquiatria_infantojuvenil: '#f97316',
    urgencias_psiquiatricas: '#ef4444',
    psicoterapia: '#10b981',
    etica_legal: '#6366f1',
    neurociencias_diagnostico: '#ec4899',
    transtornos_ansiedade: '#eab308',
    transtornos_personalidade: '#14b8a6',
    dependencia_quimica: '#a855f7',
    psiquiatria_geriatrica: '#64748b',
};

export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Question {
    id: string;
    theme: PsychiatryTheme;
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
    source?: string;
    tags: string[];
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

export interface UserProgress {
    totalSimulations: number;
    totalQuestionsAnswered: number;
    overallAccuracy: number;
    byTheme: Partial<Record<PsychiatryTheme, ThemeProgress>>;
    trends: TrendAnalysis;
    lastUpdated: Date;
}

export interface StudyRecommendation {
    type: 'priority' | 'review' | 'maintain' | 'celebrate';
    theme: PsychiatryTheme;
    message: string;
    suggestedAction: string;
}
