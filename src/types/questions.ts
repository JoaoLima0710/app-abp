import { PsychiatryTheme } from './themes';

export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionTaxonomy {
    tier: 1 | 2 | 3 | 4;
    axis:
    | 'diagnostico'
    | 'farmacologia'
    | 'psicopatologia'
    | 'epidemiologia'
    | 'tratamento_nao_farmacologico'
    | 'etica_legislacao'
    | 'fundamentos'
    | 'gestao'
    | 'intervencao';
    cognitiveSkill:
    | 'memorizacao'
    | 'compreensao'
    | 'aplicacao'
    | 'analise'
    | 'sintese'
    | 'raciocinio_clinico'
    | 'aplicacao_pratica';
}

export const AXIS_LABELS: Record<QuestionTaxonomy['axis'], string> = {
    diagnostico: 'Diagnóstico',
    farmacologia: 'Farmacologia',
    psicopatologia: 'Psicopatologia',
    epidemiologia: 'Epidemiologia',
    tratamento_nao_farmacologico: 'Tratamento não Farmacológico',
    etica_legislacao: 'Ética e Legislação',
    fundamentos: 'Fundamentos',
    gestao: 'Gestão',
    intervencao: 'Intervenção',
};

export const SKILL_LABELS: Record<QuestionTaxonomy['cognitiveSkill'], string> = {
    memorizacao: 'Memorização',
    compreensao: 'Compreensão',
    aplicacao: 'Aplicação',
    analise: 'Análise',
    sintese: 'Síntese',
    raciocinio_clinico: 'Raciocínio Clínico',
    aplicacao_pratica: 'Aplicação Prática',
};

export interface ItemAnalysis {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
}

export interface Question {
    id: string;
    theme: PsychiatryTheme;
    subtheme?: string;
    difficulty: 1 | 2 | 3;
    statement: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: AnswerOption;
    explanation: {
        correct: string;
        wrongA?: string;
        wrongB?: string;
        wrongC?: string;
        wrongD?: string;
        wrongE?: string;
        keyConcepts: string[];
        examTip?: string;
    };
    itemAnalysis?: ItemAnalysis;
    source?: string;
    tags: string[];
    taxonomy?: QuestionTaxonomy;
    commentary?: string;
}

export interface CustomFlashcard {
    id: string;
    theme: PsychiatryTheme;
    subtheme?: string;
    front: string;
    back: string;
    createdAt: Date;
    userId?: string;
}

export interface Flashcard {
    id: string;
    theme: PsychiatryTheme;
    subtheme?: string;
    front: string;
    back: string;
    isCustom?: boolean; // If true, implies it came from CustomFlashcard DB table
}
