
export interface SRSItem {
    interval: number; // days
    repetition: number;
    efactor: number;
}

export type SRSGrade = 0 | 3 | 4 | 5;
// 0: Incorrect / Total Blackout
// 3: Hard (Pass)
// 4: Good (Pass)
// 5: Easy (Pass)

export const INITIAL_ITEM: SRSItem = {
    interval: 0,
    repetition: 0,
    efactor: 2.5
};

export function calculateReview(item: SRSItem, grade: SRSGrade): SRSItem {
    let { interval, repetition, efactor } = item;

    if (grade >= 3) {
        // Correct response
        if (repetition === 0) {
            interval = 1;
        } else if (repetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * efactor);
        }
        repetition += 1;
    } else {
        // Incorrect response
        repetition = 0;
        interval = 1;
    }

    // Update E-Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // q is grade
    const newEfactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

    // EF cannot fall below 1.3
    efactor = Math.max(1.3, newEfactor);

    return {
        interval,
        repetition,
        efactor
    };
}

export function getNextReviewDate(intervalDays: number): number {

    // Add interval days to current time
    // But usually SRS aligns to "start of day".
    // For simplicity, we just add 24h * days. 
    // If days = 0 (or 1 means tomorrow?), usually SM-2 interval is in days.
    // Let's assume interval=1 means "Review tomorrow".
    // But if we want "Review in 10 minutes" for failed items?
    // SM-2 is day-based. 
    // Minimal adaptation: If Grade 0, actually set due date to NOW + 10 mins (or keep in 'learning' queue).
    // For this simple implementation, '1 day' is the minimum granularity for "graduated" cards.
    // We can handle intraday "learning" steps in the UI/Hook logic (i.e. if repetition=0, it's in learning queue).

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);
    return nextDate.getTime();
}
