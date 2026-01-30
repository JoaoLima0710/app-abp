
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

        let effectiveTheme = q.theme;
        let effectiveSubtheme = q.subtheme || 'Geral';

        // Dynamic Reclassification for "Neurociências e Diagnóstico"
        if (q.theme === 'neurociencias_diagnostico' || q.theme === 'transtornos_ansiedade' || q.theme === 'transtornos_humor' || q.theme === 'psicofarmacologia' || q.theme === 'etica_legal') {
            const s = q.statement.toLowerCase() + ' ' + (q.subtheme || '').toLowerCase() + ' ' + (q.tags?.join(' ') || '').toLowerCase();

            // NEUROCIÊNCIAS
            if (q.theme === 'neurociencias_diagnostico') {
                const isNeuro = s.includes('neuro') || s.includes('sinapse') || s.includes('receptor') ||
                    s.includes('genética') || s.includes('gaba') || s.includes('glutamato') ||
                    s.includes('dopamina') || s.includes('serotonina') || s.includes('córtex') ||
                    s.includes('lobo') || s.includes('cerebral') || s.includes('via ');

                if (isNeuro) {
                    effectiveTheme = 'neurociencias';
                    if (s.includes('genética') || s.includes('gene') || s.includes('dna') || s.includes('polimorfismo')) {
                        effectiveSubtheme = 'Genética e Biologia Molecular';
                    } else if (s.includes('neurofisiologia') || s.includes('potencial') || s.includes('despolarização') || s.includes('canal')) {
                        effectiveSubtheme = 'Neurofisiologia';
                    } else if (s.includes('neuroanatomia') || s.includes('córtex') || s.includes('lobo') || s.includes('circuito')) {
                        effectiveSubtheme = 'Neuroanatomia e Circuitos';
                    } else if (s.includes('neurotransmissor') || s.includes('receptor') || s.includes('sinapse')) {
                        effectiveSubtheme = 'Neurotransmissores e Receptores';
                    } else {
                        effectiveSubtheme = 'Neurociências Básicas e Outros';
                    }
                } else {
                    effectiveTheme = 'diagnostico';
                    if (s.includes('dsm') || s.includes('cid') || s.includes('critério') || s.includes('classificação')) effectiveSubtheme = 'Sistemas Classificatórios';
                    else if (s.includes('entrevista') || s.includes('anamnese') || s.includes('exame') || s.includes('mental')) effectiveSubtheme = 'Entrevista e Exame Psíquico';
                    else if (s.includes('psicopatologia') || s.includes('sintoma') || s.includes('sinal') || s.includes('delírio') || s.includes('alucinação')) effectiveSubtheme = 'Psicopatologia Geral';
                    else effectiveSubtheme = 'Semiologia e Propedêutica';
                }
            }

            // TRANSTORNOS DE HUMOR (incluindo Ansiedade se solicitado ou manter separado - user asked to split within Humor)
            // Reclassifying Anxiety into Humor for this specific view request
            if (q.theme === 'transtornos_ansiedade') {
                effectiveTheme = 'transtornos_humor';
                effectiveSubtheme = 'Ansiedade';
            }

            if (effectiveTheme === 'transtornos_humor') {
                if (s.includes('bipolar') || s.includes('tab') || s.includes('mania') || s.includes('hipomania')) {
                    if (s.includes('tipo 1') || s.includes('tipo i ') || s.includes('mania franca')) effectiveSubtheme = 'Transtorno Bipolar Tipo 1';
                    else if (s.includes('tipo 2') || s.includes('tipo ii') || s.includes('hipomania')) effectiveSubtheme = 'Transtorno Bipolar Tipo 2';
                    else effectiveSubtheme = 'Transtorno Bipolar (NE)';
                } else if (s.includes('depress') || s.includes('distimia') || s.includes('maior')) {
                    effectiveSubtheme = 'Depressão Unipolar';
                } else if (s.includes('ansiedade') || s.includes('pânico') || s.includes('fobia') || s.includes('tag') || s.includes('obsessivo') || s.includes('compulsivo') || s.includes('estresse')) {
                    effectiveSubtheme = 'Ansiedade e Estresse';
                } else {
                    effectiveSubtheme = 'Outros Transtornos do Humor';
                }
            }

            // PSICOFARMACOLOGIA
            if (q.theme === 'psicofarmacologia') {
                if (s.includes('estabilizador') || s.includes('lítio') || s.includes('valproato') || s.includes('carbamazepina') || s.includes('lamotrigina')) {
                    effectiveSubtheme = 'Estabilizadores de Humor';
                } else if (s.includes('isrs') || s.includes('fluoxetina') || s.includes('sertralina') || s.includes('escitalopram') || s.includes('paroxetina')) {
                    effectiveSubtheme = 'ISRS';
                } else if (s.includes('dual') || s.includes('venlafaxina') || s.includes('duloxetina') || s.includes('desvenlafaxina') || s.includes('tricíclico')) {
                    effectiveSubtheme = 'Duais e Tricíclicos';
                } else if (s.includes('antipsicótico') || s.includes('neuroléptico') || s.includes('olanzapina') || s.includes('risperidona') || s.includes('quetiapina') || s.includes('clozapina')) {
                    effectiveSubtheme = 'Antipsicóticos';
                } else if (s.includes('benzodiazepínic') || s.includes('clonazepam') || s.includes('diazepam') || s.includes('alprazolam')) {
                    effectiveSubtheme = 'Benzodiazepínicos';
                } else {
                    effectiveSubtheme = 'Outras Classes / Mecanismos Gerais';
                }
            }

            // FORENSE (ÉTICA E LEGAL)
            if (q.theme === 'etica_legal') {
                if (s.includes('imputabilidade') || s.includes('penal') || s.includes('crime') || s.includes('ato infracional')) {
                    effectiveSubtheme = 'Imputabilidade Penal e Criminal';
                } else if (s.includes('civil') || s.includes('capacidade') || s.includes('interdição') || s.includes('curatela')) {
                    effectiveSubtheme = 'Capacidade Civil e Interdição';
                } else if (s.includes('perícia') || s.includes('documento') || s.includes('laudo') || s.includes('atestado') || s.includes('prontuário')) {
                    effectiveSubtheme = 'Perícia e Documentos Médicos';
                } else if (s.includes('internação') || s.includes('involuntária') || s.includes('compulsória')) {
                    effectiveSubtheme = 'Internação e Direitos do Paciente';
                } else {
                    effectiveSubtheme = 'Ética Médica e Bioética';
                }
            }
        }

        if (!themeMap[effectiveTheme]) {
            themeMap[effectiveTheme] = { yearlyFrequency: {}, subthemes: {} };
        }

        // Increment Theme Year Count
        themeMap[effectiveTheme].yearlyFrequency[year] = (themeMap[effectiveTheme].yearlyFrequency[year] || 0) + 1;

        // Cleanup subtheme
        const cleanSubtheme = effectiveSubtheme === 'Classificado Automaticamente' ? 'Geral' : effectiveSubtheme;

        if (!themeMap[effectiveTheme].subthemes[cleanSubtheme]) {
            themeMap[effectiveTheme].subthemes[cleanSubtheme] = {};
        }
        themeMap[effectiveTheme].subthemes[cleanSubtheme][year] = (themeMap[effectiveTheme].subthemes[cleanSubtheme][year] || 0) + 1;
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
