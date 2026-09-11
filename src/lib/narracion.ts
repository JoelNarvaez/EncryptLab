import type { ResultadoDeteccion } from './deteccion'

export interface ExplicacionDeteccion {
  // "César · módulo 62" / "Atbash" / "No se pudo determinar"
  titular: string
  // 0-100, o null si no se pudo determinar.
  porcConfianza: number | null
  // El chi-cuadrado de Al-Kindi del candidato ganador, o null si no se pudo
  // determinar. Se muestra junto al encabezado, sin mas detalle (margen/IC
  // quedan fuera de la UI — son respaldo para el reporte, no para el usuario).
  chiCuadrado: number | null
  // Una frase muy corta: nada mas el metodo de refuerzo usado (diccionario,
  // bigramas o solo frecuencia de letras), mas una nota de confianza si
  // aplica.
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
