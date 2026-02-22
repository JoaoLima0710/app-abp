import { Flashcard } from '../types';

export const flashcardsOriginais: Flashcard[] = [
    // Psicofarmacologia
    {
        id: "fc_base_1",
        theme: "psicofarmacologia",
        subtheme: "Estabilizadores de Humor — Lítio",
        front: "Qual é a alteração no ECG mais característica associada ao uso crônico de lítio?",
        back: "Inversão ou achatamento da onda T, que geralmente é benigna e reversível.",
    },
    {
        id: "fc_base_2",
        theme: "psicofarmacologia",
        subtheme: "Estabilizadores de Humor — Lítio",
        front: "Qual a janela terapêutica habitual do Lítio para manutenção no Transtorno Bipolar?",
        back: "0,6 a 1,2 mEq/L.",
    },
    {
        id: "fc_base_3",
        theme: "psicofarmacologia",
        subtheme: "Estabilizadores de Humor — Anticonvulsivantes",
        front: "Paciente com depressão bipolar e obesidade. Qual estabilizador de humor pode favorecer perda de peso?",
        back: "Topiramato.",
    },
    {
        id: "fc_base_4",
        theme: "psicofarmacologia",
        subtheme: "Antipsicóticos — Segunda Geração (Atípicos)",
        front: "Qual o risco hematológico restrito, porém grave, do uso da Clozapina (requerendo hemograma)?",
        back: "Agranulocitose.",
    },
    {
        id: "fc_base_5",
        theme: "psicofarmacologia",
        subtheme: "Antidepressivos — IRSN",
        front: "Antidepressivo mais frequentemente associado à elevação da pressão arterial de forma dose-dependente?",
        back: "Venlafaxina (em doses > 150mg/dia).",
    },

    // Esquizofrenia e Psicoses
    {
        id: "fc_base_6",
        theme: "esquizofrenia_psicose",
        subtheme: "Esquizofrenia — Clínica e Diagnóstico",
        front: "Segundo o DSM-5-TR, qual a duração mínima dos sintomas para o diagnóstico de Esquizofrenia?",
        back: "Mínimo de 6 meses (incluindo pródromos ou sintomas residuais), com pelo menos 1 mês de sintomas da fase ativa.",
    },
    {
        id: "fc_base_7",
        theme: "esquizofrenia_psicose",
        subtheme: "Outros Transtornos do Espectro Psicótico",
        front: "Qual é a tríade de sintomas clássicos de um Episódio Psicótico Breve?",
        back: "Delírios, alucinações ou discurso desorganizado, mas a resolução completa ocorre dentro de 1 mês.",
    },
    {
        id: "fc_base_8",
        theme: "esquizofrenia_psicose",
        subtheme: "Outros Transtornos do Espectro Psicótico",
        front: "Diagnóstico diferencial: sintomas psicóticos que duram mais de 1 mês, mas menos de 6 meses.",
        back: "Transtorno Esquizofreniforme.",
    },

    // Transtornos do Humor
    {
        id: "fc_base_9",
        theme: "transtornos_humor",
        subtheme: "Depressão — Diagnóstico e Clínica",
        front: "Requisito temporal básico para diagnosticar um Episódio Depressivo Maior (DSM-5-TR)?",
        back: "Pelo menos 2 semanas de humor deprimido ou perda de interesse/prazer (anedonia).",
    },
    {
        id: "fc_base_10",
        theme: "transtornos_humor",
        subtheme: "Transtorno Bipolar — Diagnóstico e Clínica",
        front: "Diferença temporal definidora entre Episódio Maníaco e Hipomaníaco?",
        back: "Maníaco: Duração mínima de 1 semana (ou qualquer duração se exigir internação). Hipomaníaco: Duração de 4 a 6 dias.",
    },
    {
        id: "fc_base_11",
        theme: "transtornos_humor",
        subtheme: "Depressão — Diagnóstico e Clínica",
        front: "Sintomas depressivos não alcançando critérios severos, mas presentes por pelo menos 2 anos.",
        back: "Transtorno Depressivo Persistente (Distimia).",
    },

    // Ansiedade
    {
        id: "fc_base_12",
        theme: "transtornos_ansiedade",
        subtheme: "Transtorno de Ansiedade Generalizada (TAG)",
        front: "No TAG, a preocupação e a ansiedade excessiva devem estar presentes na maioria dos dias por um período mínimo de quanto tempo (DSM-5-TR)?",
        back: "Pelo menos 6 meses.",
    },
    {
        id: "fc_base_13",
        theme: "transtornos_ansiedade",
        subtheme: "Transtorno de Pânico e Agorafobia",
        front: "Um paciente relata medo intenso e esquiva de multidões ou de estar sozinho fora de casa por medo de não ter socorro em caso de passar mal. Qual o diagnóstico mais provável?",
        back: "Agorafobia.",
    },
    {
        id: "fc_base_14",
        theme: "transtornos_ansiedade",
        subtheme: "TOC — Diagnóstico e Clínica",
        front: "Principal distinção entre o Transtorno Obsessivo-Compulsivo (TOC) e o Transtorno da Personalidade Obsessivo-Compulsiva (TPOC)?",
        back: "O TOC envolve obsessões e compulsões verdadeiras e gera sofrimento egodistônico. O TPOC envolve perfeccionismo e rigidez crônicos, muitas vezes egossintônicos.",
    },

    // Dependência Química
    {
        id: "fc_base_15",
        theme: "dependencia_quimica",
        subtheme: "Opioides",
        front: "A tríade clínica da intoxicação aguda por opioides é composta por:",
        back: "Rebaixamento do nível de consciência, depressão respiratória e miose puntiforme.",
    },
    {
        id: "fc_base_16",
        theme: "dependencia_quimica",
        subtheme: "Opioides",
        front: "Antídoto específico recomendado para reverter imediatamente a sobredose de opioides?",
        back: "Naloxona.",
    },
    {
        id: "fc_base_17",
        theme: "dependencia_quimica",
        subtheme: "Álcool",
        front: "Sintomas clássicos de Delirium Tremens (abstinência grave de álcool).",
        back: "Rebaixamento do nível de consciência, desorientação, alucinações visuais (zoopsias) e hiperatividade autonômica franca.",
    },

    // Infantil e Adolescencia
    {
        id: "fc_base_18",
        theme: "psiquiatria_infantojuvenil",
        subtheme: "TDAH",
        front: "Idade máxima de início dos sintomas de TDAH exigida pelo DSM-5-TR?",
        back: "Antes dos 12 anos de idade.",
    },
    {
        id: "fc_base_19",
        theme: "psiquiatria_infantojuvenil",
        subtheme: "Transtornos do Humor e Comportamento na Infância",
        front: "Principal diagnóstico diferencial do Transtorno Opositivo Desafiador (TOD) envolvendo violação grave de direitos?",
        back: "Transtorno da Conduta.",
    },
    {
        id: "fc_base_20",
        theme: "psiquiatria_infantojuvenil",
        subtheme: "Transtorno do Espectro Autista (TEA)",
        front: "Tríade de domínios deficitários clássicos no Transtorno do Espectro Autista (TEA)?",
        back: "Déficits em reciprocidade social, comunicação não verbal, e padrões restritos/repetitivos de comportamento.",
    }
];
