import { Flashcard } from '../types';

export const flashcardsOriginais: Flashcard[] = [
    // Psicofarmacologia
    {
        id: "fc_base_1",
        theme: "psicofarmacologia",
        front: "Qual é a alteração no ECG mais característica associada ao uso crônico de lítio?",
        back: "Inversão ou achatamento da onda T, que geralmente é benigna e reversível.",
    },
    {
        id: "fc_base_2",
        theme: "psicofarmacologia",
        front: "Qual a janela terapêutica habitual do Lítio para manutenção no Transtorno Bipolar?",
        back: "0,6 a 1,2 mEq/L.",
    },
    {
        id: "fc_base_3",
        theme: "psicofarmacologia",
        front: "Paciente com depressão bipolar e obesidade. Qual estabilizador de humor pode favorecer perda de peso?",
        back: "Topiramato.",
    },
    {
        id: "fc_base_4",
        theme: "psicofarmacologia",
        front: "Qual o risco hematológico restrito, porém grave, do uso da Clozapina (requerendo hemograma)?",
        back: "Agranulocitose.",
    },
    {
        id: "fc_base_5",
        theme: "psicofarmacologia",
        front: "Antidepressivo mais frequentemente associado à elevação da pressão arterial de forma dose-dependente?",
        back: "Venlafaxina (em doses > 150mg/dia).",
    },

    // Esquizofrenia e Psicoses
    {
        id: "fc_base_6",
        theme: "esquizofrenia_psicose",
        front: "Segundo o DSM-5-TR, qual a duração mínima dos sintomas para o diagnóstico de Esquizofrenia?",
        back: "Mínimo de 6 meses (incluindo pródromos ou sintomas residuais), com pelo menos 1 mês de sintomas da fase ativa.",
    },
    {
        id: "fc_base_7",
        theme: "esquizofrenia_psicose",
        front: "Qual é a tríade de sintomas clássicos de um Episódio Psicótico Breve?",
        back: "Delírios, alucinações ou discurso desorganizado, mas a resolução completa ocorre dentro de 1 mês.",
    },
    {
        id: "fc_base_8",
        theme: "esquizofrenia_psicose",
        front: "Diagnóstico diferencial: sintomas psicóticos que duram mais de 1 mês, mas menos de 6 meses.",
        back: "Transtorno Esquizofreniforme.",
    },

    // Transtornos do Humor
    {
        id: "fc_base_9",
        theme: "transtornos_humor",
        front: "Requisito temporal básico para diagnosticar um Episódio Depressivo Maior (DSM-5-TR)?",
        back: "Sintomas presentes na maior parte do dia, quase todos os dias, por pelo menos 2 semanas.",
    },
    {
        id: "fc_base_10",
        theme: "transtornos_humor",
        front: "Diferença temporal definidora entre Episódio Maníaco e Hipomaníaco?",
        back: "Maníaco: Duração mínima de 1 semana (ou qualquer duração se exigir internação). Hipomaníaco: Duração de 4 a 6 dias.",
    },
    {
        id: "fc_base_11",
        theme: "transtornos_humor",
        front: "Sintomas depressivos não alcançando critérios severos, mas presentes por pelo menos 2 anos.",
        back: "Transtorno Depressivo Persistente (Distimia).",
    },

    // Ansiedade
    {
        id: "fc_base_12",
        theme: "transtornos_ansiedade",
        front: "Mecanismo de ação primário dos benzodiazepínicos na neurofisiologia da ansiedade?",
        back: "Modulação alostérica positiva do receptor GABA-A, aumentando a frequência de abertura do canal de cloro.",
    },
    {
        id: "fc_base_13",
        theme: "transtornos_ansiedade",
        front: "Ansiedade generalizada deve ocorrer na maioria dos dias por um período mínimo de quanto tempo (DSM-5-TR)?",
        back: "No mínimo 6 meses.",
    },
    {
        id: "fc_base_14",
        theme: "transtornos_ansiedade",
        front: "Qual o tratamento de primeira linha (psicofarmacológico e não famacológico) para TOC?",
        back: "ISRS em doses altas + Terapia Cognitivo-Comportamental (EPR - Exposição e Prevenção de Respostas).",
    },

    // Dependência Química
    {
        id: "fc_base_15",
        theme: "dependencia_quimica",
        front: "A tríade clínica da intoxicação aguda por opioides é composta por:",
        back: "Rebaixamento do nível de consciência, depressão respiratória e miose puntiforme.",
    },
    {
        id: "fc_base_16",
        theme: "dependencia_quimica",
        front: "Antídoto específico recomendado para reverter imediatamente a sobredose de opioides?",
        back: "Naloxona.",
    },
    {
        id: "fc_base_17",
        theme: "dependencia_quimica",
        front: "Sintomas clássicos de Delirium Tremens (abstinência grave de álcool).",
        back: "Rebaixamento do nível de consciência, desorientação, alucinações visuais (zoopsias) e hiperatividade autonômica franca.",
    },

    // Infantil e Adolescencia
    {
        id: "fc_base_18",
        theme: "psiquiatria_infantojuvenil",
        front: "Idade máxima de início dos sintomas de TDAH exigida pelo DSM-5-TR?",
        back: "Antes dos 12 anos de idade.",
    },
    {
        id: "fc_base_19",
        theme: "psiquiatria_infantojuvenil",
        front: "Principal diagnóstico diferencial do Transtorno Opositivo Desafiador (TOD) envolvendo violação grave de direitos?",
        back: "Transtorno da Conduta.",
    },
    {
        id: "fc_base_20",
        theme: "psiquiatria_infantojuvenil",
        front: "Tríade de domínios deficitários clássicos no Transtorno do Espectro Autista (TEA)?",
        back: "Déficits em reciprocidade social, comunicação não verbal, e padrões restritos/repetitivos de comportamento.",
    }
];
