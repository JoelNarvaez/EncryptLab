import { FRECUENCIAS_ESPANOL } from './frecuencias'
import { aGrafemas } from './alfabeto'

// [12]
function claveReferencia(caracter: string): string {
  return caracter.toUpperCase()
}

// [13]
const PORC_MINIMO_ESPERADO = 3

export interface ResultadoPuntuacion {
  chiCuadrado: number
  // [14]
  cobertura: number
}

// [15]
export function chiCuadradoAlKindi(texto: string, alfabeto: string[]): ResultadoPuntuacion {
  const conteos = new Map<string, number>()
  let total = 0
  let cubiertas = 0

  for (const caracter of aGrafemas(texto)) {
    if (!alfabeto.includes(caracter)) continue
    total++
    const clave = claveReferencia(caracter)
    if (clave in FRECUENCIAS_ESPANOL) {
      cubiertas++
      conteos.set(clave, (conteos.get(clave) ?? 0) + 1)
    }
  }

  if (cubiertas === 0) {
    return { chiCuadrado: Infinity, cobertura: 0 }
  }

  let chiCuadrado = 0
  for (const [letra, porcEsperadoCrudo] of Object.entries(FRECUENCIAS_ESPANOL)) {
    const porcEsperado = Math.max(porcEsperadoCrudo, PORC_MINIMO_ESPERADO)
    const porcObservado = ((conteos.get(letra) ?? 0) / cubiertas) * 100
    chiCuadrado += (porcObservado - porcEsperado) ** 2 / porcEsperado
  }

  return { chiCuadrado, cobertura: cubiertas / total }
}
