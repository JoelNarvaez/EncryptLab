import { SPANISH_FREQUENCIES } from './frequencies'

// Las vocales acentuadas NO se fusionan con su vocal base. Se probo (ver
// EncryptLab - Robustez y Casos Limite) y abre un hueco: un candidato basura
// cargado de acentos se "disfraza" de texto normal porque hereda la
// frecuencia completa de la vocal base, mucho mas alta de lo real. Una
// acentuada sin cobertura propia cae en el mismo bucket que un digito o
// simbolo ajeno - resta cobertura, no corrompe el chi-cuadrado.
function referenceKey(char: string): string {
  return char.toUpperCase()
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
