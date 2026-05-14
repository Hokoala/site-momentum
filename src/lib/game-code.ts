/**
 * Short, human-readable game codes for sharing multiplayer sessions over voice/text.
 *
 * Alphabet excludes characters that get confused over voice or in low-quality
 * text rendering: 0/O, 1/I/L. Result: 31 characters, 31^6 ≈ 887 million
 * combinations — far beyond any realistic concurrent-session count.
 */

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 6;

export function generateGameCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

// Normalize user input: uppercase, strip spaces/dashes, drop anything outside
// the alphabet. Lets a player type "abc-def" or paste with extra whitespace
// and still look up the right session.
export function normalizeGameCode(input: string): string {
  return input
    .toUpperCase()
    .split("")
    .filter((c) => ALPHABET.includes(c))
    .join("");
}

export function isValidGameCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  for (const c of code) if (!ALPHABET.includes(c)) return false;
  return true;
}
