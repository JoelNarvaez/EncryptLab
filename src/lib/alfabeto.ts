// [1]
export const ALFABETO_POR_DEFECTO = Array.from({ length: 126 - 32 + 1 }, (_, i) =>
  String.fromCharCode(32 + i),
).join('')

// [2]
export const ALFABETO_ESPANOL =
  ' ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑabcdefghijklmnopqrstuvwxyzáéíóúñ'

const segmentadorGrafemas = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

// [4]
export function aGrafemas(texto: string): string[] {
  return [...segmentadorGrafemas.segment(texto)].map((s) => s.segment)
}

// [3]
export function normalizarAlfabeto(crudo: string): string[] {
  const vistos = new Set<string>()
  const caracteres: string[] = []
  for (const caracter of aGrafemas(crudo)) {
    if (!vistos.has(caracter)) {
      vistos.add(caracter)
      caracteres.push(caracter)
    }
  }
  return caracteres
}

export function esAlfabetoValido(alfabeto: string[]): boolean {
  return alfabeto.length >= 2
}
