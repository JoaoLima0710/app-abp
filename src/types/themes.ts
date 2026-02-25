export type PsychiatryTheme =
    | 'transtornos_humor'
    | 'transtornos_ansiedade'
    | 'esquizofrenia_psicose'
    | 'transtornos_personalidade'
    | 'psicofarmacologia'
    | 'neurociencias'
    | 'psiquiatria_infantojuvenil'
    | 'psicogeriatria'
    | 'dependencia_quimica'
    | 'psicopatologia_diagnostico'
    | 'etica_forense_legal'
    | 'urgencias_psiquiatricas'
    | 'psicoterapia'
    | 'transtornos_alimentares'
    | 'saude_publica'
    | 'geral'
    | 'diagnostico'
    | 'etica_legal'
    | 'psiquiatria_forense'
    | 'neurociencias_diagnostico'
    | 'psiquiatria_geriatrica';

export const THEME_LABELS: Record<PsychiatryTheme, string> = {
    transtornos_humor: 'Transtornos do Humor',
    transtornos_ansiedade: 'Transtornos de Ansiedade',
    esquizofrenia_psicose: 'Psicoses',
    transtornos_personalidade: 'Transtornos de Personalidade',
    psicofarmacologia: 'Psicofarmacologia',
    neurociencias: 'Neurociência',
    psiquiatria_infantojuvenil: 'Psiquiatria Infantojuvenil',
    psicogeriatria: 'Psicogeriatria',
    dependencia_quimica: 'Dependência Química',
    psicopatologia_diagnostico: 'Psicopatologia e Diagnóstico',
    etica_forense_legal: 'Ética, Forense e Legislação',
    urgencias_psiquiatricas: 'Urgências Psiquiátricas',
    psicoterapia: 'Psicoterapia',
    transtornos_alimentares: 'Transtornos Alimentares',
    saude_publica: 'Saúde Pública',
    geral: 'Geral (Legado)',
    diagnostico: 'Diagnóstico (Legado)',
    etica_legal: 'Ética Legal (Legado)',
    psiquiatria_forense: 'Forense (Legado)',
    neurociencias_diagnostico: 'Neurociência (Legado)',
    psiquiatria_geriatrica: 'Geriátrica (Legado)',
};

export const THEME_COLORS: Record<PsychiatryTheme, string> = {
    transtornos_humor: '#8b5cf6',
    transtornos_ansiedade: '#eab308',
    esquizofrenia_psicose: '#f43f5e',
    transtornos_personalidade: '#14b8a6',
    psicofarmacologia: '#06b6d4',
    neurociencias: '#a855f7',
    psiquiatria_infantojuvenil: '#f97316',
    psicogeriatria: '#64748b',
    dependencia_quimica: '#7c3aed',
    psicopatologia_diagnostico: '#be185d',
    etica_forense_legal: '#6366f1',
    urgencias_psiquiatricas: '#ef4444',
    psicoterapia: '#10b981',
    transtornos_alimentares: '#ec4899',
    saude_publica: '#3b82f6',
    geral: '#94a3b8',
    diagnostico: '#be185d',
    etica_legal: '#6366f1',
    psiquiatria_forense: '#6366f1',
    neurociencias_diagnostico: '#a855f7',
    psiquiatria_geriatrica: '#64748b',
};
