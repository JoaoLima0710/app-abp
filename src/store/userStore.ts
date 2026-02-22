import { create } from 'zustand';
import { Simulation, UserProgress, PsychiatryTheme, StudyRecommendation, THEME_LABELS, SubthemeStats } from '../types';
import { getAllSimulations, getUserProgress, updateUserProgress, db } from '../db/database';
import { aggregateThemeStats, aggregateSubthemeStats, calculateTrend, rankTopErrors, calculateStreak } from '../lib/statistics';

interface UserState {
    simulations: Simulation[];
    progress: UserProgress | null;
    recommendations: StudyRecommendation[];
    isLoading: boolean;
    isDarkMode: boolean;

    // Actions
    loadUserData: () => Promise<void>;
    calculateProgress: () => Promise<void>;
    generateRecommendations: () => void;
    toggleDarkMode: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    simulations: [],
    progress: null,
    recommendations: [],
    isLoading: false,
    isDarkMode: localStorage.getItem('darkMode') === 'true',

    loadUserData: async () => {
        set({ isLoading: true });

        const simulations = await getAllSimulations();
        const progress = await getUserProgress();

        set({
            simulations,
            progress: progress || null,
            isLoading: false,
        });

        await get().calculateProgress();
        get().generateRecommendations();
    },

    calculateProgress: async () => {
        const { simulations } = get();

        const completedSims = simulations.filter(s => s.completedAt);
        if (completedSims.length === 0) return;

        const themeData = aggregateThemeStats(completedSims);

        // Rank 4.5: Calculate subtheme statistics
        const answeredIds = new Set<string>();
        completedSims.forEach(sim => sim.questions.forEach(q => {
            if (q.userAnswer) answeredIds.add(q.questionId);
        }));

        let subthemeData: Record<string, Record<string, SubthemeStats>> = {};

        if (answeredIds.size > 0) {
            const allAnsweredQuestions = await db.questions.where('id').anyOf(Array.from(answeredIds)).toArray();
            const questionMap = new Map(allAnsweredQuestions.map(q => [q.id, q]));
            subthemeData = aggregateSubthemeStats(completedSims, questionMap);
        }

        // Rank 5: aggregate commonMistakes — themes with most errors
        const errorRankingStrings = rankTopErrors(themeData);

        const byTheme: Partial<Record<PsychiatryTheme, {
            totalAttempts: number;
            correctAnswers: number;
            accuracy: number;
            trend: 'improving' | 'stable' | 'declining';
            recentAccuracy: number;
            commonMistakes: string[];
            subthemeStats?: Record<string, SubthemeStats>;
        }>> = {};

        const themeAccuracies: { theme: PsychiatryTheme; accuracy: number }[] = [];

        for (const [theme, data] of Object.entries(themeData)) {
            const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            const recentAttempts = data.attempts.slice(-5);
            const recentAccuracy = recentAttempts.length > 0
                ? recentAttempts.reduce((a, b) => a + b, 0) / recentAttempts.length
                : 0;

            const trend = calculateTrend(data.attempts);

            byTheme[theme as PsychiatryTheme] = {
                totalAttempts: data.total,
                correctAnswers: data.correct,
                accuracy,
                trend,
                recentAccuracy,
                commonMistakes: errorRankingStrings.filter(e => e.startsWith(THEME_LABELS[theme as PsychiatryTheme] || theme)),
                subthemeStats: subthemeData[theme] || undefined
            };

            themeAccuracies.push({ theme: theme as PsychiatryTheme, accuracy });
        }

        // Sort themes by accuracy
        themeAccuracies.sort((a, b) => b.accuracy - a.accuracy);
        const strongThemes = themeAccuracies.filter(t => t.accuracy >= 70).map(t => t.theme).slice(0, 3);
        const weakThemes = themeAccuracies.filter(t => t.accuracy < 60).map(t => t.theme).slice(0, 3);

        const totalAnswered = completedSims.reduce((sum, s) => sum + s.stats.answered, 0);
        const totalCorrect = completedSims.reduce((sum, s) => sum + s.stats.correct, 0);

        // Rank 6: functional streak calculation
        const newStreak = calculateStreak(get().progress?.streak || 0, get().progress?.lastActivityDate);

        const progress: UserProgress = {
            totalSimulations: completedSims.length,
            totalQuestionsAnswered: totalAnswered,
            overallAccuracy: totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0,
            byTheme,
            trends: {
                overallTrend: 'stable',
                strongThemes,
                weakThemes,
                recommendations: [],
            },
            streak: newStreak,
            lastActivityDate: new Date(),
            lastUpdated: new Date(),
        };

        await updateUserProgress(progress);
        set({ progress });
    },

    generateRecommendations: () => {
        const { progress } = get();
        if (!progress) return;

        const recommendations: StudyRecommendation[] = [];

        // Add recommendations for weak themes
        for (const theme of progress.trends.weakThemes) {
            const themeProgress = progress.byTheme[theme];
            recommendations.push({
                type: 'priority',
                theme,
                message: `Seu desempenho em "${THEME_LABELS[theme]}" está abaixo do esperado (${themeProgress?.accuracy.toFixed(0)}%)`,
                suggestedAction: `Faça um simulado focado em ${THEME_LABELS[theme]} e revise os conceitos principais`,
            });
        }

        // Add celebrations for strong themes
        for (const theme of progress.trends.strongThemes.slice(0, 1)) {
            const themeProgress = progress.byTheme[theme];
            recommendations.push({
                type: 'celebrate',
                theme,
                message: `Excelente! Você está dominando "${THEME_LABELS[theme]}" (${themeProgress?.accuracy.toFixed(0)}%)`,
                suggestedAction: 'Continue revisando periodicamente para manter o nível',
            });
        }

        // Add trend-based recommendations
        for (const [theme, data] of Object.entries(progress.byTheme)) {
            if (data?.trend === 'improving' && !progress.trends.strongThemes.includes(theme as PsychiatryTheme)) {
                recommendations.push({
                    type: 'maintain',
                    theme: theme as PsychiatryTheme,
                    message: `Você está melhorando em "${THEME_LABELS[theme as PsychiatryTheme]}"!`,
                    suggestedAction: 'Continue praticando para consolidar o aprendizado',
                });
            }
            if (data?.trend === 'declining') {
                recommendations.push({
                    type: 'review',
                    theme: theme as PsychiatryTheme,
                    message: `Atenção: seu desempenho em "${THEME_LABELS[theme as PsychiatryTheme]}" está caindo`,
                    suggestedAction: 'Revise os conceitos fundamentais desta área',
                });
            }
        }

        set({ recommendations: recommendations.slice(0, 5) });
    },

    toggleDarkMode: () => {
        const newValue = !get().isDarkMode;
        localStorage.setItem('darkMode', String(newValue));
        document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light');
        set({ isDarkMode: newValue });
    },
}));
