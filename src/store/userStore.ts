import { create } from 'zustand';
import { Simulation, UserProgress, PsychiatryTheme, StudyRecommendation, THEME_LABELS } from '../types';
import { getAllSimulations, getUserProgress, updateUserProgress } from '../db/database';

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

        const themeData: Record<string, { attempts: number[]; correct: number; total: number; errors: number }> = {};

        for (const sim of completedSims) {
            for (const [theme, stats] of Object.entries(sim.stats.byTheme)) {
                if (!themeData[theme]) {
                    themeData[theme] = { attempts: [], correct: 0, total: 0, errors: 0 };
                }
                themeData[theme].correct += stats?.correct || 0;
                themeData[theme].total += stats?.total || 0;
                themeData[theme].errors += (stats?.total || 0) - (stats?.correct || 0);
                if (stats) {
                    themeData[theme].attempts.push(stats.accuracy);
                }
            }
        }

        // Rank 5: aggregate commonMistakes — themes with most errors
        const errorRanking = Object.entries(themeData)
            .map(([theme, data]) => ({ theme, errors: data.errors, total: data.total }))
            .filter(t => t.errors > 0)
            .sort((a, b) => b.errors - a.errors)
            .slice(0, 5)
            .map(t => {
                const label = THEME_LABELS[t.theme as PsychiatryTheme] || t.theme;
                return `${label}: ${t.errors} erro(s) em ${t.total} questões`;
            });

        const byTheme: Partial<Record<PsychiatryTheme, {
            totalAttempts: number;
            correctAnswers: number;
            accuracy: number;
            trend: 'improving' | 'stable' | 'declining';
            recentAccuracy: number;
            commonMistakes: string[];
        }>> = {};

        const themeAccuracies: { theme: PsychiatryTheme; accuracy: number }[] = [];

        for (const [theme, data] of Object.entries(themeData)) {
            const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            const recentAttempts = data.attempts.slice(-5);
            const recentAccuracy = recentAttempts.length > 0
                ? recentAttempts.reduce((a, b) => a + b, 0) / recentAttempts.length
                : 0;

            // Calculate trend
            let trend: 'improving' | 'stable' | 'declining' = 'stable';
            if (recentAttempts.length >= 3) {
                const firstHalf = recentAttempts.slice(0, Math.floor(recentAttempts.length / 2));
                const secondHalf = recentAttempts.slice(Math.floor(recentAttempts.length / 2));
                const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
                const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

                if (secondAvg > firstAvg + 5) trend = 'improving';
                else if (secondAvg < firstAvg - 5) trend = 'declining';
            }

            byTheme[theme as PsychiatryTheme] = {
                totalAttempts: data.total,
                correctAnswers: data.correct,
                accuracy,
                trend,
                recentAccuracy,
                commonMistakes: errorRanking.filter(e => e.startsWith(THEME_LABELS[theme as PsychiatryTheme] || theme)),
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
        const previousStreak = get().progress?.streak || 0;
        const previousActivityDate = get().progress?.lastActivityDate;
        let newStreak = 1;

        if (previousActivityDate) {
            const lastDate = new Date(previousActivityDate);
            const today = new Date();
            lastDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                newStreak = Math.max(previousStreak, 1);
            } else if (diffDays === 1) {
                newStreak = previousStreak + 1;
            } else {
                newStreak = 1;
            }
        }

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
