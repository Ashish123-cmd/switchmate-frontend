const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%^&*()-_=+';
const ALL = `${UPPER}${LOWER}${DIGITS}${SYMBOLS}`;

function pick(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

function shuffle(chars: string[]): string[] {
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
}

export function generatePassword(length = 16): string {
  const size = Math.max(length, 8);
  const required = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SYMBOLS)];
  const rest = Array.from({ length: size - required.length }, () => pick(ALL));
  return shuffle([...required, ...rest]).join('');
}
