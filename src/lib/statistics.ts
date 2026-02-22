import { Simulation, Question, PsychiatryTheme, SubthemeStats, THEME_LABELS, THEME_COLORS } from '../types';

/**
 * Calculadora pura de Estatísticas
 * Separa a lógica de negócios da camada de UI e Store (Zustand).
 */

export interface ThemeAggregatedStats {
    attempts: number[];
    correct: number;
    total: number;
    errors: number;
}

export interface SubthemeDataMap {
    [theme: string]: Record<string, SubthemeStats>;
}

export interface CoverageStat {
    theme: string;
    label: string;
    color: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    coverage: number;
    accuracy: number;
}

/**
 * Agrega dados de Cobertura de Edição cruzando Questões do Banco e Simulados
 */
export function aggregateCoverageStats(allQuestions: Question[], sims: Simulation[]): CoverageStat[] {
    const byTheme: Record<string, { total: number }> = {};
    for (const q of allQuestions) {
        if (!byTheme[q.theme]) byTheme[q.theme] = { total: 0 };
        byTheme[q.theme].total++;
    }

    const answeredByTheme: Record<string, { answered: Set<string>; correct: number }> = {};
    for (const sim of sims) {
        for (const sq of sim.questions) {
            if (!sq.userAnswer) continue;
            const q = allQuestions.find((x) => x.id === sq.questionId);
            if (!q) continue;
            if (!answeredByTheme[q.theme]) answeredByTheme[q.theme] = { answered: new Set(), correct: 0 };
            answeredByTheme[q.theme].answered.add(sq.questionId);
            if (sq.isCorrect) answeredByTheme[q.theme].correct++;
        }
    }

    return Object.entries(byTheme).map(([theme, { total }]) => {
        const answered = answeredByTheme[theme]?.answered.size || 0;
        const correct = answeredByTheme[theme]?.correct || 0;
        return {
            theme,
            label: THEME_LABELS[theme as PsychiatryTheme] || theme,
            color: THEME_COLORS[theme as PsychiatryTheme] || '#888',
            totalQuestions: total,
            answeredQuestions: answered,
            correctAnswers: correct,
            coverage: total > 0 ? (answered / total) * 100 : 0,
            accuracy: answered > 0 ? (correct / answered) * 100 : 0,
        };
    });
}

/**
 * Agrega o progresso bruto de múltiplas simulações por Tema
 */
export function aggregateThemeStats(simulations: Simulation[]): Record<string, ThemeAggregatedStats> {
    const themeData: Record<string, ThemeAggregatedStats> = {};

    for (const sim of simulations) {
        if (!sim.completedAt) continue;

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

    return themeData;
}

/**
 * Agrega o progresso bruto de múltiplas simulações por Subtema
 */
export function aggregateSubthemeStats(
    simulations: Simulation[],
    questionMap: Map<string, Question>
): SubthemeDataMap {
    const subthemeData: SubthemeDataMap = {};

    for (const sim of simulations) {
        if (!sim.completedAt) continue;

        for (const sq of sim.questions) {
            if (sq.userAnswer) {
                const originalQ = questionMap.get(sq.questionId);
                if (originalQ && originalQ.subtheme) {
                    const theme = originalQ.theme;
                    const subtheme = originalQ.subtheme;

                    if (!subthemeData[theme]) subthemeData[theme] = {};
                    if (!subthemeData[theme][subtheme]) {
                        subthemeData[theme][subtheme] = { total: 0, correct: 0, errors: 0 };
                    }

                    subthemeData[theme][subtheme].total += 1;
                    if (sq.isCorrect) {
                        subthemeData[theme][subtheme].correct += 1;
                    } else {
                        subthemeData[theme][subtheme].errors += 1;
                    }
                }
            }
        }
    }

    return subthemeData;
}

/**
 * Descobre o Trend (Tendência) com base nas últimas 5 tentativas
 */
export function calculateTrend(attempts: number[]): 'improving' | 'stable' | 'declining' {
    const recentAttempts = attempts.slice(-5);
    let trend: 'improving' | 'stable' | 'declining' = 'stable';

    if (recentAttempts.length >= 3) {
        const firstHalf = recentAttempts.slice(0, Math.floor(recentAttempts.length / 2));
        const secondHalf = recentAttempts.slice(Math.floor(recentAttempts.length / 2));

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        if (secondAvg > firstAvg + 5) trend = 'improving';
        else if (secondAvg < firstAvg - 5) trend = 'declining';
    }

    return trend;
}

/**
 * Ranqueia os temas com mais erros (Top 5)
 */
export function rankTopErrors(themeData: Record<string, ThemeAggregatedStats>): string[] {
    return Object.entries(themeData)
        .map(([theme, data]) => ({ theme, errors: data.errors, total: data.total }))
        .filter(t => t.errors > 0)
        .sort((a, b) => b.errors - a.errors)
        .slice(0, 5)
        .map(t => {
            const label = THEME_LABELS[t.theme as PsychiatryTheme] || t.theme;
            return `${label}: ${t.errors} erro(s) em ${t.total} questões`;
        });
}

/**
 * Calcula a Ofensiva de Dias (Streak)
 */
export function calculateStreak(previousStreak: number, previousActivityDate?: string | Date): number {
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

    return newStreak;
}
