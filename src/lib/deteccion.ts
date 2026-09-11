import { descifrarCesar, desplazamientoMaximo } from './cesar'
import { atbash } from './atbash'
import { chiCuadradoAlKindi } from './puntuacion'
import { indiceDeCoincidencia } from './coincidencia'
import { contarCoincidenciasDiccionario } from './diccionario'
import { estadisticasBigrama, RATIO_COBERTURA_MINIMA_BIGRAMA } from './bigramas'
import { aGrafemas } from './alfabeto'

export type Metodo = 'cesar' | 'atbash'

export interface Candidato {
  metodo: Metodo
  k: number | null
  texto: string
  chiCuadrado: number
  cobertura: number
  // cuantas palabras de `texto` son palabras reales del español (diccionario.ts)
  coincidenciasDiccionario: number
  // -log(probabilidad) promedio de los bigramas de `texto` contra datos
  // reales de un corpus (bigramas.ts) - menor es mas parecido al español.
  // null si no hubo suficientes bigramas (ver cantidadBigramas) para confiar
  // en el promedio frente a los demas candidatos del mismo cifrado.
  puntuacionBigrama: number | null
  // cuantos pares de letras consecutivos se contaron para puntuacionBigrama
  cantidadBigramas: number
  // fraccion de letras en minuscula - desempate final para el empate
  // may/min que produce un alfabeto con mayusculas y minusculas en bloques
  // simetricos (ver EncryptLab - Bitacora de Decisiones)
  fraccionMinusculas: number
}

export type Confianza = 'alta' | 'media' | 'baja'

export interface ResultadoDeteccion {
  ganador: Candidato
  // ordenados de mejor a peor
  candidatos: Candidato[]
  ic: number
  confianza: Confianza
  // Mismo veredicto que `confianza`, pero como numero continuo (0-100) en
  // vez de tres cajones — para mostrarle un porcentaje al usuario en vez de
  // la palabra alta/media/baja. Ver puntuacionConfianza() mas abajo para el
  // porque de cada peso.
  porcConfianza: number
  // false cuando ningun candidato tuvo ni una letra reconocible en español
  // (cobertura 0 en todos) - en ese caso el "ganador" es arbitrario y no hay
  // que presentarlo como una deteccion real.
  determinado: boolean
}

// Por debajo de esto, el alfabeto no tiene suficiente relacion con el
// español como para confiar en el chi-cuadrado (ver EncryptLab - Robustez y
// Casos Limite).
const COBERTURA_MINIMA = 0.5
// Por debajo de esto, la frecuencia y el IC son estadisticamente ruidosos
// aunque el candidato ganador sea correcto. Exportado para que la UI pueda
// avisar "esto puede fallar" con el mismo numero real, no uno inventado.
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

// Refuerzos sobre el chi-cuadrado de Al-Kindi (chiCuadradoAlKindi en
// puntuacion.ts). El chi-cuadrado por si solo es el metodo pedido por la
// rubrica, pero no es confiable en textos cortos (ver EncryptLab -
// Robustez y Casos Limite) — estas capas existen unicamente para resolver
// esos casos, en este orden de prioridad (ver EncryptLab - Bitacora de
// Decisiones para el porque de cada una):
//   1. coincidenciasDiccionario — una palabra real del español reconocida
//      vale mas que cualquier estadistica.
//   2. puntuacionBigrama — la misma idea de Al-Kindi pero con pares de
//      letras en vez de letras sueltas: mas señal por caracter en un texto
//      corto.
//   3. chiCuadrado — el metodo de Al-Kindi. Con texto suficientemente
//      largo, ya decide solo antes de llegar aqui (coincidenciasDiccionario
//      y puntuacionBigrama rara vez difieren entre candidatos con texto
//      largo).
//   4. fraccionMinusculas — ultimo desempate, solo para cuando dos
//      candidatos empatan en todo lo demas salvo mayusculas/minusculas.
// Convierte las mismas tres señales que deciden alta/media/baja en un
// numero de 0 a 100, en vez de tres cajones fijos. Cada señal aporta un
// puntaje maximo (que suma 100 entre las tres) proporcional a que tan
// completa esta esa señal:
//   - cobertura contra el español: hasta 50 pts (es el filtro mas fuerte —
//     por debajo de COBERTURA_MINIMA ya se considera "baja" en el sistema
//     categorico, asi que aqui pesa la mitad del puntaje)
//   - longitud del texto analizado: hasta 30 pts (mas texto = chi-cuadrado
//     mas confiable, satura en UMBRAL_TEXTO_CORTO)
//   - coincidencia de diccionario: 20 pts fijos si hubo al menos una
//     palabra real reconocida (la señal mas fuerte para textos cortos)
function puntuacionConfianza(ganador: Candidato, longitudAnalizada: number): number {
  const puntajeCobertura = Math.min(ganador.cobertura / COBERTURA_MINIMA, 1) * 50
  const puntajeLongitud = Math.min(longitudAnalizada / UMBRAL_TEXTO_CORTO, 1) * 30
  const puntajeDiccionario = ganador.coincidenciasDiccionario > 0 ? 20 : 0
  return Math.round(puntajeCobertura + puntajeLongitud + puntajeDiccionario)
}

function ordenarPorRefuerzos(a: Candidato, b: Candidato): number {
  if (a.coincidenciasDiccionario !== b.coincidenciasDiccionario) return b.coincidenciasDiccionario - a.coincidenciasDiccionario
  const bigramaA = a.puntuacionBigrama ?? Infinity
  const bigramaB = b.puntuacionBigrama ?? Infinity
  if (bigramaA !== bigramaB) return bigramaA - bigramaB
  if (a.chiCuadrado !== b.chiCuadrado) return a.chiCuadrado - b.chiCuadrado
  return b.fraccionMinusculas - a.fraccionMinusculas
}

export function detectarMetodo(textoCifrado: string, alfabeto: string[]): ResultadoDeteccion {
  const crudos: CandidatoCrudo[] = []

  for (let k = 1; k <= desplazamientoMaximo(alfabeto); k++) {
    crudos.push(construirCandidatoCrudo('cesar', k, descifrarCesar(textoCifrado, alfabeto, k), alfabeto))
  }
  crudos.push(construirCandidatoCrudo('atbash', null, atbash(textoCifrado, alfabeto), alfabeto))

  // Un candidato con simbolos/digitos mezclados (alfabeto ASCII completo) se
  // puede fragmentar en pocos bigramas; promediar sobre pocas muestras es
  // ruidoso y le puede ganar por suerte a una palabra real mas larga con un
  // promedio apenas mas alto. Se descarta (se trata como sin señal) el
  // puntuacionBigrama de cualquier candidato bastante peor cubierto que el
  // mejor cubierto del mismo cifrado - ver EncryptLab - Bitacora de
  // Decisiones.
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
