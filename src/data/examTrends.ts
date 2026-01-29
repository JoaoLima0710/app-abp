import { PsychiatryTheme } from '../types';

export interface TrendData {
    theme: PsychiatryTheme;
    yearlyFrequency: Record<string, number>;
    totalQuestions: number;
    trend: 'rising' | 'stable' | 'declining';
    lastAppeared: string;
    probability: number;
}

// Data extrapolated from ABP Exam Trends (2017-2024)
export const examTrends: TrendData[] = [
    {
        theme: 'psicofarmacologia',
        yearlyFrequency: {
            '2019': 8, '2020': 9, '2021': 8, '2022.1': 9, '2022.2': 8, '2023.1': 10, '2023.2': 9, '2024': 8
        },
        totalQuestions: 69,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 95
    },
    {
        theme: 'transtornos_humor',
        yearlyFrequency: {
            '2019': 7, '2020': 6, '2021': 7, '2022.1': 7, '2022.2': 6, '2023.1': 7, '2023.2': 8, '2024': 7
        },
        totalQuestions: 55,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 90
    },
    {
        theme: 'esquizofrenia_psicose',
        yearlyFrequency: {
            '2019': 5, '2020': 5, '2021': 4, '2022.1': 5, '2022.2': 5, '2023.1': 4, '2023.2': 5, '2024': 5
        },
        totalQuestions: 38,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 85
    },
    {
        theme: 'psiquiatria_infantojuvenil',
        yearlyFrequency: {
            '2019': 3, '2020': 4, '2021': 4, '2022.1': 5, '2022.2': 4, '2023.1': 5, '2023.2': 6, '2024': 5
        },
        totalQuestions: 36,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 80
    },
    {
        theme: 'urgencias_psiquiatricas',
        yearlyFrequency: {
            '2019': 4, '2020': 3, '2021': 4, '2022.1': 3, '2022.2': 4, '2023.1': 3, '2023.2': 3, '2024': 4
        },
        totalQuestions: 28,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 70
    },
    {
        theme: 'dependencia_quimica',
        yearlyFrequency: {
            '2019': 5, '2020': 4, '2021': 5, '2022.1': 4, '2022.2': 5, '2023.1': 4, '2023.2': 4, '2024': 4
        },
        totalQuestions: 35,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 75
    },
    {
        theme: 'etica_legal',
        yearlyFrequency: {
            '2019': 2, '2020': 3, '2021': 3, '2022.1': 3, '2022.2': 4, '2023.1': 4, '2023.2': 5, '2024': 4
        },
        totalQuestions: 28,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 70
    },
    {
        theme: 'psicoterapia',
        yearlyFrequency: {
            '2019': 3, '2020': 3, '2021': 2, '2022.1': 3, '2022.2': 2, '2023.1': 2, '2023.2': 3, '2024': 2
        },
        totalQuestions: 20,
        trend: 'declining',
        lastAppeared: '2024',
        probability: 50
    },
    {
        theme: 'neurociencias_diagnostico',
        yearlyFrequency: {
            '2019': 2, '2020': 2, '2021': 3, '2022.1': 3, '2022.2': 3, '2023.1': 4, '2023.2': 4, '2024': 4
        },
        totalQuestions: 25,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 65
    },
    {
        theme: 'transtornos_ansiedade',
        yearlyFrequency: {
            '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2
        },
        totalQuestions: 16,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 40
    },
    {
        theme: 'psiquiatria_geriatrica',
        yearlyFrequency: {
            '2019': 3, '2020': 3, '2021': 3, '2022.1': 4, '2022.2': 3, '2023.1': 4, '2023.2': 4, '2024': 3
        },
        totalQuestions: 27,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 60
    }
];
