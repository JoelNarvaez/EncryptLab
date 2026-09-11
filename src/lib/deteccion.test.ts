import { describe, expect, it } from 'vitest'
import { normalizarAlfabeto } from './alfabeto'
import { cifrarCesar } from './cesar'
import { atbash } from './atbash'
import { detectarMetodo } from './deteccion'

// Alfabeto dedicado para estos tests: el conjunto de letras españolas
// (mayúsculas + acentos), independiente de ALFABETO_POR_DEFECTO.
// ALFABETO_POR_DEFECTO ahora es el ASCII imprimible completo (95 símbolos)
// pensado para la UI — usarlo aquí infla el número de candidatos de César
// (94 en vez de 31) y vuelve ruidoso el chi-cuadrado en textos cortos, sin
// aportar nada a lo que este archivo prueba (deteccion correcta de
// metodo/modulo y manejo de acentos).
const ALFABETO_ESPANOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ'
const alfabeto = normalizarAlfabeto(ALFABETO_ESPANOL)

const TEXTO_LARGO =
  'LA CRIPTOGRAFIA CLASICA FUE SUPERADA CUANDO AL KINDI DESCUBRIO QUE EL ' +
  'ANALISIS DE FRECUENCIA PERMITIA ROMPER CUALQUIER SUSTITUCION MONOALFABETICA ' +
  'SIN IMPORTAR QUE TAN COMPLEJA PARECIERA A SIMPLE VISTA'

const TEXTOS_CORTOS = ['HOLA MUNDO', 'NOS VEMOS MANANA', 'EL GATO DUERME']

describe('detectarMetodo — Cesar en textos largos', () => {
  for (const k of [1, 5, 11, 13, 20, 25]) {
    it(`detecta k=${k} con confianza alta`, () => {
      const cifrado = cifrarCesar(TEXTO_LARGO, alfabeto, k)
      const resultado = detectarMetodo(cifrado, alfabeto)
      expect(resultado.ganador.metodo).toBe('cesar')
      expect(resultado.ganador.k).toBe(k)
      expect(resultado.confianza).toBe('alta')
    })
  }
})

describe('detectarMetodo — Cesar en textos cortos', () => {
  for (const texto of TEXTOS_CORTOS) {
    for (const k of [3, 9, 17]) {
      it(`detecta "${texto}" cifrado con k=${k} (puede ser confianza media)`, () => {
        const cifrado = cifrarCesar(texto, alfabeto, k)
        const resultado = detectarMetodo(cifrado, alfabeto)
        expect(resultado.ganador.metodo).toBe('cesar')
        expect(resultado.ganador.k).toBe(k)
        expect(['alta', 'media']).toContain(resultado.confianza)
      })
    }
  }
})

describe('detectarMetodo — Atbash', () => {
  it('detecta Atbash en un texto largo', () => {
    const cifrado = atbash(TEXTO_LARGO, alfabeto)
    const resultado = detectarMetodo(cifrado, alfabeto)
    expect(resultado.ganador.metodo).toBe('atbash')
    expect(resultado.confianza).toBe('alta')
  })

  it('detecta Atbash en un texto corto', () => {
    const cifrado = atbash('EL GATO DUERME', alfabeto)
    const resultado = detectarMetodo(cifrado, alfabeto)
    expect(resultado.ganador.metodo).toBe('atbash')
  })
})

describe('detectarMetodo — acentos', () => {
  it('detecta correctamente un texto con vocales acentuadas y Ñ', () => {
    const texto = 'MÁS ROMPIÓ CAFÉ JOSÉ MURIÓ ANÁLISIS RÁPIDO MAÑANA PEQUEÑO'
    const cifrado = cifrarCesar(texto, alfabeto, 9)
    const resultado = detectarMetodo(cifrado, alfabeto)
    expect(resultado.ganador.metodo).toBe('cesar')
    expect(resultado.ganador.k).toBe(9)
  })
})

describe('detectarMetodo — alfabeto sin relacion con el español', () => {
  it('devuelve confianza baja en vez de una respuesta falsa', () => {
    const griego = normalizarAlfabeto('ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ')
    const textoGriego = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΑΒΓΔΕ'
    const cifrado = cifrarCesar(textoGriego, griego, 5)
    const resultado = detectarMetodo(cifrado, griego)
    expect(resultado.confianza).toBe('baja')
    expect(resultado.ganador.cobertura).toBe(0)
  })
})
