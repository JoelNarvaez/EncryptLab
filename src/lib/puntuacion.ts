import { FRECUENCIAS_ESPANOL } from './frecuencias'
import { aGrafemas } from './alfabeto'

// Las vocales acentuadas NO se fusionan con su vocal base. Se probo (ver
// EncryptLab - Robustez y Casos Limite) y abre un hueco: un candidato basura
// cargado de acentos se "disfraza" de texto normal porque hereda la
// frecuencia completa de la vocal base, mucho mas alta de lo real. Una
// acentuada sin cobertura propia cae en el mismo bucket que un digito o
// simbolo ajeno - resta cobertura, no corrompe el chi-cuadrado.
function claveReferencia(caracter: string): string {
  return caracter.toUpperCase()
}

// Piso minimo para la frecuencia esperada usada como denominador. Sin esto,
// una letra rarisima en español (la H, ~0.7%) que aparece una sola vez por
// pura casualidad en un texto corto ("hola") dispara el chi-cuadrado a un
// numero enorme -(observado-esperado)²/esperado explota cuando esperado es
// casi cero- y el candidato correcto pierde contra basura que por suerte
// evito cualquier letra rara. Se probo contra los 19 casos de
// deteccion.test.ts mas "hola" (cifrado con distintos k, alfabeto ASCII
// completo): piso=3 es el minimo que arregla "hola" sin romper ningun caso
// existente (piso>=5 ya empieza a fallar el test de acentos).
const PORC_MINIMO_ESPERADO = 3

export interface ResultadoPuntuacion {
  chiCuadrado: number
  // Fraccion (0..1) de los caracteres del candidato, dentro del alfabeto,
  // que tienen frecuencia de referencia conocida en español.
  cobertura: number
}

// El nucleo del criptoanalisis: el analisis de frecuencia de letras que
// Al-Kindi describio en el siglo IX para romper cifrados de sustitucion
// simple. Compara que tan seguido aparece cada letra en `texto` contra las
// frecuencias esperadas del español (FRECUENCIAS_ESPANOL) — mientras mas se
// parezca la distribucion, mas bajo el chi-cuadrado, mas probable que
// `texto` sea español real y no ruido. Todo lo demas en deteccion.ts
// (diccionario, bigramas, desempate) son refuerzos que se aplican DESPUES de
// esto, para los casos donde el texto es demasiado corto para que la
// estadistica de letras sueltas alcance por si sola.
export function chiCuadradoAlKindi(texto: string, alfabeto: string[]): ResultadoPuntuacion {
  const conteos = new Map<string, number>()
  let total = 0
  let cubiertas = 0

  for (const caracter of aGrafemas(texto)) {
    if (!alfabeto.includes(caracter)) continue
    total++
    const clave = claveReferencia(caracter)
    if (clave in FRECUENCIAS_ESPANOL) {
      cubiertas++
      conteos.set(clave, (conteos.get(clave) ?? 0) + 1)
    }
  }

  if (cubiertas === 0) {
    return { chiCuadrado: Infinity, cobertura: 0 }
  }

  let chiCuadrado = 0
  for (const [letra, porcEsperadoCrudo] of Object.entries(FRECUENCIAS_ESPANOL)) {
    const porcEsperado = Math.max(porcEsperadoCrudo, PORC_MINIMO_ESPERADO)
    const porcObservado = ((conteos.get(letra) ?? 0) / cubiertas) * 100
    chiCuadrado += (porcObservado - porcEsperado) ** 2 / porcEsperado
  }

  return { chiCuadrado, cobertura: cubiertas / total }
}
