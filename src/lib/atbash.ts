// Atbash es una involucion: aplicar la funcion una vez cifra, aplicarla de
// nuevo sobre el resultado descifra. No hay clave ni modulo que elegir.
export function atbash(text: string, alphabet: string[]): string {
  const n = alphabet.length
  if (n === 0) return text
  return [...text]
    .map((char) => {
      const i = alphabet.indexOf(char)
      if (i === -1) return char
      return alphabet[n - 1 - i]
    })
    .join('')
}
