import { allQuestions } from './src/db/questions_originais';

interface Problem {
    id: string;
    statementSnippet: string;
    correctAnswer: string;
    correctText: string;
    explicacaoSnippet: string;
    reason: string;
}

const problems: Problem[] = [];

for (const q of allQuestions) {
    if (!q.explicacao) continue;

    const expl = q.explicacao.toLowerCase();
    const correctLetter = q.correctAnswer.toLowerCase();
    const correctText = q.options[q.correctAnswer as keyof typeof q.options]?.toLowerCase() || '';

    let hasPotentialContradiction = false;
    let reason = '';

    // Check if the explanation explicitly says another letter is correct
    const otherLetters = ['a', 'b', 'c', 'd', 'e'].filter(l => l !== correctLetter);

    for (const letter of otherLetters) {
        // Regex to find patterns like "a alternativa b está correta" or "resposta: b"
        const regexes = [
            new RegExp(`alternativa ${letter} (est[aá] )?correta`, 'i'),
            new RegExp(`resposta( incorreta| correta| certa)?:?\\s*${letter}\\b`, 'i'),
            new RegExp(`a resposta [ée] a? ${letter}\\b`, 'i')
        ];

        for (const regex of regexes) {
            if (regex.test(expl)) {
                // To avoid false positives like "a alternativa b está incorreta", we do a tighter check
                if (!expl.includes(`alternativa ${letter} está incorreta`) && !expl.includes(`alternativas ${letter}`)) {
                    hasPotentialContradiction = true;
                    reason = `Explanation might point to letter ${letter.toUpperCase()}, but correctAnswer is ${correctLetter.toUpperCase()}`;
                    break;
                }
            }
        }
        if (hasPotentialContradiction) break;
    }

    if (hasPotentialContradiction) {
        problems.push({
            id: q.id,
            statementSnippet: q.statement.substring(0, 50) + '...',
            correctAnswer: q.correctAnswer,
            correctText: correctText.substring(0, 50) + '...',
            explicacaoSnippet: q.explicacao.substring(0, 100) + '...',
            reason
        });
    }
}

console.log(`Auditoria concluída. Total de questões validadas: ${allQuestions.length}`);
console.log(`Problemas em potencial encontrados: ${problems.length}\n`);

if (problems.length > 0) {
    problems.slice(0, 10).forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`Gabarito: ${p.correctAnswer} - ${p.correctText}`);
        console.log(`Motivo do Alerta: ${p.reason}`);
        console.log(`Trecho Explicação: ${p.explicacaoSnippet}\n`);
    });

    if (problems.length > 10) {
        console.log(`... e mais ${problems.length - 10} questões suspeitas.`);
    }
} else {
    console.log("Nenhuma contradição clara detectada entre o gabarito e a explicação escrita.");
}
