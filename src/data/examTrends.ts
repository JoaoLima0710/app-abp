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

// Data extrapolated from ABP Exam Trends (2019-2025 Prediction)
export const examTrends: TrendData[] = [
    {
        theme: 'psicofarmacologia',
        yearlyFrequency: {
            '2019': 8, '2020': 9, '2021': 8, '2022.1': 9, '2022.2': 8, '2023.1': 10, '2023.2': 9, '2024': 8, '2025': 9 // Projected
        },
        subthemes: [
            { name: 'Antipsicóticos de Ação Prolongada (LAIs)', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 3, '2023.2': 2, '2024': 3, '2025': 4 } },
            { name: 'Clozapina e Manejo de Riscos', yearlyFrequency: { '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 1, '2023.1': 2, '2023.2': 2, '2024': 1, '2025': 2 } },
            { name: 'Interações Medicamentosas (CYP450)', yearlyFrequency: { '2019': 1, '2020': 2, '2021': 1, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Lítio e Estabilizadores', yearlyFrequency: { '2019': 3, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 1, '2025': 1 } },
            { name: 'Ketamina e Novos Antidepressivos', yearlyFrequency: { '2019': 0, '2020': 0, '2021': 0, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 0 } }
        ],
        totalQuestions: 78,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 95
    },
    {
        theme: 'transtornos_humor',
        yearlyFrequency: {
            '2019': 7, '2020': 6, '2021': 7, '2022.1': 7, '2022.2': 6, '2023.1': 7, '2023.2': 8, '2024': 7, '2025': 8
        },
        subthemes: [
            { name: 'Depressão Resistente', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 3, '2023.2': 3, '2024': 3, '2025': 3 } },
            { name: 'Diagnóstico Diferencial TB x TDM', yearlyFrequency: { '2019': 3, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Transtorno Disfórico Pré-menstrual', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 0, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 1 } }
        ],
        totalQuestions: 63,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 92
    },
    {
        theme: 'esquizofrenia_psicose',
        yearlyFrequency: {
            '2019': 5, '2020': 5, '2021': 4, '2022.1': 5, '2022.2': 5, '2023.1': 4, '2023.2': 5, '2024': 5, '2025': 5
        },
        subthemes: [
            { name: 'Primeiro Episódio Psicótico', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 1, '2022.1': 2, '2022.2': 1, '2023.1': 1, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Catatonia', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 1 } }
        ],
        totalQuestions: 43,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 85
    },
    {
        theme: 'psiquiatria_infantojuvenil',
        yearlyFrequency: {
            '2019': 3, '2020': 4, '2021': 4, '2022.1': 5, '2022.2': 4, '2023.1': 5, '2023.2': 6, '2024': 5, '2025': 6
        },
        subthemes: [
            { name: 'TEA (Autismo) em Adultos', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 1, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 3, '2024': 2, '2025': 3 } },
            { name: 'TDAH ao Longo da Vida', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 2, '2022.1': 2, '2022.2': 1, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Disforia de Gênero', yearlyFrequency: { '2019': 0, '2020': 0, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 1 } }
        ],
        totalQuestions: 42,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 88
    },
    {
        theme: 'psiquiatria_forense',
        yearlyFrequency: {
            '2019': 1, '2020': 2, '2021': 2, '2022.1': 3, '2022.2': 3, '2023.1': 4, '2023.2': 5, '2024': 5, '2025': 5
        },
        subthemes: [
            { name: 'Capacidade Civil e Interdição', yearlyFrequency: { '2019': 0, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Imputabilidade Penal', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Sigilo Médico', yearlyFrequency: { '2019': 0, '2020': 0, '2021': 0, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 1 } }
        ],
        totalQuestions: 30,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 75
    },
    {
        theme: 'urgencias_psiquiatricas',
        yearlyFrequency: {
            '2019': 4, '2020': 3, '2021': 4, '2022.1': 3, '2022.2': 4, '2023.1': 3, '2023.2': 3, '2024': 4, '2025': 4
        },
        subthemes: [
            { name: 'Síndrome Neuroléptica Maligna', yearlyFrequency: { '2025': 1 } as any },
            { name: 'Risco de Suicídio', yearlyFrequency: { '2025': 2 } as any },
            { name: 'Agitação Psicomotora', yearlyFrequency: { '2025': 1 } as any }
        ],
        totalQuestions: 32,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 70
    },
    {
        theme: 'dependencia_quimica',
        yearlyFrequency: {
            '2019': 5, '2020': 4, '2021': 5, '2022.1': 4, '2022.2': 5, '2023.1': 4, '2023.2': 4, '2024': 4, '2025': 4
        },
        subthemes: [
            { name: 'Alcoolismo', yearlyFrequency: { '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 2 } },
            { name: 'Opioides e Tratamento', yearlyFrequency: { '2019': 1, '2020': 1, '2021': 1, '2022.1': 1, '2022.2': 1, '2023.1': 1, '2023.2': 1, '2024': 1, '2025': 1 } }
        ],
        totalQuestions: 35,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 75
    },
    {
        theme: 'etica_legal',
        yearlyFrequency: {
            '2019': 2, '2020': 3, '2021': 3, '2022.1': 3, '2022.2': 4, '2023.1': 4, '2023.2': 5, '2024': 4, '2025': 4
        },
        subthemes: [],
        totalQuestions: 28,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 70
    },
    {
        theme: 'psicoterapia',
        yearlyFrequency: {
            '2019': 3, '2020': 3, '2021': 2, '2022.1': 3, '2022.2': 2, '2023.1': 2, '2023.2': 3, '2024': 2, '2025': 2
        },
        subthemes: [],
        totalQuestions: 20,
        trend: 'declining',
        lastAppeared: '2024',
        probability: 50
    },
    {
        theme: 'neurociencias_diagnostico',
        yearlyFrequency: {
            '2019': 2, '2020': 2, '2021': 3, '2022.1': 3, '2022.2': 3, '2023.1': 4, '2023.2': 4, '2024': 4, '2025': 4
        },
        subthemes: [],
        totalQuestions: 25,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 65
    },
    {
        theme: 'transtornos_ansiedade',
        yearlyFrequency: {
            '2019': 2, '2020': 2, '2021': 2, '2022.1': 2, '2022.2': 2, '2023.1': 2, '2023.2': 2, '2024': 2, '2025': 2
        },
        subthemes: [],
        totalQuestions: 16,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 40
    },
    {
        theme: 'psiquiatria_geriatrica',
        yearlyFrequency: {
            '2019': 3, '2020': 3, '2021': 3, '2022.1': 4, '2022.2': 3, '2023.1': 4, '2023.2': 4, '2024': 3, '2025': 3
        },
        subthemes: [],
        totalQuestions: 27,
        trend: 'rising',
        lastAppeared: '2024',
        probability: 60
    },
    {
        theme: 'saude_publica',
        yearlyFrequency: { '2025': 2 } as any, // New, no history
        subthemes: [],
        totalQuestions: 15,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 30
    },
    {
        theme: 'neurociencias',
        yearlyFrequency: { '2025': 2 } as any, // New
        subthemes: [],
        totalQuestions: 10,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 30
    },
    {
        theme: 'psicogeriatria',
        yearlyFrequency: { '2025': 2 } as any, // New
        subthemes: [],
        totalQuestions: 10,
        trend: 'stable',
        lastAppeared: '2024',
        probability: 30
    }
];
