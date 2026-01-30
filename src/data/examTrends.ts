import { PsychiatryTheme } from '../types';

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


// Data from ABP Exam Trends (2019-2025)
export const examTrends: TrendData[] = [
    {
        theme: 'neurociencias_diagnostico',
        yearlyFrequency: {
            '2019': 14, '2020': 20, '2021': 36, '2022': 27, '2023': 36, '2024': 8, '2025': 77
        },
        subthemes: [
            { name: 'Neurociências e Diagnóstico Geral', yearlyFrequency: { '2025': 77 } },
            { name: 'Risco de Suicídio', yearlyFrequency: { '2025': 0 } }
        ],
        totalQuestions: 141, // Update totals implicitly or ignore? Trends logic sums these usually.
        trend: 'rising',
        lastAppeared: '2025',
        probability: 99
    },
    {
        theme: 'psicofarmacologia',
        yearlyFrequency: {
            '2019': 7, '2020': 7, '2021': 14, '2022': 13, '2023': 15, '2024': 8, '2025': 14
        },
        subthemes: [
            { name: 'Psicofarmacologia Geral', yearlyFrequency: { '2025': 14 } },
            { name: 'Lítio e Estabilizadores', yearlyFrequency: { '2025': 0 } }
        ],
        totalQuestions: 83,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 98
    },
    {
        theme: 'transtornos_humor',
        yearlyFrequency: {
            '2019': 7, '2020': 9, '2021': 8, '2022': 18, '2023': 10, '2024': 7, '2025': 27
        },
        subthemes: [
            { name: 'Depressão Resistente', yearlyFrequency: { '2025': 0 } },
            { name: 'Geral', yearlyFrequency: { '2025': 27 } }
        ],
        totalQuestions: 82,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'esquizofrenia_psicose',
        yearlyFrequency: {
            '2019': 2, '2020': 3, '2021': 5, '2022': 3, '2023': 6, '2024': 5, '2025': 11
        },
        subthemes: [
            { name: 'Primeiro Episódio Psicótico', yearlyFrequency: { '2025': 0 } },
            { name: 'Geral', yearlyFrequency: { '2025': 11 } }
        ],
        totalQuestions: 49,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 90
    },
    {
        theme: 'psiquiatria_infantojuvenil',
        yearlyFrequency: {
            '2019': 1, '2020': 3, '2021': 5, '2022': 7, '2023': 1, '2024': 5, '2025': 17
        },
        subthemes: [
            { name: 'TDAH ao Longo da Vida', yearlyFrequency: { '2025': 0 } },
            { name: 'Geral', yearlyFrequency: { '2025': 17 } }
        ],
        totalQuestions: 53,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'psiquiatria_forense',
        yearlyFrequency: {
            '2019': 0, '2020': 2, '2021': 23, '2022': 15, '2023': 21, '2024': 5, '2025': 11
        },
        subthemes: [
            { name: 'Capacidade Civil e Interdição', yearlyFrequency: { '2025': 0 } },
            { name: 'Geral', yearlyFrequency: { '2025': 11 } }
        ],
        totalQuestions: 36,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 75
    },
    {
        theme: 'urgencias_psiquiatricas',
        yearlyFrequency: {
            '2019': 1, '2020': 0, '2021': 0, '2022': 0, '2023': 0, '2024': 4, '2025': 1
        },
        subthemes: [
            { name: 'Geral', yearlyFrequency: { '2025': 1 } }
        ],
        totalQuestions: 29,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 70
    },
    {
        theme: 'psicogeriatria',
        yearlyFrequency: {
            '2019': 0, '2020': 0, '2021': 0, '2022': 0, '2023': 0, '2024': 3, '2025': 21
        },
        subthemes: [
            { name: 'Demências e Envelhecimento', yearlyFrequency: { '2025': 21 } }
        ],
        totalQuestions: 48,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 90
    },
    {
        theme: 'transtornos_ansiedade',
        yearlyFrequency: {
            '2019': 5, '2020': 6, '2021': 6, '2022': 12, '2023': 7, '2024': 2, '2025': 6
        },
        subthemes: [
            { name: 'Transtornos de Ansiedade', yearlyFrequency: { '2025': 6 } }
        ],
        totalQuestions: 22,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 80
    },
    {
        theme: 'transtornos_personalidade',
        yearlyFrequency: {
            '2019': 2, '2020': 0, '2021': 1, '2022': 1, '2023': 0, '2024': 2, '2025': 12
        },
        subthemes: [
            { name: 'Geral', yearlyFrequency: { '2025': 12 } }
        ],
        totalQuestions: 25,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 75
    },
    {
        theme: 'dependencia_quimica',
        yearlyFrequency: {
            '2019': 1, '2020': 0, '2021': 2, '2022': 4, '2023': 2, '2024': 4, '2025': 0
        },
        subthemes: [
            { name: 'Alcoolismo', yearlyFrequency: { '2025': 0 } }
        ],
        totalQuestions: 35,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 75
    }
];
