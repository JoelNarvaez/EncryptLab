export function caesarEncrypt(text: string, alphabet: string[], k: number): string {
  const n = alphabet.length
  if (n === 0) return text
  return [...text]
    .map((char) => {
      const i = alphabet.indexOf(char)
      if (i === -1) return char
      return alphabet[(i + k + n) % n]
    })
    .join('')
}

export function caesarDecrypt(text: string, alphabet: string[], k: number): string {
  return caesarEncrypt(text, alphabet, -k)
}

// Rango valido de k: 1..maxShift(alphabet). k=0 no cifra nada, asi que se excluye.
export function maxShift(alphabet: string[]): number {
  return Math.max(1, alphabet.length - 1)
}
