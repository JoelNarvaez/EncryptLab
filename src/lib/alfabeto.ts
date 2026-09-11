// ASCII imprimible completo: del espacio (32) a la virgulilla (126), 95
// simbolos. Cubre mayusculas, minusculas, digitos, espacio y puntuacion —
// los caracteres de control (0-31, 127) quedan fuera porque no se pueden
// escribir ni ver en un textarea.
export const ALFABETO_POR_DEFECTO = Array.from({ length: 126 - 32 + 1 }, (_, i) =>
  String.fromCharCode(32 + i),
).join('')

// Preset "Español": mayusculas, minusculas, Ñ/ñ, vocales acentuadas y
// espacio (65 simbolos). Ninguno de estos caracteres esta en el ASCII
// estandar (0-127) — por eso no forman parte de ALFABETO_POR_DEFECTO y hay
// que elegirlos aparte si se quiere cifrar texto en español "completo".
export const ALFABETO_ESPANOL =
  ' ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑabcdefghijklmnopqrstuvwxyzáéíóúñ'

const segmentadorGrafemas = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

// Se segmenta por grafema (no por code point) porque un solo simbolo visible
// puede ocupar varios code points — un emoji con variation selector (❤️ =
// U+2764 + U+FE0F) o con modificador de tono de piel (🧑🏽 = persona +
// modificador) son el caso tipico. Con `for...of` (code point a code point)
// esos code points entrarian como caracteres distintos aunque se vean como
// uno solo. Se usa en todo lugar que corte texto en "caracteres" — el
// alfabeto y el texto a cifrar/descifrar/analizar — para que ambos lados
// corten igual y un simbolo multi-code-point se pueda encontrar de vuelta.
export function aGrafemas(texto: string): string[] {
  return [...segmentadorGrafemas.segment(texto)].map((s) => s.segment)
}

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
