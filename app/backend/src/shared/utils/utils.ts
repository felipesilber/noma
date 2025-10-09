import { PriceLevel } from '@prisma/client';

export function priceToSymbols(level?: PriceLevel | null) {
  if (!level) return undefined;
  const map: Record<PriceLevel, string> = {
    ONE: '$',
    TWO: '$$',
    THREE: '$$$',
    FOUR: '$$$$',
  };
  return map[level];
}
