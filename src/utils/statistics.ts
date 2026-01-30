
import { PsychiatryTheme, Question } from '../types';
import { questionsHistorical } from '../db/questions_historical';
import { questions2025 } from '../db/questions_2025';

export interface SubThemeData {
    name: string;
    yearlyFrequency: Record<string, number>;
}

export interface TrendData {
    theme: PsychiatryTheme;
    yearlyFrequency: Record<string, number>;
    subthemes: SubThemeData[];
    totalQuestions: number;
    trend: 'rising' | 'stable' | 'declining';
    lastAppeared: string;
    probability: number;
}

const ALL_QUESTIONS: Question[] = [...questionsHistorical, ...questions2025];

// Helper to extract year from ID (p2019_001 -> 2019) or Tags
function getYear(q: Question): string | null {
    // Try regex on ID first (most reliable)
    const match = q.id.match(/^p(\d{4})_/);
    if (match) return match[1];

    // Fallback to tags
    if (q.tags) {
        const yearTag = q.tags.find(t => t.match(/^\d{4}$/));
        if (yearTag) return yearTag;
    }
    return null;
}

export function calculateTrends(): TrendData[] {
    const themeMap: Record<string, {
        yearlyFrequency: Record<string, number>;
        subthemes: Record<string, Record<string, number>>;
    }> = {};

    const availableYears = new Set<string>();

    // 1. Aggregate Counts
    ALL_QUESTIONS.forEach(q => {
        const year = getYear(q);
        if (!year) return;
        availableYears.add(year);

        if (!themeMap[q.theme]) {
            themeMap[q.theme] = { yearlyFrequency: {}, subthemes: {} };
        }

        // Increment Theme Year Count
        themeMap[q.theme].yearlyFrequency[year] = (themeMap[q.theme].yearlyFrequency[year] || 0) + 1;

        // Increment Subtheme Year Count
        const subtheme = q.subtheme || 'Geral';
        // Normalize "Classificado Automaticamente" to "Geral"
        const cleanSubtheme = subtheme === 'Classificado Automaticamente' ? 'Geral' : subtheme;

        if (!themeMap[q.theme].subthemes[cleanSubtheme]) {
            themeMap[q.theme].subthemes[cleanSubtheme] = {};
        }
        themeMap[q.theme].subthemes[cleanSubtheme][year] = (themeMap[q.theme].subthemes[cleanSubtheme][year] || 0) + 1;
    });

    const years = Array.from(availableYears).sort();
    const latestYear = years[years.length - 1]; // 2025
    const previousYear = years.includes('2024') ? '2024' : years[years.length - 2]; // 2024 or 2023

    // Total questions per year (for calculating percentage/probability)
    const questionsPerYear: Record<string, number> = {};
    years.forEach(y => {
        questionsPerYear[y] = ALL_QUESTIONS.filter(q => getYear(q) === y).length;
    });


    // 2. Build TrendData Objects
    const trends: TrendData[] = Object.entries(themeMap).map(([themeKey, data]) => {
        const theme = themeKey as PsychiatryTheme;
        const total = Object.values(data.yearlyFrequency).reduce((a, b) => a + b, 0);

        // Subthemes Array
        const subthemes: SubThemeData[] = Object.entries(data.subthemes).map(([name, freq]) => ({
            name,
            yearlyFrequency: freq
        }));

        // Calculate Frequency % for Latest vs Previous
        // Using Frequency % is better than raw count if totals differ
        const countLatest = data.yearlyFrequency[latestYear] || 0;
        const countPrev = data.yearlyFrequency[previousYear] || 0;

        const totalLatest = questionsPerYear[latestYear] || 1;
        const totalPrev = questionsPerYear[previousYear] || 1;

        const freqLatest = countLatest / totalLatest;
        const freqPrev = countPrev / totalPrev;

        let trend: 'rising' | 'stable' | 'declining' = 'stable';
        const threshold = 0.02; // 2% change threshold

        if (freqLatest > freqPrev + threshold) trend = 'rising';
        else if (freqLatest < freqPrev - threshold) trend = 'declining';

        // Probability (Frequency in latest exam as proxy for probability)
        const probability = Math.round(freqLatest * 100);

        return {
            theme,
            yearlyFrequency: data.yearlyFrequency,
            subthemes,
            totalQuestions: total,
            trend,
            lastAppeared: countLatest > 0 ? latestYear : (countPrev > 0 ? previousYear : 'Antigo'),
            probability
        };
    });

    return trends.sort((a, b) => b.totalQuestions - a.totalQuestions);
}

export const getAvailableYears = () => {
    const years = new Set<string>();
    ALL_QUESTIONS.forEach(q => {
        const y = getYear(q);
        if (y) years.add(y);
    });
    return Array.from(years).sort();
};
