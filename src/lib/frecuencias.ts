// Frecuencia relativa de letras en espanol (%), calculada solo sobre
// caracteres alfabeticos - es la tabla de referencia clasica que usa
// cualquier analisis de frecuencia estilo Al-Kindi.
const FRECUENCIAS_SOLO_LETRAS: Record<string, number> = {
  A: 12.53, B: 1.42, C: 4.68, D: 5.86, E: 13.68, F: 0.69, G: 1.01,
  H: 0.7, I: 6.25, J: 0.44, K: 0.02, L: 4.97, M: 3.15, N: 6.71,
  O: 8.68, P: 2.51, Q: 0.88, R: 6.87, S: 7.98, T: 4.63, U: 3.93,
  V: 0.9, W: 0.02, X: 0.22, Y: 0.9, Z: 0.52, 'Ñ': 0.31,
}

// El espacio es, de lejos, el caracter mas frecuente en un texto real (una
// palabra en español mide ~5-6 caracteres en promedio, asi que hay un
// espacio cada 5-6 caracteres, ~16-18% del total). Si no tiene entrada en la
// tabla, una rotacion incorrecta que por casualidad "elimina" los espacios
// (convirtiendolos en letras) puede terminar con mas cobertura que el texto
// real y ganarle el chi-cuadrado por un margen chico - se confirmo con un
// caso real ("Mañana café con azúcar y limón" con alfabeto español+espacio).
// Las 27 letras se reescalan para dejarle un 16% al espacio y mantener la
// tabla completa sumando ~100.
const PORC_ESPACIO = 16
const PORC_LETRAS = 100 - PORC_ESPACIO
const SUMA_LETRAS = Object.values(FRECUENCIAS_SOLO_LETRAS).reduce((a, b) => a + b, 0)

export const FRECUENCIAS_ESPANOL: Record<string, number> = {
  ...Object.fromEntries(
    Object.entries(FRECUENCIAS_SOLO_LETRAS).map(([letra, pct]) => [letra, (pct / SUMA_LETRAS) * PORC_LETRAS]),
  ),
  ' ': PORC_ESPACIO,
}
