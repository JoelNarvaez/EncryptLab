import { describe, expect, it } from 'vitest'
import { normalizeAlphabet, DEFAULT_ALPHABET } from './alphabet'
import { caesarEncrypt } from './caesar'
import { atbash } from './atbash'
import { detectarMetodo } from './detect'

const alphabet = normalizeAlphabet(DEFAULT_ALPHABET + 'ÁÉÍÓÚÑ')

const LONG_TEXT =
  'LA CRIPTOGRAFIA CLASICA FUE SUPERADA CUANDO AL KINDI DESCUBRIO QUE EL ' +
  'ANALISIS DE FRECUENCIA PERMITIA ROMPER CUALQUIER SUSTITUCION MONOALFABETICA ' +
  'SIN IMPORTAR QUE TAN COMPLEJA PARECIERA A SIMPLE VISTA'

const SHORT_TEXTS = ['HOLA MUNDO', 'NOS VEMOS MANANA', 'EL GATO DUERME']

describe('detectarMetodo — Cesar en textos largos', () => {
  for (const k of [1, 5, 11, 13, 20, 25]) {
    it(`detecta k=${k} con confianza alta`, () => {
      const cipher = caesarEncrypt(LONG_TEXT, alphabet, k)
      const result = detectarMetodo(cipher, alphabet)
      expect(result.winner.method).toBe('cesar')
      expect(result.winner.k).toBe(k)
      expect(result.confidence).toBe('alta')
    })
  }
})

describe('detectarMetodo — Cesar en textos cortos', () => {
  for (const text of SHORT_TEXTS) {
    for (const k of [3, 9, 17]) {
      it(`detecta "${text}" cifrado con k=${k} (puede ser confianza media)`, () => {
        const cipher = caesarEncrypt(text, alphabet, k)
        const result = detectarMetodo(cipher, alphabet)
        expect(result.winner.method).toBe('cesar')
        expect(result.winner.k).toBe(k)
        expect(['alta', 'media']).toContain(result.confidence)
      })
    }
  }
})

describe('detectarMetodo — Atbash', () => {
  it('detecta Atbash en un texto largo', () => {
    const cipher = atbash(LONG_TEXT, alphabet)
    const result = detectarMetodo(cipher, alphabet)
    expect(result.winner.method).toBe('atbash')
    expect(result.confidence).toBe('alta')
  })

  it('detecta Atbash en un texto corto', () => {
    const cipher = atbash('EL GATO DUERME', alphabet)
    const result = detectarMetodo(cipher, alphabet)
    expect(result.winner.method).toBe('atbash')
  })
})

describe('detectarMetodo — acentos', () => {
  it('detecta correctamente un texto con vocales acentuadas y Ñ', () => {
    const text = 'MÁS ROMPIÓ CAFÉ JOSÉ MURIÓ ANÁLISIS RÁPIDO MAÑANA PEQUEÑO'
    const cipher = caesarEncrypt(text, alphabet, 9)
    const result = detectarMetodo(cipher, alphabet)
    expect(result.winner.method).toBe('cesar')
    expect(result.winner.k).toBe(9)
  })
})

describe('detectarMetodo — alfabeto sin relacion con el español', () => {
  it('devuelve confianza baja en vez de una respuesta falsa', () => {
    const greek = normalizeAlphabet('ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ')
    const greekText = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΑΒΓΔΕ'
    const cipher = caesarEncrypt(greekText, greek, 5)
    const result = detectarMetodo(cipher, greek)
    expect(result.confidence).toBe('baja')
    expect(result.winner.coverage).toBe(0)
  })
})
