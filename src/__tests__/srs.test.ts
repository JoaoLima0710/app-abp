import { describe, it, expect } from 'vitest';
import { calculateReview, getNextReviewDate, INITIAL_ITEM, SRSItem } from '../services/srs';

describe('SRS Service — calculateReview', () => {
    it('deve iniciar com valores padrão', () => {
        expect(INITIAL_ITEM).toEqual({
            interval: 0,
            repetition: 0,
            efactor: 2.5,
        });
    });

    it('grade 0 (incorreto) deve resetar repetição e intervalo para 1', () => {
        const item: SRSItem = { interval: 6, repetition: 3, efactor: 2.5 };
        const result = calculateReview(item, 0);

        expect(result.interval).toBe(1);
        expect(result.repetition).toBe(0);
    });

    it('grade 3 (difícil) na primeira repetição define intervalo = 1', () => {
        const result = calculateReview(INITIAL_ITEM, 3);

        expect(result.interval).toBe(1);
        expect(result.repetition).toBe(1);
    });

    it('grade 4 (bom) na segunda repetição define intervalo = 6', () => {
        const afterFirst = calculateReview(INITIAL_ITEM, 4);
        const result = calculateReview(afterFirst, 4);

        expect(result.interval).toBe(6);
        expect(result.repetition).toBe(2);
    });

    it('grade 5 (fácil) escala intervalo com efactor após estabilizar', () => {
        let item = INITIAL_ITEM;
        item = calculateReview(item, 5); // rep=1, interval=1
        item = calculateReview(item, 5); // rep=2, interval=6
        const result = calculateReview(item, 5); // rep=3, interval = 6 * efactor

        expect(result.interval).toBeGreaterThan(6);
        expect(result.repetition).toBe(3);
    });

    it('efactor nunca cai abaixo de 1.3', () => {
        let item: SRSItem = { interval: 6, repetition: 2, efactor: 1.35 };
        // Multiple grade 0 should reduce efactor but not below 1.3
        item = calculateReview(item, 0);
        item = calculateReview(item, 0);
        item = calculateReview(item, 0);

        expect(item.efactor).toBeGreaterThanOrEqual(1.3);
    });

    it('sequência progressiva: repetição aumenta e intervalo cresce', () => {
        let item = INITIAL_ITEM;
        const intervals: number[] = [];

        for (let i = 0; i < 5; i++) {
            item = calculateReview(item, 4);
            intervals.push(item.interval);
        }

        // Intervals should increase (or stay constant for first 2)
        for (let i = 2; i < intervals.length; i++) {
            expect(intervals[i]).toBeGreaterThanOrEqual(intervals[i - 1]);
        }
    });

    it('efactor melhora com respostas fáceis (grade 5)', () => {
        const result = calculateReview(INITIAL_ITEM, 5);
        expect(result.efactor).toBeGreaterThanOrEqual(INITIAL_ITEM.efactor);
    });
});

describe('SRS Service — getNextReviewDate', () => {
    it('deve retornar timestamp futuro para intervalo positivo', () => {
        const now = Date.now();
        const nextDate = getNextReviewDate(1);

        expect(nextDate).toBeGreaterThan(now);
    });

    it('deve retornar timestamp ~7 dias no futuro para intervalo 7', () => {
        const now = Date.now();
        const nextDate = getNextReviewDate(7);
        const diff = nextDate - now;
        const diffDays = diff / (1000 * 60 * 60 * 24);

        expect(diffDays).toBeCloseTo(7, 0);
    });

    it('intervalo 0 deve retornar hoje', () => {
        const now = Date.now();
        const nextDate = getNextReviewDate(0);
        const diff = Math.abs(nextDate - now);

        // Should be within 1 second of now
        expect(diff).toBeLessThan(1000);
    });
});
