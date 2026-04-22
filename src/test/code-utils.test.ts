import { describe, expect, it } from 'vitest';

import { SECOND_LETTERS, isPotentialCodeInput, parseInput, parseVoiceInput } from '@/lib/code-utils';

describe('code-utils', () => {
  it('accepts any configured letter in the second code position', () => {
    expect(SECOND_LETTERS).toContain('J');
    expect(parseInput('B1J8')).toBe('CVAN-B-1-J-8');
    expect(parseInput('F26A5')).toBe('CVAN-F-26-A-5');
  });

  it('supports the new bin prefixes when they are separated from the code', () => {
    expect(parseInput('S A1A1')).toBe('SCRAPBIN-A-1-A-1');
    expect(parseInput('D-B1')).toBe('DAMAGEBIN-B-1');
    expect(parseInput('F J8A2')).toBe('FESTIVEBIN-J-8-A-2');
  });

  it('keeps numeric codes unprefixed', () => {
    expect(parseInput('8900351614516')).toBe('8900351614516');
  });

  it('parses spoken mixed codes with later letters', () => {
    expect(parseVoiceInput('B 1 J 8')).toBe('CVAN-B-1-J-8');
    expect(parseVoiceInput('scrapbin A 1 A 1')).toBe('SCRAPBIN-A-1-A-1');
  });

  it('treats incomplete but valid progress as a potential code input', () => {
    expect(isPotentialCodeInput('F2')).toBe(true);
    expect(isPotentialCodeInput('S ')).toBe(true);
    expect(isPotentialCodeInput('Z9')).toBe(false);
  });
});