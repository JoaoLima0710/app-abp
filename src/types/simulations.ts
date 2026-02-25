import { PsychiatryTheme } from './themes';
import { AnswerOption } from './questions';

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
    isTimedExam?: boolean;
    questions: SimulationQuestion[];
    stats: SimulationStats;
}
