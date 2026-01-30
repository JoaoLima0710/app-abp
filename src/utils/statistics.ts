
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

    const availableYearsSet = new Set<string>();

    // 1. Aggregate Counts
    ALL_QUESTIONS.forEach(q => {
        const year = getYear(q);
        if (!year) return;
        availableYearsSet.add(year);

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

    // 2. Determine Contiguous Year Range
    const yearsSorted = Array.from(availableYearsSet).sort();
    const minYear = parseInt(yearsSorted[0]);
    const maxYear = parseInt(yearsSorted[yearsSorted.length - 1]);
    const allYears: string[] = [];
    for (let y = minYear; y <= maxYear; y++) {
        allYears.push(y.toString());
    }

    // 2025
    // Previous year in data might not be latest - 1 if data is missing, so we check availability or fallback
    // But for statistics we want the contiguous previous year if possible, or the last available one

    const questionsPerYear: Record<string, number> = {};
    allYears.forEach(y => {
        questionsPerYear[y] = ALL_QUESTIONS.filter(q => getYear(q) === y).length;
    });


    // 3. Build TrendData Objects
    const trends: TrendData[] = Object.entries(themeMap).map(([themeKey, data]) => {
        const theme = themeKey as PsychiatryTheme;
        const total = Object.values(data.yearlyFrequency).reduce((a, b) => a + b, 0);

        // Subthemes Array
        const subthemes: SubThemeData[] = Object.entries(data.subthemes).map(([name, freq]) => ({
            name,
            yearlyFrequency: freq
        }));

        // Calculate Trend Direction
        // Compare latest year freq vs previous AVAILABLE year freq (since 2024 is missing)
        const yearsWithData = Object.keys(data.yearlyFrequency).sort();
        const lastYearWithData = yearsWithData[yearsWithData.length - 1];
        const prevYearWithData = yearsWithData.length > 1 ? yearsWithData[yearsWithData.length - 2] : null;

        let freqLatest = 0;
        let freqPrev = 0;

        if (lastYearWithData && prevYearWithData) {
            freqLatest = data.yearlyFrequency[lastYearWithData] / (questionsPerYear[lastYearWithData] || 1);
            freqPrev = data.yearlyFrequency[prevYearWithData] / (questionsPerYear[prevYearWithData] || 1);
        }

        let trend: 'rising' | 'stable' | 'declining' = 'stable';
        const threshold = 0.02; // 2% change threshold

        if (freqLatest > freqPrev + threshold) trend = 'rising';
        else if (freqLatest < freqPrev - threshold) trend = 'declining';

        // Probability (Frequency in latest exam as proxy)
        const probability = Math.round(freqLatest * 100);

        return {
            theme,
            yearlyFrequency: data.yearlyFrequency, // Sparse map is fine, we handle filling in UI or here
            subthemes,
            totalQuestions: total,
            trend,
            lastAppeared: lastYearWithData || 'Antigo',
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
    const sorted = Array.from(years).sort();
    if (sorted.length === 0) return [];

    const min = parseInt(sorted[0]);
    const max = parseInt(sorted[sorted.length - 1]);
    const contiguous: string[] = [];
    for (let i = min; i <= max; i++) contiguous.push(i.toString());
    return contiguous;
};
