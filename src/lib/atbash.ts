import { aGrafemas } from './alfabeto'

// Atbash es una involucion: aplicar la funcion una vez cifra, aplicarla de
// nuevo sobre el resultado descifra. No hay clave ni modulo que elegir.
export function atbash(texto: string, alfabeto: string[]): string {
  const n = alfabeto.length
  if (n === 0) return texto
  return aGrafemas(texto)
    .map((caracter) => {
      const i = alfabeto.indexOf(caracter)
      if (i === -1) return caracter
      return alfabeto[n - 1 - i]
    })
    .join('')
}
