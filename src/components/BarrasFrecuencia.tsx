import { FRECUENCIAS_ESPANOL } from '../lib/frecuencias'

interface PropsBarrasFrecuencia {
  observadas: Record<string, number>
}

export function BarrasFrecuencia({ observadas }: PropsBarrasFrecuencia) {
  const filas = Object.keys(observadas)
    .map((letra) => {
      const observado = observadas[letra]
      const esperado = FRECUENCIAS_ESPANOL[letra] ?? 0
      return { letra, desviacion: observado - esperado }
    })
    .sort((a, b) => Math.abs(b.desviacion) - Math.abs(a.desviacion))

  const desviacionMaxima = Math.max(...filas.map((f) => Math.abs(f.desviacion)), 1)

  return (
    <div>
      <div className="el-filas-frecuencia">
        {filas.map((fila) => {
          const porcAncho = Math.min((Math.abs(fila.desviacion) / desviacionMaxima) * 100, 100)
          const esPositivo = fila.desviacion >= 0
          return (
            <div className="el-fila-frecuencia" key={fila.letra}>
              <span className="el-fila-frecuencia__letra">{fila.letra === ' ' ? '␣' : fila.letra}</span>
              <div className="el-fila-frecuencia__pista">
                <div className="el-fila-frecuencia__mitad el-fila-frecuencia__mitad--neg">
                  {!esPositivo && (
                    <div className="el-fila-frecuencia__barra el-fila-frecuencia__barra--neg" style={{ width: `${porcAncho}%` }} />
                  )}
                </div>
                <div className="el-fila-frecuencia__mitad el-fila-frecuencia__mitad--pos">
                  {esPositivo && (
                    <div className="el-fila-frecuencia__barra el-fila-frecuencia__barra--pos" style={{ width: `${porcAncho}%` }} />
                  )}
                </div>
              </div>
              <span className={`el-fila-frecuencia__valor ${esPositivo ? 'es-positivo' : 'es-negativo'}`}>
                {esPositivo ? '+' : ''}
                {fila.desviacion.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="el-leyenda-grafico">
        <span>
          <i className="el-punto-leyenda el-punto-leyenda--pos" /> más frecuente de lo esperado
        </span>
        <span>
          <i className="el-punto-leyenda el-punto-leyenda--neg" /> menos frecuente
        </span>
      </div>
    </div>
  )
}
