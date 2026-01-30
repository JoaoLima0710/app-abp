import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfLib = require('pdf-parse');
const PDFParse = pdfLib.PDFParse;

const filePath = '/Users/joao/Desktop/Banco de dados /Provas 2019 a 2024.2 Sem marcações.pdf';
const outputPath = 'src/db/questions_historical.ts';

async function ingest() {
    try {
        console.log("Reading file...");
        const dataBuffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(dataBuffer);

        console.log("Parsing PDF...");
        const instance = new PDFParse(uint8Array);
        const result = await instance.getText();
        const fullText = result.text;

        const resetRegex = /(?:Questão|QUESTÃO)\s*0?1(?!\d)/g;
        let match;
        const startIndices = [];

        while ((match = resetRegex.exec(fullText)) !== null) {
            startIndices.push(match.index);
        }

        console.log(`Found ${startIndices.length} exam blocks.`);

        const allQuestions = [];

        for (let i = 0; i < startIndices.length; i++) {
            const start = startIndices[i];
            const end = (i + 1 < startIndices.length) ? startIndices[i + 1] : fullText.length;
            const blockText = fullText.substring(start, end);

            // Lookback for headers
            const lookback = fullText.substring(Math.max(0, start - 2000), start).toLowerCase();

            if (lookback.includes("gabarito")) {
                console.log(`[Block ${i}] Skipped (Gabarito context)`);
                continue;
            }

            let detectedYear = "Unknown";

            // Precise Index Mapping
            if (i === 0) detectedYear = "2019";
            else if (i === 1) detectedYear = "2020";
            else if (start >= 210000 && start < 220000) detectedYear = "2021"; // Block 3 (~214k)
            else if (start >= 430000 && start < 440000) detectedYear = "2022"; // Block 5 (~433k)
            else if (start >= 640000) detectedYear = "2023"; // Block 6 (~647k)
            else {
                // Fallback regex in lookback
                if (lookback.includes("2024")) detectedYear = "2024";
                else if (lookback.includes("2023")) detectedYear = "2023";
                else if (lookback.includes("2022")) detectedYear = "2022";
                else if (lookback.includes("2021")) detectedYear = "2021";
            }

            console.log(`[Block ${i}] Parsing as: ${detectedYear} (Index: ${start})`);

            const blockQs = parseBlock(blockText, detectedYear);
            allQuestions.push(...blockQs);
        }

        console.log(`Final Total: ${allQuestions.length} questions.`);

        const content = `import { Question } from '../types';\n\nexport const questionsHistorical: Question[] = ${JSON.stringify(allQuestions, null, 4)};`;
        fs.writeFileSync(outputPath, content);
        console.log(`Written to ${outputPath}`);

    } catch (e) {
        console.error(e);
    }
}

// Define Keywords
const THEME_KEYWORDS = {
    'neurociencias_diagnostico': ['neurociência', 'neuroimagem', 'neurotransmissor', 'sinapse', 'genética', 'diagnóstico', 'dsm-5', 'cid-11', 'exame psíquico', 'anamnese', 'frontal', 'dopamina', 'delirium', 'alzheimer', 'demência', 'sono', 'insônia'],
    'psicofarmacologia': ['farmacologia', 'mecanismo de ação', 'antidepressivo', 'isrs', 'antipsicótico', 'clozapina', 'lítio', 'estabilizador', 'ácido valproico', 'benzodiazepínico', 'metilfenidato', 'cetamina', 'medicamento'],
    'transtornos_humor': ['depressão', 'depressivo', 'distimia', 'bipolar', 'mania', 'hipomania', 'suicídio', 'humor'],
    'esquizofrenia_psicose': ['esquizofrenia', 'psicose', 'psicótico', 'delírio', 'alucinação', 'catatonia'],
    'transtornos_ansiedade': ['ansiedade', 'pânico', 'fobia', 'tag', 'obsessivo', 'compulsivo', 'toc', 'tept', 'estresse'],
    'psiquiatria_infantojuvenil': ['infância', 'adolescência', 'autismo', 'tea', 'tdah', 'hiperatividade', 'deficiência intelectual', 'infantil'],
    'psicogeriatria': ['idoso', 'envelhecimento', 'geriatria'],
    'transtornos_personalidade': ['personalidade', 'borderline', 'narcisista', 'histriônica', 'anissocial', 'paranoide'],
    'dependencia_quimica': ['dependência', 'abuso', 'abstinência', 'álcool', 'tabaco', 'cocaína', 'maconha', 'opioide', 'droga'],
    'psiquiatria_forense': ['forense', 'lei', 'ética', 'cfm', 'imputabilidade', 'interdição', 'perícia', 'sigilo', 'internação'],
    'urgencias_psiquiatricas': ['emergência', 'urgência', 'agitação', 'contenção']
};

const TARGET_THEMES = Object.keys(THEME_KEYWORDS);

function classifyText(text) {
    const lowerText = text.toLowerCase();
    const scores = {};
    for (const theme of TARGET_THEMES) {
        scores[theme] = 0;
        for (const kw of THEME_KEYWORDS[theme]) {
            if (lowerText.includes(kw)) scores[theme]++;
        }
    }
    let maxScore = 0;
    let bestTheme = 'neurociencias_diagnostico';
    for (const theme of TARGET_THEMES) {
        if (scores[theme] > maxScore) {
            maxScore = scores[theme];
            bestTheme = theme;
        }
    }
    return bestTheme;
}

function parseBlock(text, year) {
    const lines = text.split('\n');
    const questions = [];
    let currentQuestion = null;
    const qStartRegex = /^(?:Questão|QUESTÃO)\s*(\d+)/i;

    // Normalize year for ID
    const yearId = year.replace('.', '_');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const match = trimmed.match(qStartRegex);
        if (match) {
            if (currentQuestion) {
                // Classify before pushing
                currentQuestion.theme = classifyText(currentQuestion.statement);
                questions.push(currentQuestion);
            }

            const num = match[1].padStart(3, '0');
            const id = `p${yearId}_${num}`;

            currentQuestion = {
                id: id,
                theme: 'general', // Will be classified on push
                subtheme: 'Classificado Automaticamente',
                difficulty: 3,
                statement: trimmed,
                options: {},
                correctAnswer: '?',
                explanation: 'Imported from PDF',
                tags: [year, 'pdf_ingestion']
            };
        } else {
            if (currentQuestion) currentQuestion.statement += '\n' + trimmed;
        }
    }
    if (currentQuestion) {
        currentQuestion.theme = classifyText(currentQuestion.statement);
        questions.push(currentQuestion);
    }
    return questions;
}

ingest();
