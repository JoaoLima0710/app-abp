
const { questions2025 } = require('./src/db/questions_2025.ts');

const themeCounts = {};
let total = 0;

questions2025.forEach(q => {
    total++;
    const t = q.theme;
    themeCounts[t] = (themeCounts[t] || 0) + 1;
});

console.log('Total Questions:', total);
console.log('Theme Breakdown:', themeCounts);
