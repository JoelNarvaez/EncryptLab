// [11]
const FRECUENCIAS_SOLO_LETRAS: Record<string, number> = {
  A: 12.53, B: 1.42, C: 4.68, D: 5.86, E: 13.68, F: 0.69, G: 1.01,
  H: 0.7, I: 6.25, J: 0.44, K: 0.02, L: 4.97, M: 3.15, N: 6.71,
  O: 8.68, P: 2.51, Q: 0.88, R: 6.87, S: 7.98, T: 4.63, U: 3.93,
  V: 0.9, W: 0.02, X: 0.22, Y: 0.9, Z: 0.52, 'Ñ': 0.31,
}

const PORC_ESPACIO = 16
const PORC_LETRAS = 100 - PORC_ESPACIO
const SUMA_LETRAS = Object.values(FRECUENCIAS_SOLO_LETRAS).reduce((a, b) => a + b, 0)

export const FRECUENCIAS_ESPANOL: Record<string, number> = {
  ...Object.fromEntries(
    Object.entries(FRECUENCIAS_SOLO_LETRAS).map(([letra, pct]) => [letra, (pct / SUMA_LETRAS) * PORC_LETRAS]),
  ),
  ' ': PORC_ESPACIO,
}
