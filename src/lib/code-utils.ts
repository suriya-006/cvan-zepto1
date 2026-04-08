export const FIRST_LETTERS = 'ABCDEFGHIJKL'.split('');
export const SECOND_LETTERS = 'ABCDEFGH'.split('');
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function formatCode(parts: string[]): string {
  return `CVAN-${parts.join('-')}`;
}

export function parseInput(input: string): string | null {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');

  // 2-char: A1 → CVAN-A-1
  const match2 = cleaned.match(/^([A-L])(\d)$/);
  if (match2) {
    const [, l1, n1] = match2;
    const num1 = parseInt(n1);
    if (num1 >= 1 && num1 <= 9) return `CVAN-${l1}-${num1}`;
  }

  // 4-char: A1A1 → CVAN-A-1-A-1
  const match4 = cleaned.match(/^([A-L])(\d)([A-H])(\d)$/);
  if (match4) {
    const [, l1, n1, l2, n2] = match4;
    const num1 = parseInt(n1);
    const num2 = parseInt(n2);
    if (num1 >= 1 && num1 <= 9 && num2 >= 1 && num2 <= 9)
      return `CVAN-${l1}-${num1}-${l2}-${num2}`;
  }

  return null;
}

export function parseVoiceInput(transcript: string): string | null {
  const cleaned = transcript.trim().toUpperCase().replace(/\s+/g, ' ');
  
  // First try parsing as direct input (handles "A1", "A1A1" etc.)
  const directParse = parseInput(cleaned.replace(/\s+/g, ''));
  if (directParse) return directParse;

  const words = cleaned.split(' ');
  const numberWords: Record<string, string> = {
    ONE: '1', TWO: '2', THREE: '3', FOUR: '4', FIVE: '5',
    SIX: '6', SEVEN: '7', EIGHT: '8', NINE: '9',
  };

  const parts: string[] = [];
  for (const w of words) {
    // Handle combined like "A1" as a single token
    const combo = w.match(/^([A-L])(\d)$/);
    if (combo) {
      parts.push(combo[1], combo[2]);
    } else if (numberWords[w]) {
      parts.push(numberWords[w]);
    } else if (/^[A-L]$/.test(w)) {
      parts.push(w);
    } else if (/^\d$/.test(w)) {
      parts.push(w);
    }
  }

  if (parts.length === 2) {
    const [l1, n1] = parts;
    if (/^[A-L]$/.test(l1) && /^[1-9]$/.test(n1))
      return `CVAN-${l1}-${n1}`;
  }

  if (parts.length === 4) {
    const [l1, n1, l2, n2] = parts;
    if (/^[A-L]$/.test(l1) && /^[A-H]$/.test(l2) && /^[1-9]$/.test(n1) && /^[1-9]$/.test(n2))
      return `CVAN-${l1}-${parseInt(n1)}-${l2}-${parseInt(n2)}`;
  }

  return null;
}

export function getFirstLetter(code: string): string {
  // CVAN-A-1 or CVAN-A-1-A-1 → A
  const parts = code.split('-');
  return parts[1] || '';
}
