import { Question } from '../types';

// Questões inéditas, baseadas nos conceitos-chave do Tratado da ABP (simulação de geração por IA)
export const treatyQuestions: Question[] = [
    {
        id: 'tratado_001',
        theme: 'psicofarmacologia',
        difficulty: 3,
        statement: 'Segundo o Tratado da ABP, na abordagem da depressão bipolar resistente, qual a estratégia de combinação farmacológica possui maior nível de evidência (Nível 1) para prevenção de recaídas?',
        options: {
            A: 'Lítio + Valproato',
            B: 'Lítio + Lamotrigina',
            C: 'Quetiapina + Lamotrigina',
            D: 'Lítio + Quetiapina',
            E: 'Valproato + Aripiprazol',
        },
        correctAnswer: 'D',
        explanation: {
            correct: 'A combinação de Lítio + Quetiapina demonstra robusta evidência para prevenção de recaídas em transtorno bipolar, sendo uma estratégia de primeira linha para casos resistentes, conforme discutido nos capítulos de terapêutica do Tratado.',
            keyConcepts: ['Transtorno Bipolar', 'Manutenção', 'Polifarmácia Racional'],
            examTip: 'Associações com Lítio são frequentemente cobradas como padrão-ouro e primeira escolha em resistência.',
        },
        tags: ['tratado_abp', 'inédita', 'bipolar'],
        source: 'Tratado de Psiquiatria da ABP - 1ª Ed.'
    },
    {
        id: 'tratado_002',
        theme: 'esquizofrenia_psicose',
        difficulty: 2,
        statement: 'Em relação aos sintomas negativos primários da esquizofrenia (Síndrome Deficitária), qual dos seguintes domínios é considerado central e mais resistente ao tratamento farmacológico?',
        options: {
            A: 'Alogia',
            B: 'Embotamento afetivo',
            C: 'Avolição/Apatia',
            D: 'Déficit de atenção',
            E: 'Desorganização do pensamento',
        },
        correctAnswer: 'C',
        explanation: {
            correct: 'A avolição (falta de motivação iniciada por objetivos) e a apatia são consideradas domínios centrais da psicopatologia negativa e os que mais impactam o funcionamento global e prognóstico.',
            keyConcepts: ['Sintomas Negativos', 'Psicopatologia', 'Prognóstico'],
            examTip: 'Diferencie sintomas negativos primários (doença) de secundários (efeito de medicação ou depressão).',
        },
        tags: ['tratado_abp', 'inédita', 'esquizofrenia'],
        source: 'Tratado de Psiquiatria da ABP'
    },
    {
        id: 'tratado_003',
        theme: 'dependencia_quimica',
        difficulty: 2,
        statement: 'No tratamento do Transtorno por Uso de Álcool, o Acamprosato atua primariamente através da modulação de quel sistema de neurotransmissão?',
        options: {
            A: 'Antagonismo Opicoide',
            B: 'Inibição da Aldeído Desidrogenase',
            C: 'Modulação Glutamatérgica (Receptores NMDA)',
            D: 'Agonismo GABA-B',
            E: 'Bloqueio Dopaminérgico Mesolímbico',
        },
        correctAnswer: 'C',
        explanation: {
            correct: 'O Acamprosato atua restaurando o equilíbrio glutamatérgico, normalizando a hiperexcitabilidade NMDA que ocorre na abstinência prolongada.',
            keyConcepts: ['Dependência de Álcool', 'Farmacodinâmica', 'Acamprosato'],
            examTip: 'Naltrexona = Opioide; Dissulfiram = Aldeído Desidrogenase; Acamprosato = Glutamato.',
        },
        tags: ['tratado_abp', 'inédita', 'alcoolismo'],
        source: 'Tratado de Psiquiatria da ABP'
    },
    {
        id: 'tratado_004',
        theme: 'psiquiatria_infantojuvenil',
        difficulty: 3,
        statement: 'Conforme capítulos sobre desenvolvimento do Tratado ABP, qual é a comorbidade psiquiátrica mais frequente em crianças com Transtorno do Espectro Autista (TEA)?',
        options: {
            A: 'Transtorno Depressivo Maior',
            B: 'TDAH',
            C: 'Transtorno Opositor Desafiante',
            D: 'Transtorno Bipolar',
            E: 'Transtorno de Ansiedade de Separação',
        },
        correctAnswer: 'B',
        explanation: {
            correct: 'Estudos epidemiológicos citados no Tratado indicam que o TDAH é a comorbidade mais prevalente no TEA, ocorrendo em cerca de 30-50% dos casos.',
            keyConcepts: ['TEA', 'Comorbidades', 'Infância'],
            examTip: 'Até o DSM-IV, o diagnóstico duplo era proibido. No DSM-5/Tratado ABP, é a regra, não a exceção.',
        },
        tags: ['tratado_abp', 'inédita', 'tea'],
        source: 'Tratado de Psiquiatria da ABP'
    },
    {
        id: 'tratado_005',
        theme: 'psicofarmacologia',
        difficulty: 3,
        statement: 'Paciente em uso de Lamotrigina desenvolve rash cutâneo difuso na 2ª semana de tratamento. Segundo as diretrizes de segurança, qual a conduta imediata recomendada?',
        options: {
            A: 'Reduzir a dose pela metade e introduzir corticoide',
            B: 'Introduzir anti-histamínico e observar por 48h',
            C: 'Suspender a Lamotrigina imediatamente e permanentemente',
            D: 'Suspender temporariamente e reintroduzir mais lentamente após resolução',
            E: 'Manter a dose e associar corticoide tópico',
        },
        correctAnswer: 'C',
        explanation: {
            correct: 'Devido ao risco de Síndrome de Stevens-Johnson, qualquer rash cutâneo (especialmente nas primeiras 8 semanas) indica suspensão imediata e definitiva da Lamotrigina.',
            keyConcepts: ['Lamotrigina', 'Efeitos Adversos Graves', 'Manejo Clínico'],
        },
        tags: ['tratado_abp', 'inédita', 'segurança'],
        source: 'Tratado de Psiquiatria da ABP'
    },
    {
        id: 'tratado_006',
        theme: 'urgencias_psiquiatricas',
        difficulty: 2,
        statement: 'Na avaliação do risco de suicídio, qual fator é considerado o preditor mais forte de uma futura tentativa consumada?',
        options: {
            A: 'Histórico familiar de suicídio',
            B: 'Gênero masculino',
            C: 'Histórico de tentativas prévias',
            D: 'Presença de transtorno de humor',
            E: 'Abuso de substâncias ativo',
        },
        correctAnswer: 'C',
        explanation: {
            correct: 'Embora todos sejam fatores de risco, o histórico de tentativas prévias é, isoladamente, o preditor estatístico mais forte para o suicídio consumado.',
            keyConcepts: ['Suicídio', 'Fatores de Risco', 'Epidemiologia'],
        },
        tags: ['tratado_abp', 'inédita', 'suicidio'],
        source: 'Tratado de Psiquiatria da ABP'
    }
];
