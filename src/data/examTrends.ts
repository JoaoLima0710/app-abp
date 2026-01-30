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
            '2019': 8, '2020': 8, '2021': 8, '2022.1': 8, '2022.2': 8, '2023.1': 8, '2023.2': 8, '2024': 8, '2025': 101
        },
        subthemes: [
            { name: 'Neurociências e Diagnóstico Geral', yearlyFrequency: { '2025': 99 } },
            { name: 'Risco de Suicídio', yearlyFrequency: { '2025': 2 } }
        ],
        totalQuestions: 165,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 99
    },
    {
        theme: 'psicofarmacologia',
        yearlyFrequency: {
            '2019': 8, '2020': 9, '2021': 8, '2022.1': 9, '2022.2': 8, '2023.1': 10, '2023.2': 9, '2024': 8, '2025': 17
        },
        subthemes: [
            { name: 'Psicofarmacologia Geral', yearlyFrequency: { '2025': 17 } as any },
            { name: 'Clozapina e Manejo de Riscos', yearlyFrequency: { '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 1, '2023.1': 2, '2023.2': 2, '2024': 1, '2025': 0 } },
            { name: 'Lítio e Estabilizadores', yearlyFrequency: { '2019': 3, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 1, '2025': 0 } },
            { name: 'Antipsicóticos de Ação Prolongada (LAIs)', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 3, '2023.2': 2, '2024': 3, '2025': 0 } },
            { name: 'Ketamina e Novos Antidepressivos', yearlyFrequency: { '2019': 0, '2020': 0, '2021': 0, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 0 } }
        ],
        totalQuestions: 86,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 98
    },
    {
        theme: 'transtornos_humor',
        yearlyFrequency: {
            '2019': 7, '2020': 6, '2021': 7, '2022.1': 7, '2022.2': 6, '2023.1': 7, '2023.2': 8, '2024': 7, '2025': 24
        },
        subthemes: [
            { name: 'Depressão Resistente', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 3, '2023.2': 3, '2024': 3, '2025': 2 } },
            { name: 'Diagnóstico Diferencial TB x TDM', yearlyFrequency: { '2019': 3, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 1 } },
            { name: 'Transtorno Disfórico Pré-menstrual', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 0, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 0 } }
        ],
        totalQuestions: 79,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'esquizofrenia_psicose',
        yearlyFrequency: {
            '2019': 5, '2020': 5, '2021': 4, '2022.1': 5, '2022.2': 5, '2023.1': 4, '2023.2': 5, '2024': 5, '2025': 11
        },
        subthemes: [
            { name: 'Primeiro Episódio Psicótico', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 1, '2022.1': 2, '2022.2': 1, '2023.1': 1, '2023.2': 2, '2024': 2, '2025': 0 } },
            { name: 'Catatonia', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 0 } }
        ],
        totalQuestions: 49,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 90
    },
    {
        theme: 'psiquiatria_infantojuvenil',
        yearlyFrequency: {
            '2019': 3, '2020': 4, '2021': 4, '2022.1': 5, '2022.2': 4, '2023.1': 5, '2023.2': 6, '2024': 5, '2025': 12
        },
        subthemes: [
            { name: 'TDAH ao Longo da Vida', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 2, '2022.1': 2, '2022.2': 1, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 0 } },
            { name: 'TEA (Autismo) em Adultos', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 1, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 3, '2024': 2, '2025': 0 } },
            { name: 'Disforia de Gênero', yearlyFrequency: { '2019': 0, '2020': 0, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 0 } }
        ],
        totalQuestions: 48,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 95
    },
    {
        theme: 'psiquiatria_forense',
        yearlyFrequency: {
            '2019': 1, '2020': 2, '2021': 2, '2022.1': 3, '2022.2': 3, '2023.1': 4, '2023.2': 5, '2024': 5, '2025': 2
        },
        subthemes: [
            { name: 'Capacidade Civil e Interdição', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 0 } }
        ],
        totalQuestions: 27,
        trend: 'stable',
        lastAppeared: '2025',
        probability: 75
    },
    {
        theme: 'urgencias_psiquiatricas',
        yearlyFrequency: {
            '2019': 4, '2020': 3, '2021': 4, '2022.1': 3, '2022.2': 4, '2023.1': 3, '2023.2': 3, '2024': 4, '2025': 0
        },
        subthemes: [
            { name: 'Risco de Suicídio', yearlyFrequency: { '2025': 0 } as any }
        ],
        totalQuestions: 28,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 70
    },
    {
        theme: 'psicogeriatria',
        yearlyFrequency: {
            '2019': 3, '2020': 3, '2021': 3, '2022.1': 4, '2022.2': 3, '2023.1': 4, '2023.2': 4, '2024': 3, '2025': 19
        },
        subthemes: [
            { name: 'Demências e Envelhecimento', yearlyFrequency: { '2025': 19 } as any }
        ],
        totalQuestions: 46,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 90
    },
    {
        theme: 'transtornos_ansiedade',
        yearlyFrequency: {
            '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 6
        },
        subthemes: [
            { name: 'Transtornos de Ansiedade', yearlyFrequency: { '2025': 6 } as any }
        ],
        totalQuestions: 22,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 80
    },
    {
        theme: 'transtornos_personalidade',
        yearlyFrequency: {
            '2019': 1, '2020': 1, '2021': 2, '2022.1': 1, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 14
        },
        subthemes: [
            { name: 'Geral', yearlyFrequency: { '2025': 13 } },
            { name: 'Risco de Suicídio', yearlyFrequency: { '2025': 1 } }
        ],
        totalQuestions: 27,
        trend: 'rising',
        lastAppeared: '2025',
        probability: 75
    },
    {
        theme: 'dependencia_quimica',
        yearlyFrequency: {
            '2019': 5, '2020': 4, '2021': 5, '2022.1': 4, '2022.2': 5, '2023.1': 4, '2023.2': 4, '2024': 4, '2025': 0
        },
        subthemes: [
            { name: 'Alcoolismo', yearlyFrequency: { '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 0 } }
        ],
        totalQuestions: 31,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 75
    }
];
