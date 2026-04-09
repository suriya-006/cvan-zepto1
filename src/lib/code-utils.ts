const LETTER_SEQUENCE = 'ABCDEFGHIJKL';

export const FIRST_LETTERS = LETTER_SEQUENCE.split('');
export const SECOND_LETTERS = LETTER_SEQUENCE.split('');
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function formatCode(parts: string[]): string {
  return `CVAN-${parts.join('-')}`;
}

export function parseInput(input: string): string | null {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');

  // Pure number input should stay as-is
  if (/^\d+$/.test(cleaned)) {
    return cleaned;
  }

  // Short code: A1, A28 → CVAN-A-1, CVAN-A-28
  const match2 = cleaned.match(/^([A-L])(\d+)$/);
  if (match2) {
    const [, l1, n1] = match2;
    const num1 = parseInt(n1, 10);
    if (num1 >= 1) return `CVAN-${l1}-${num1}`;
  }

  // Long code: A1A1, A28A3, F26A5 → CVAN-A-1-A-1, CVAN-A-28-A-3, CVAN-F-26-A-5
  const match4 = cleaned.match(/^([A-L])(\d+)([A-L])(\d+)$/);
  if (match4) {
    const [, l1, n1, l2, n2] = match4;
    const num1 = parseInt(n1, 10);
    const num2 = parseInt(n2, 10);
    if (num1 >= 1 && num2 >= 1) {
      return `CVAN-${l1}-${num1}-${l2}-${num2}`;
    }
  }

  return null;
}

export function parseVoiceInput(transcript: string): string | null {
  const cleaned = transcript.trim().toUpperCase().replace(/\s+/g, ' ');

  // First try parsing as direct input (handles "A1", "F26A5", "8900351614516" etc.)
  const directParse = parseInput(cleaned.replace(/\s+/g, ''));
  if (directParse) return directParse;

  const words = cleaned.split(' ');
  const numberWords: Record<string, string> = {
    ZERO: '0',
    ONE: '1', TWO: '2', THREE: '3', FOUR: '4', FIVE: '5',
    SIX: '6', SEVEN: '7', EIGHT: '8', NINE: '9',
  };

  const parts: string[] = [];
  for (const w of words) {
    const combo = w.match(/^([A-L])(\d+)$/);
    if (combo) {
      parts.push(combo[1], combo[2]);
    } else if (numberWords[w] !== undefined) {
      parts.push(numberWords[w]);
    } else if (/^[A-L]$/.test(w)) {
      parts.push(w);
    } else if (/^\d+$/.test(w)) {
      parts.push(w);
    }
  }

  if (parts.length === 1 && /^\d+$/.test(parts[0])) {
    return parts[0];
  }

  if (parts.length === 2) {
    const [l1, n1] = parts;
    const num1 = parseInt(n1, 10);
    if (/^[A-L]$/.test(l1) && /^\d+$/.test(n1) && num1 >= 1) {
      return `CVAN-${l1}-${num1}`;
    }
  }

  if (parts.length === 4) {
    const [l1, n1, l2, n2] = parts;
    const num1 = parseInt(n1, 10);
    const num2 = parseInt(n2, 10);
    if (/^[A-L]$/.test(l1) && /^[A-L]$/.test(l2) && /^\d+$/.test(n1) && /^\d+$/.test(n2) && num1 >= 1 && num2 >= 1) {
      return `CVAN-${l1}-${num1}-${l2}-${num2}`;
    }
  }

  return null;
}

export function getFirstLetter(code: string): string {
  if (/^\d+$/.test(code)) {
    return '123';
  }

  const parts = code.split('-');
  return parts[1] || '';
}
