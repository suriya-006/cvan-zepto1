import { describe, expect, it } from 'vitest';

import { SECOND_LETTERS, parseInput, parseVoiceInput } from '@/lib/code-utils';

describe('code-utils', () => {
  it('accepts any configured letter in the second code position', () => {
    expect(SECOND_LETTERS).toContain('J');
    expect(parseInput('B1J8')).toBe('CVAN-B-1-J-8');
    expect(parseInput('F26A5')).toBe('CVAN-F-26-A-5');
  });

  it('keeps numeric codes unprefixed', () => {
    expect(parseInput('8900351614516')).toBe('8900351614516');
  });

  it('parses spoken mixed codes with later letters', () => {
    expect(parseVoiceInput('B 1 J 8')).toBe('CVAN-B-1-J-8');
  });
});