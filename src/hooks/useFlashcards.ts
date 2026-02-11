
import { useState, useEffect, useCallback } from 'react';
import { questionsOriginais } from '../db/questions_originais';
import { questionsTreaty } from '../db/questions_treaty';
const questions = [...questionsOriginais, ...questionsTreaty];
import { calculateReview, INITIAL_ITEM, SRSGrade, SRSItem } from '../services/srs';

// Storage Key
const STORAGE_KEY = 'psiq_flashcard_progress_v1';

export interface FlashcardData extends SRSItem {
    questionId: string;
    dueDate: number; // timestamp
    lastReviewed?: number; // timestamp
    history: { date: number; grade: SRSGrade }[];
}

export interface FlashcardState {
    [questionId: string]: FlashcardData;
}

/**
 * Standalone utility: add question IDs to the SRS queue with dueDate = now.
 * Can be called outside of React component lifecycle (e.g., from SimulationResults).
 */
export function addCardsToReview(questionIds: string[]): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    const progress: FlashcardState = stored ? JSON.parse(stored) : {};
    const now = Date.now();

    for (const qId of questionIds) {
        if (!progress[qId]) {
            progress[qId] = {
                questionId: qId,
                ...INITIAL_ITEM,
                dueDate: now, // due immediately
                history: [],
            };
        } else {
            // If already in SRS, reschedule as due now
            progress[qId].dueDate = now;
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useFlashcards() {
    const [progress, setProgress] = useState<FlashcardState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    });

    // Save to local storage whenever progress changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }, [progress]);

    // Initialize a card if it doesn't exist (starts as 'New')
    const getCardData = useCallback((questionId: string): FlashcardData => {
        if (progress[questionId]) {
            return progress[questionId];
        }
        return {
            questionId,
            ...INITIAL_ITEM,
            dueDate: 0, // 0 means "New" / Ready to learn immediately
            history: []
        };
    }, [progress]);

    const submitReview = useCallback((questionId: string, grade: SRSGrade) => {
        setProgress(prev => {
            const currentData = prev[questionId] || {
                questionId,
                ...INITIAL_ITEM,
                dueDate: 0,
                history: []
            };

            const result = calculateReview(currentData, grade);
            const now = Date.now();

            // Calculate next due date
            // interval is in days.
            // If interval is 1, due is tomorrow same time.
            const nextDue = new Date();
            nextDue.setDate(nextDue.getDate() + result.interval);

            return {
                ...prev,
                [questionId]: {
                    ...currentData,
                    ...result,
                    lastReviewed: now,
                    dueDate: nextDue.getTime(),
                    history: [...currentData.history, { date: now, grade }]
                }
            };
        });
    }, []);

    const getDueCards = useCallback(() => {
        const now = Date.now();
        // Return all cards where dueDate <= now OR dueDate is 0 (New)
        // We can limit "Total New Cards / Day" here if we want complexity.
        // For now, let's just return ALL due cards.

        // Filter questions that have progress OR are eligible to be started.
        // If we haven't started a question, it's "New".
        // Should we return ALL 600+ questions as "New"? Maybe too much.
        // Let's return:
        // 1. Cards already in progress (learning/review) that are due.
        // 2. A subset of New cards if the user wants to learn new things. 
        //    (Actually, let's just expose a function startNewCards(count)).

        // For "Study Mode", we usually want "Reviews" + "Some New".

        // Let's just find existing progress items that are due.
        const dueIds = Object.values(progress)
            .filter(p => p.dueDate <= now)
            .map(p => p.questionId);

        // Map to full question objects
        const dueQuestions = questions.filter(q => dueIds.includes(q.id));

        return dueQuestions;
    }, [progress]);

    const getStats = useCallback(() => {
        const items = Object.values(progress);
        const totalLearned = items.filter(i => i.repetition > 0).length;
        const dueCount = items.filter(i => i.dueDate <= Date.now()).length;
        // Total available questions - total learned = New/Unseen
        const totalQuestions = questions.length;

        return {
            totalLearned,
            dueCount,
            totalQuestions
        };
    }, [progress]);

    return {
        progress,
        getCardData,
        submitReview,
        getDueCards,
        getStats,
        addCardsToReview: useCallback((ids: string[]) => {
            addCardsToReview(ids);
            // Sync local state after external write
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setProgress(JSON.parse(stored));
        }, []),
    };
}
