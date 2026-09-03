export const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function normalizeAlphabet(raw: string): string[] {
  const seen = new Set<string>()
  const chars: string[] = []
  for (const char of raw) {
    if (!seen.has(char)) {
      seen.add(char)
      chars.push(char)
    }
  }
  return chars
}

export function isValidAlphabet(alphabet: string[]): boolean {
  return alphabet.length >= 2
}
