import { describe, it, expect } from 'vitest';
import { getPetEvolutionStage, getPetEvolutionScale } from './pet';

describe('getPetEvolutionStage', () => {
    it('should return "baby" for level < 5', () => {
        expect(getPetEvolutionStage(1)).toBe('baby');
        expect(getPetEvolutionStage(4)).toBe('baby');
    });

    it('should return "teen" for level 5-14', () => {
        expect(getPetEvolutionStage(5)).toBe('teen');
        expect(getPetEvolutionStage(10)).toBe('teen');
        expect(getPetEvolutionStage(14)).toBe('teen');
    });

    it('should return "adult" for level >= 15', () => {
        expect(getPetEvolutionStage(15)).toBe('adult');
        expect(getPetEvolutionStage(20)).toBe('adult');
        expect(getPetEvolutionStage(100)).toBe('adult');
    });

    it('should handle edge cases', () => {
        expect(getPetEvolutionStage(0)).toBe('baby');
    });
});

describe('getPetEvolutionScale', () => {
    it('should return 0.7 for baby stage', () => {
        expect(getPetEvolutionScale(1)).toBe(0.7);
        expect(getPetEvolutionScale(4)).toBe(0.7);
    });

    it('should return 0.85 for teen stage', () => {
        expect(getPetEvolutionScale(5)).toBe(0.85);
        expect(getPetEvolutionScale(14)).toBe(0.85);
    });

    it('should return 1.0 for adult stage', () => {
        expect(getPetEvolutionScale(15)).toBe(1.0);
        expect(getPetEvolutionScale(30)).toBe(1.0);
    });
});
