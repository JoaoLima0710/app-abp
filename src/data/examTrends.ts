import { PsychiatryTheme } from '../types';

export interface TrendData {
    theme: PsychiatryTheme;
    yearlyFrequency: Record<string, number>; // "2019": 3 questions
    totalQuestions: number;
    trend: 'rising' | 'stable' | 'declining';
    lastAppeared: string;
    probability: number; // 0-100% chance of appearing
}

// Data computada a partir das 665 questões originais ABP (2019-2025)
// Apenas questões oficiais de provas — NÃO inclui questões inéditas/curadas.
//
// Totais por ano: 2019=41, 2020=50, 2021=80, 2022=98, 2023=99, 2024=100, 2025=197

export const examTrends: TrendData[] = [
    {
        theme: 'neurociencias',
        yearlyFrequency: {
            '2019': 7, '2020': 10, '2021': 19, '2022': 17, '2023': 25, '2024': 23, '2025': 33
        },
        totalQuestions: 134,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'psicofarmacologia',
        yearlyFrequency: {
            '2019': 9, '2020': 9, '2021': 10, '2022': 14, '2023': 15, '2024': 12, '2025': 17
        },
        totalQuestions: 86,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'psicopatologia_diagnostico',
        yearlyFrequency: {
            '2019': 2, '2020': 6, '2021': 8, '2022': 15, '2023': 9, '2024': 14, '2025': 30
        },
        totalQuestions: 84,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'etica_forense_legal',
        yearlyFrequency: {
            '2019': 1, '2020': 0, '2021': 15, '2022': 7, '2023': 11, '2024': 6, '2025': 26
        },
        totalQuestions: 66,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 90
    },
    {
        theme: 'transtornos_humor',
        yearlyFrequency: {
            '2019': 5, '2020': 7, '2021': 7, '2022': 11, '2023': 5, '2024': 5, '2025': 22
        },
        totalQuestions: 62,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 90
    },
    {
        theme: 'psiquiatria_infantojuvenil',
        yearlyFrequency: {
            '2019': 2, '2020': 4, '2021': 6, '2022': 10, '2023': 5, '2024': 6, '2025': 15
        },
        totalQuestions: 48,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 85
    },
    {
        theme: 'transtornos_ansiedade',
        yearlyFrequency: {
            '2019': 5, '2020': 7, '2021': 4, '2022': 6, '2023': 5, '2024': 5, '2025': 12
        },
        totalQuestions: 44,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 80
    },
    {
        theme: 'psicogeriatria',
        yearlyFrequency: {
            '2019': 1, '2020': 4, '2021': 0, '2022': 2, '2023': 6, '2024': 7, '2025': 14
        },
        totalQuestions: 34,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 80
    },
    {
        theme: 'esquizofrenia_psicose',
        yearlyFrequency: {
            '2019': 3, '2020': 3, '2021': 5, '2022': 2, '2023': 6, '2024': 6, '2025': 7
        },
        totalQuestions: 32,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 75
    },
    {
        theme: 'dependencia_quimica',
        yearlyFrequency: {
            '2019': 1, '2020': 0, '2021': 3, '2022': 3, '2023': 2, '2024': 4, '2025': 5
        },
        totalQuestions: 18,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 65
    },
    {
        theme: 'urgencias_psiquiatricas',
        yearlyFrequency: {
            '2019': 3, '2020': 0, '2021': 0, '2022': 1, '2023': 5, '2024': 6, '2025': 2
        },
        totalQuestions: 17,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 60
    },
    {
        theme: 'saude_publica',
        yearlyFrequency: {
            '2019': 0, '2020': 0, '2021': 1, '2022': 4, '2023': 0, '2024': 2, '2025': 6
        },
        totalQuestions: 13,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 50
    },
    {
        theme: 'psicoterapia',
        yearlyFrequency: {
            '2019': 0, '2020': 0, '2021': 2, '2022': 2, '2023': 3, '2024': 1, '2025': 3
        },
        totalQuestions: 11,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 45
    },
    {
        theme: 'transtornos_personalidade',
        yearlyFrequency: {
            '2019': 2, '2020': 0, '2021': 0, '2022': 2, '2023': 1, '2024': 1, '2025': 4
        },
        totalQuestions: 10,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 35
    },
    {
        theme: 'transtornos_alimentares',
        yearlyFrequency: {
            '2019': 0, '2020': 0, '2021': 0, '2022': 2, '2023': 1, '2024': 2, '2025': 1
        },
        totalQuestions: 6,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 30
    }
];
