import { aGrafemas } from './alfabeto'

// [5]
export function cifrarCesar(texto: string, alfabeto: string[], k: number): string {
  const n = alfabeto.length
  if (n === 0) return texto
  return aGrafemas(texto)
    .map((caracter) => {
      const i = alfabeto.indexOf(caracter)
      if (i === -1) return caracter
      return alfabeto[(i + k + n) % n]
    })
    .join('')
}

// [6]
export function descifrarCesar(texto: string, alfabeto: string[], k: number): string {
  return cifrarCesar(texto, alfabeto, -k)
}

// [7]
export function desplazamientoMaximo(alfabeto: string[]): number {
  return Math.max(1, alfabeto.length - 1)
}
