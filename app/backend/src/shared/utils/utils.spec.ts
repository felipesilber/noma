import { priceToSymbols } from './utils';
import { PriceLevel } from '@prisma/client';
describe('priceToSymbols', () => {
    it('returns undefined for null/undefined', () => {
        expect(priceToSymbols(null)).toBeUndefined();
        expect(priceToSymbols(undefined)).toBeUndefined();
    });
    it('maps ONE to $', () => {
        expect(priceToSymbols(PriceLevel.ONE)).toBe('$');
    });
    it('maps TWO to $$', () => {
        expect(priceToSymbols(PriceLevel.TWO)).toBe('$$');
    });
    it('maps THREE to $$$', () => {
        expect(priceToSymbols(PriceLevel.THREE)).toBe('$$$');
    });
    it('maps FOUR to $$$$', () => {
        expect(priceToSymbols(PriceLevel.FOUR)).toBe('$$$$');
    });
});
