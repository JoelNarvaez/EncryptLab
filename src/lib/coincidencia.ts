import { aGrafemas } from './alfabeto'

// [9]
export function indiceDeCoincidencia(texto: string, alfabeto: string[]): number {
  const conteos = new Map<string, number>()
  let n = 0

  for (const caracter of aGrafemas(texto)) {
    if (!alfabeto.includes(caracter)) continue
    n++
    conteos.set(caracter, (conteos.get(caracter) ?? 0) + 1)
  }

  if (n < 2) return 0

  let suma = 0
  for (const conteo of conteos.values()) {
    suma += conteo * (conteo - 1)
  }
  return suma / (n * (n - 1))
}

// [10]
export const IC_ESPANOL = 0.075
