import { aGrafemas } from './alfabeto'

// Una sustitucion monoalfabetica (Cesar o Atbash) solo reetiqueta simbolos:
// nunca cambia cuantas veces se repite cada uno. Por eso el IC del texto
// cifrado es identico al de cualquier candidato de descifrado, sin importar
// el k — no sirve para elegir el ganador entre candidatos. Sirve como señal
// de confianza aparte: comparar el IC del cifrado contra el IC caracteristico
// del español confirma (o no) el supuesto de que hay una sustitucion
// monoalfabetica de texto en español detras, sobre todo cuando el texto es
// corto y el chi-cuadrado por si solo es ruidoso.
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

// IC caracteristico de texto largo en español, para comparar contra el IC
// medido del cifrado.
export const IC_ESPANOL = 0.075
