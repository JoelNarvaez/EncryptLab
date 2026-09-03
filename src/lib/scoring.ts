import { SPANISH_FREQUENCIES } from './frequencies'

// Vocales acentuadas se comparan como su vocal base: no tenemos (ni
// necesitamos) una frecuencia propia para "e" vs "e" acentuada, es la misma
// letra para efectos estadisticos aunque el cifrado las trate como simbolos
// distintos.
const ACCENT_TO_BASE: Record<string, string> = {
  Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ü: 'U',
  á: 'A', é: 'E', í: 'I', ó: 'O', ú: 'U', ü: 'U',
}

function referenceKey(char: string): string {
  return (ACCENT_TO_BASE[char] ?? char).toUpperCase()
}

export interface ScoreResult {
  chiSquare: number
  // Fraccion (0..1) de los caracteres del candidato, dentro del alfabeto,
  // que tienen frecuencia de referencia conocida en español.
  coverage: number
}

export function scoreCandidate(text: string, alphabet: string[]): ScoreResult {
  const counts = new Map<string, number>()
  let total = 0
  let covered = 0

  for (const char of text) {
    if (!alphabet.includes(char)) continue
    total++
    const key = referenceKey(char)
    if (key in SPANISH_FREQUENCIES) {
      covered++
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  if (covered === 0) {
    return { chiSquare: Infinity, coverage: 0 }
  }

  let chiSquare = 0
  for (const [letter, expectedPct] of Object.entries(SPANISH_FREQUENCIES)) {
    const observedPct = ((counts.get(letter) ?? 0) / covered) * 100
    chiSquare += (observedPct - expectedPct) ** 2 / expectedPct
  }

  return { chiSquare, coverage: covered / total }
}
