import { caesarDecrypt, maxShift } from './caesar'
import { atbash } from './atbash'
import { scoreCandidate } from './scoring'
import { indexOfCoincidence } from './coincidence'

export type Method = 'cesar' | 'atbash'

export interface Candidate {
  method: Method
  k: number | null
  text: string
  chiSquare: number
  coverage: number
}

export type Confidence = 'alta' | 'media' | 'baja'

export interface DetectionResult {
  winner: Candidate
  // ordenados de mejor a peor (menor chi-cuadrado primero)
  candidates: Candidate[]
  ic: number
  confidence: Confidence
}

// Por debajo de esto, el alfabeto no tiene suficiente relacion con el
// español como para confiar en el chi-cuadrado (ver EncryptLab - Robustez y
// Casos Limite).
const MIN_COVERAGE = 0.5
// Por debajo de esto, la frecuencia y el IC son estadisticamente ruidosos
// aunque el candidato ganador sea correcto.
const SHORT_TEXT_THRESHOLD = 20

export function detectarMetodo(ciphertext: string, alphabet: string[]): DetectionResult {
  const candidates: Candidate[] = []

  for (let k = 1; k <= maxShift(alphabet); k++) {
    const text = caesarDecrypt(ciphertext, alphabet, k)
    const { chiSquare, coverage } = scoreCandidate(text, alphabet)
    candidates.push({ method: 'cesar', k, text, chiSquare, coverage })
  }

  const atbashText = atbash(ciphertext, alphabet)
  const atbashScore = scoreCandidate(atbashText, alphabet)
  candidates.push({
    method: 'atbash',
    k: null,
    text: atbashText,
    chiSquare: atbashScore.chiSquare,
    coverage: atbashScore.coverage,
  })

  candidates.sort((a, b) => a.chiSquare - b.chiSquare)
  const winner = candidates[0]

  const ic = indexOfCoincidence(ciphertext, alphabet)
  const analyzedLength = [...ciphertext].filter((char) => alphabet.includes(char)).length

  let confidence: Confidence
  if (winner.coverage < MIN_COVERAGE) {
    confidence = 'baja'
  } else if (analyzedLength < SHORT_TEXT_THRESHOLD) {
    confidence = 'media'
  } else {
    confidence = 'alta'
  }

  return { winner, candidates, ic, confidence }
}
