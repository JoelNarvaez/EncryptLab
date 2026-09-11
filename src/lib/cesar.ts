import { aGrafemas } from './alfabeto'

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

export function descifrarCesar(texto: string, alfabeto: string[], k: number): string {
  return cifrarCesar(texto, alfabeto, -k)
}

// Rango valido de k: 1..desplazamientoMaximo(alfabeto). k=0 no cifra nada,
// asi que se excluye.
export function desplazamientoMaximo(alfabeto: string[]): number {
  return Math.max(1, alfabeto.length - 1)
}
