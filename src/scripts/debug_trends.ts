
import { calculateTrends, getAvailableYears } from '../utils/statistics';
import { THEME_LABELS } from '../types';

const trends = calculateTrends();
const years = getAvailableYears();

console.log('Available Years:', years);
console.log('Trends Sample (Top 2):');
console.log(JSON.stringify(trends.slice(0, 2), null, 2));

// Check for missing labels
trends.forEach(t => {
    if (!THEME_LABELS[t.theme]) {
        console.warn('MISSING LABEL FOR THEME:', t.theme);
    }
});
