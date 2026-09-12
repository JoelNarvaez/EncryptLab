import type { ResultadoDeteccion } from './deteccion'

// [24]
export interface ExplicacionDeteccion {
  titular: string
  porcConfianza: number | null
  chiCuadrado: number | null
  razonamiento: string
}

export function explicarDeteccion(resultado: ResultadoDeteccion): ExplicacionDeteccion {
  const { ganador, confianza, porcConfianza, determinado } = resultado

  if (!determinado) {
    return {
      titular: 'No se pudo determinar',
      porcConfianza: null,
      chiCuadrado: null,
      razonamiento:
        'Ninguno de los candidatos tuvo ni una sola letra reconocible contra la tabla de referencia del ' +
        'español, así que no hay ninguna señal estadística para elegir entre ellos. El candidato que se ' +
        'muestra arriba salió primero por casualidad, no porque el sistema lo haya detectado.',
    }
  }

  const titular = ganador.metodo === 'cesar' ? `César · módulo ${ganador.k}` : 'Atbash'

  const razonVeredicto =
    ganador.coincidenciasDiccionario > 0
      ? 'Detectado por palabras reales del texto.'
      : ganador.puntuacionBigrama !== null
        ? 'Detectado por pares de letras (bigramas).'
        : 'Detectado por frecuencia de letras.'

  const notaConfianza = {
    alta: '',
    media: ' Texto corto: puede haber más margen de error.',
    baja: ' El alfabeto se parece poco al español: tomalo con cuidado.',
  }[confianza]

  return { titular, porcConfianza, chiCuadrado: ganador.chiCuadrado, razonamiento: `${razonVeredicto}${notaConfianza}` }
}
