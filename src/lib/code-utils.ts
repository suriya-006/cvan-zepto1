export const FIRST_LETTERS = 'ABCDEFGHIJKL'.split('');
export const SECOND_LETTERS = 'ABCDEFGH'.split('');
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function formatCode(l1: string, n1: number, l2: string, n2: number): string {
  return `CVAN-${l1.toUpperCase()}-${n1}-${l2.toUpperCase()}-${n2}`;
}

export function parseManualInput(input: string): string | null {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-L])(\d)([A-H])(\d)$/);
  if (!match) return null;
  const [, l1, n1, l2, n2] = match;
  const num1 = parseInt(n1);
  const num2 = parseInt(n2);
  if (num1 < 1 || num1 > 9 || num2 < 1 || num2 > 9) return null;
  return formatCode(l1, num1, l2, num2);
}

export function parseVoiceInput(transcript: string): string | null {
  const words = transcript.trim().toUpperCase().replace(/\s+/g, ' ').split(' ');
  const numberWords: Record<string, string> = {
    ONE: '1', TWO: '2', THREE: '3', FOUR: '4', FIVE: '5',
    SIX: '6', SEVEN: '7', EIGHT: '8', NINE: '9',
  };

  const parts: string[] = [];
  for (const w of words) {
    if (numberWords[w]) parts.push(numberWords[w]);
    else if (/^[A-L]$/.test(w)) parts.push(w);
    else if (/^\d$/.test(w)) parts.push(w);
  }

  if (parts.length !== 4) return null;
  const [l1, n1, l2, n2] = parts;
  if (!/^[A-L]$/.test(l1) || !/^[A-H]$/.test(l2)) return null;
  if (!/^[1-9]$/.test(n1) || !/^[1-9]$/.test(n2)) return null;
  return formatCode(l1, parseInt(n1), l2, parseInt(n2));
}
