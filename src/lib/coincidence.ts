// Una sustitucion monoalfabetica (Cesar o Atbash) solo reetiqueta simbolos:
// nunca cambia cuantas veces se repite cada uno. Por eso el IC del texto
// cifrado es identico al de cualquier candidato de descifrado, sin importar
// el k — no sirve para elegir el ganador entre candidatos. Sirve como señal
// de confianza aparte: comparar el IC del cifrado contra el IC caracteristico
// del español confirma (o no) el supuesto de que hay una sustitucion
// monoalfabetica de texto en español detras, sobre todo cuando el texto es
// corto y el chi-cuadrado por si solo es ruidoso.
export function indexOfCoincidence(text: string, alphabet: string[]): number {
  const counts = new Map<string, number>()
  let n = 0

  for (const char of text) {
    if (!alphabet.includes(char)) continue
    n++
    counts.set(char, (counts.get(char) ?? 0) + 1)
  }

  if (n < 2) return 0

  let sum = 0
  for (const count of counts.values()) {
    sum += count * (count - 1)
  }
  return sum / (n * (n - 1))
}

// IC caracteristico de texto largo en español, para comparar contra el IC
// medido del cifrado.
export const SPANISH_IC = 0.075
