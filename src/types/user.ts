import { PsychiatryTheme } from './themes';

export interface SubthemeStats {
    total: number;
    correct: number;
    errors: number;
}

export interface ThemeProgress {
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    recentAccuracy: number;
    commonMistakes: string[];
    subthemeStats?: Record<string, SubthemeStats>;
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
