const LETTER_SEQUENCE = 'ABCDEFGHIJKL';
const BIN_LABELS = {
  S: 'SCRAPBIN',
  D: 'DAMAGEBIN',
  F: 'FESTIVEBIN',
} as const;
const BIN_NAME_TO_KEY: Record<string, keyof typeof BIN_LABELS> = {
  S: 'S',
  D: 'D',
  F: 'F',
  SCRAPBIN: 'S',
  DAMAGEBIN: 'D',
  FESTIVEBIN: 'F',
};

export const FIRST_LETTERS = LETTER_SEQUENCE.split('');
export const SECOND_LETTERS = LETTER_SEQUENCE.split('');
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function parseStructuredParts(cleaned: string): string[] | null {
  const match2 = cleaned.match(/^([A-L])(\d+)$/);
  if (match2) {
    const [, l1, n1] = match2;
    const num1 = parseInt(n1, 10);
    if (num1 >= 1) return [l1, String(num1)];
  }

  const match4 = cleaned.match(/^([A-L])(\d+)([A-L])(\d+)$/);
  if (match4) {
    const [, l1, n1, l2, n2] = match4;
    const num1 = parseInt(n1, 10);
    const num2 = parseInt(n2, 10);
    if (num1 >= 1 && num2 >= 1) {
      return [l1, String(num1), l2, String(num2)];
    }
  }

  return null;
}

function getBinKey(rawInput: string): keyof typeof BIN_LABELS | null {
  const normalized = rawInput.trim().toUpperCase();
  const compact = normalized.replace(/\s+/g, '');

  const namedMatch = normalized.match(/^(SCRAPBIN|DAMAGEBIN|FESTIVEBIN)(?:[\s-]+|(?=[A-L])|$)/);
  if (namedMatch) {
    return BIN_NAME_TO_KEY[namedMatch[1]] ?? null;
  }

  const shortMatch = compact.match(/^([SDF])(?=[A-L]|$)/);
  if (shortMatch) {
    return BIN_NAME_TO_KEY[shortMatch[1]] ?? null;
  }

  return null;
}

function stripBinPrefix(rawInput: string, binKey: keyof typeof BIN_LABELS): string {
  const normalized = rawInput.trim().toUpperCase();
  const name = BIN_LABELS[binKey];
  const namedPattern = new RegExp(`^${name}(?:[\\s-]+|(?=[A-L])|$)`);

  if (namedPattern.test(normalized)) {
    return normalized.replace(namedPattern, '');
  }

  const shortPattern = new RegExp(`^${binKey}(?:[\\s-]+|(?=[A-L])|$)`);
  return normalized.replace(shortPattern, '');
}

export function formatCode(parts: string[], binKey?: keyof typeof BIN_LABELS): string {
  const prefix = binKey ? BIN_LABELS[binKey] : 'CVAN';
  return `${prefix}-${parts.join('-')}`;
}

export function isPotentialCodeInput(input: string): boolean {
  const raw = input.trim().toUpperCase();
  if (!raw) return false;

  const compact = raw.replace(/\s+/g, '');
  if (/^\d+$/.test(compact)) {
    return true;
  }

  if (/^(SCRAPBIN|DAMAGEBIN|FESTIVEBIN|S|D|F)$/.test(raw.replace(/[-\s]+/g, ''))) {
    return true;
  }

  const binKey = getBinKey(raw);
  const body = binKey
    ? stripBinPrefix(raw, binKey).replace(/[-\s]+/g, '')
    : compact;

  return /^[A-L]?\d*[A-L]?\d*$/.test(body);
}

export function parseInput(input: string): string | null {
  const raw = input.trim().toUpperCase();
  const cleaned = raw.replace(/\s+/g, '');

  if (/^\d+$/.test(cleaned)) {
    return cleaned;
  }

  const binKey = getBinKey(raw);
  const body = binKey
    ? stripBinPrefix(raw, binKey).replace(/[-\s]+/g, '')
    : cleaned;
  const parts = parseStructuredParts(body);

  return parts ? formatCode(parts, binKey ?? undefined) : null;
}

export function parseVoiceInput(transcript: string): string | null {
  const cleaned = transcript.trim().toUpperCase().replace(/\s+/g, ' ');
  const words = cleaned.split(' ');
  const numberWords: Record<string, string> = {
    ZERO: '0',
    ONE: '1', TWO: '2', THREE: '3', FOUR: '4', FIVE: '5',
    SIX: '6', SEVEN: '7', EIGHT: '8', NINE: '9',
  };

  const binWord = words[0];
  const binKey = BIN_NAME_TO_KEY[binWord] ?? null;
  const relevantWords = binKey ? words.slice(1) : words;

  const parts: string[] = [];
  for (const w of relevantWords) {
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

  if (parts.length === 2 || parts.length === 4) {
    const parsed = parseStructuredParts(parts.join(''));
    if (parsed) {
      return formatCode(parsed, binKey ?? undefined);
    }
  }

  return parseInput(cleaned.replace(/\s+/g, ''));
}

export function getFirstLetter(code: string): string {
  if (/^\d+$/.test(code)) {
    return '123';
  }

  const parts = code.split('-');
  return parts[1] || '';
}
