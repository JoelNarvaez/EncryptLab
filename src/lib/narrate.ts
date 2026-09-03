import type { DetectionResult } from './detect'
import { SPANISH_IC } from './coincidence'

export function explainDetection(result: DetectionResult): string {
  const { winner, candidates, ic, confidence } = result
  const runnerUp = candidates[1]

  const methodLabel = winner.method === 'cesar' ? `César con módulo ${winner.k}` : 'Atbash'
  const margin = runnerUp ? runnerUp.chiSquare - winner.chiSquare : 0

  const icDiff = Math.abs(ic - SPANISH_IC)
  const icPhrase =
    icDiff < 0.015
      ? `el índice de coincidencia (${ic.toFixed(3)}) es muy cercano al característico del español (${SPANISH_IC})`
      : `el índice de coincidencia (${ic.toFixed(3)}) se aleja un poco del característico del español (${SPANISH_IC}), algo esperable en un texto corto`

  const confidencePhrase = {
    alta: 'la confianza en este resultado es alta.',
    media: 'la confianza es media — el texto es corto y la estadística tiene más ruido.',
    baja: 'la confianza es baja — este alfabeto no tiene suficiente relación con el español como para decidir con seguridad.',
  }[confidence]

  const marginPhrase =
    runnerUp && Number.isFinite(margin)
      ? `, ${margin.toFixed(1)} puntos por debajo del siguiente mejor candidato`
      : ''

  return `Comparando la frecuencia de letras del texto cifrado contra la tabla de referencia del español, el candidato que mejor encaja es ${methodLabel} (χ²=${winner.chiSquare.toFixed(1)}${marginPhrase}). Además, ${icPhrase}. En conjunto, ${confidencePhrase}`
}
