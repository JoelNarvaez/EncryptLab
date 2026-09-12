import { descifrarCesar, desplazamientoMaximo } from './cesar'
import { atbash } from './atbash'
import { chiCuadradoAlKindi } from './puntuacion'
import { indiceDeCoincidencia } from './coincidencia'
import { contarCoincidenciasDiccionario } from './diccionario'
import { estadisticasBigrama, RATIO_COBERTURA_MINIMA_BIGRAMA } from './bigramas'
import { aGrafemas } from './alfabeto'

export type Metodo = 'cesar' | 'atbash'

// [21]
export interface Candidato {
  metodo: Metodo
  k: number | null
  texto: string
  chiCuadrado: number
  cobertura: number
  coincidenciasDiccionario: number
  puntuacionBigrama: number | null
  cantidadBigramas: number
  fraccionMinusculas: number
}

export type Confianza = 'alta' | 'media' | 'baja'

export interface ResultadoDeteccion {
  ganador: Candidato
  candidatos: Candidato[]
  ic: number
  confianza: Confianza
  porcConfianza: number
  determinado: boolean
}

const COBERTURA_MINIMA = 0.5
export const UMBRAL_TEXTO_CORTO = 10

function fraccionMinusculas(texto: string): number {
  const letras = texto.match(/[a-zA-ZÁÉÍÓÚÑáéíóúñ]/g) ?? []
  if (letras.length === 0) return 0
  const minusculas = letras.filter((c) => c === c.toLowerCase() && c !== c.toUpperCase())
  return minusculas.length / letras.length
}

interface CandidatoCrudo {
  metodo: Metodo
  k: number | null
  texto: string
  chiCuadrado: number
  cobertura: number
  coincidenciasDiccionario: number
  promedioBigrama: number | null
  cantidadBigramas: number
  fraccionMinusculas: number
}

function construirCandidatoCrudo(metodo: Metodo, k: number | null, texto: string, alfabeto: string[]): CandidatoCrudo {
  const { chiCuadrado, cobertura } = chiCuadradoAlKindi(texto, alfabeto)
  const { promedio, cantidad } = estadisticasBigrama(texto)
  return {
    metodo,
    k,
    texto,
    chiCuadrado,
    cobertura,
    coincidenciasDiccionario: contarCoincidenciasDiccionario(texto),
    promedioBigrama: promedio,
    cantidadBigramas: cantidad,
    fraccionMinusculas: fraccionMinusculas(texto),
  }
}

function puntuacionConfianza(ganador: Candidato, longitudAnalizada: number): number {
  const puntajeCobertura = Math.min(ganador.cobertura / COBERTURA_MINIMA, 1) * 50
  const puntajeLongitud = Math.min(longitudAnalizada / UMBRAL_TEXTO_CORTO, 1) * 30
  const puntajeDiccionario = ganador.coincidenciasDiccionario > 0 ? 20 : 0
  return Math.round(puntajeCobertura + puntajeLongitud + puntajeDiccionario)
}

// [22]
function ordenarPorRefuerzos(a: Candidato, b: Candidato): number {
  if (a.coincidenciasDiccionario !== b.coincidenciasDiccionario) return b.coincidenciasDiccionario - a.coincidenciasDiccionario
  const bigramaA = a.puntuacionBigrama ?? Infinity
  const bigramaB = b.puntuacionBigrama ?? Infinity
  if (bigramaA !== bigramaB) return bigramaA - bigramaB
  if (a.chiCuadrado !== b.chiCuadrado) return a.chiCuadrado - b.chiCuadrado
  return b.fraccionMinusculas - a.fraccionMinusculas
}

// [20]
export function detectarMetodo(textoCifrado: string, alfabeto: string[]): ResultadoDeteccion {
  const crudos: CandidatoCrudo[] = []

  for (let k = 1; k <= desplazamientoMaximo(alfabeto); k++) {
    crudos.push(construirCandidatoCrudo('cesar', k, descifrarCesar(textoCifrado, alfabeto, k), alfabeto))
  }
  crudos.push(construirCandidatoCrudo('atbash', null, atbash(textoCifrado, alfabeto), alfabeto))

  // [23]
  const maxCantidadBigramas = Math.max(...crudos.map((c) => c.cantidadBigramas))
  const candidatos: Candidato[] = crudos.map((c) => ({
    metodo: c.metodo,
    k: c.k,
    texto: c.texto,
    chiCuadrado: c.chiCuadrado,
    cobertura: c.cobertura,
    coincidenciasDiccionario: c.coincidenciasDiccionario,
    puntuacionBigrama:
      c.promedioBigrama !== null && c.cantidadBigramas >= RATIO_COBERTURA_MINIMA_BIGRAMA * maxCantidadBigramas
        ? c.promedioBigrama
        : null,
    cantidadBigramas: c.cantidadBigramas,
    fraccionMinusculas: c.fraccionMinusculas,
  }))

  candidatos.sort(ordenarPorRefuerzos)
  const ganador = candidatos[0]

  const ic = indiceDeCoincidencia(textoCifrado, alfabeto)
  const longitudAnalizada = aGrafemas(textoCifrado).filter((caracter) => alfabeto.includes(caracter)).length

  let confianza: Confianza
  if (ganador.cobertura < COBERTURA_MINIMA) {
    confianza = 'baja'
  } else if (ganador.coincidenciasDiccionario > 0) {
    confianza = 'alta'
  } else if (longitudAnalizada < UMBRAL_TEXTO_CORTO) {
    confianza = 'media'
  } else {
    confianza = 'alta'
  }

  const porcConfianza = puntuacionConfianza(ganador, longitudAnalizada)

  return { ganador, candidatos, ic, confianza, porcConfianza, determinado: ganador.cobertura > 0 }
}
