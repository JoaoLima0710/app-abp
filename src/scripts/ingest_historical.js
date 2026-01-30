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
        const text = result.text;

        console.log("Processing text...");

        const lines = text.split('\n');
        const questions = [];

        let currentYear = '2019';
        let currentQuestion = null;

        // Regex helpers
        // "Abp 2019", "Prova objetiva 2020", "Prova ABP 2022.2", "TEP - 2023.2"
        const yearHeaderRegex = /(?:^|\s)(?:ABP|PROVA|TEP).{0,30}(20(?:19|20|21|22|23|24)(?:\.\d)?)/i;
        const questionStartRegex = /^(?:Questão|QUESTÃO)\s*(\d+)/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Check for Year Header
            // We want to avoid false positives like references inside text or "2024" in a law number.
            // Strict check: Line should be short-ish or contain keywords
            if (line.length < 100 && yearHeaderRegex.test(line)) {
                const match = line.match(yearHeaderRegex);
                if (match) {
                    const newYear = match[1];
                    // Only update if it looks like a meaningful change or initialization
                    // And exclude widely off matches if any
                    console.log(`[INFO] Found potential year header: "${line}" -> ${newYear}`);
                    currentYear = newYear;
                }
            }

            // Check for Question Start
            const qMatch = line.match(questionStartRegex);
            if (qMatch) {
                // Save previous question
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }

                // Start new question
                const qNum = qMatch[1].padStart(3, '0');
                const id = `p${currentYear.replace('.', '_')}_${qNum}`; // e.g. p2019_001

                currentQuestion = {
                    id: id,
                    theme: 'general', // Default, needs tagging logic later
                    subtheme: 'Geral',
                    difficulty: 3,
                    statement: line, // Start with this line
                    options: {}, // Parsing options is hard without structure, usually they are A)... B)...
                    correctAnswer: '?',
                    explanation: 'Imported from PDF',
                    tags: [currentYear, 'imported', 'pdf_ingestion']
                };
            } else {
                // Append to current question
                if (currentQuestion) {
                    // Try to detect options like "A)" or "(A)"
                    // For now, simplify: just append to statement.
                    // We can refine option parsing if the format is consistent (e.g. ^A\))
                    currentQuestion.statement += '\n' + line;
                }
            }
        }

        // Push last question
        if (currentQuestion) {
            questions.push(currentQuestion);
        }

        console.log(`Extracted ${questions.length} questions.`);

        // Write to file
        const content = `import { Question } from './questions';\n\nexport const questionsHistorical: Question[] = ${JSON.stringify(questions, null, 4)};`;
        fs.writeFileSync(outputPath, content);
        console.log(`Written to ${outputPath}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

ingest();
