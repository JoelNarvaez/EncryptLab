import { useMemo, useState } from 'react'
import { BarrasFrecuencia } from './BarrasFrecuencia'
import { EditorAlfabeto } from './EditorAlfabeto'
import { esAlfabetoValido, aGrafemas } from '../lib/alfabeto'
import { cifrarCesar } from '../lib/cesar'
import { detectarMetodo, UMBRAL_TEXTO_CORTO, type ResultadoDeteccion } from '../lib/deteccion'
import { explicarDeteccion } from '../lib/narracion'
import { FRECUENCIAS_ESPANOL } from '../lib/frecuencias'
import { useRevelado } from '../hooks/useRevelado'

const TEXTO_PLANO_EJEMPLO = 'LA CRIPTOGRAFIA CLASICA FUE SUPERADA CUANDO AL KINDI DESCUBRIO EL ANALISIS DE FRECUENCIA'

function colorConfianza(porc: number): string {
  if (porc >= 70) return 'var(--accent)'
  if (porc >= 40) return 'var(--amber)'
  return 'var(--pink)'
}

interface PropsVistaDescifrado {
  alfabetoCrudo: string
  setAlfabetoCrudo: (valor: string) => void
  alfabeto: string[]
}

export function VistaDescifrado({ alfabetoCrudo, setAlfabetoCrudo, alfabeto }: PropsVistaDescifrado) {
  const [mostrarAlfabeto, setMostrarAlfabeto] = useState(false)

  const [textoCifrado, setTextoCifrado] = useState(() => cifrarCesar(TEXTO_PLANO_EJEMPLO, alfabeto, 11))
  const [resultado, setResultado] = useState<ResultadoDeteccion | null>(null)
  const [disparador, setDisparador] = useState(0)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)

  const textoRevelado = useRevelado(resultado?.ganador.texto ?? '', disparador)
  const alfabetoValido = esAlfabetoValido(alfabeto)
  const explicacion = useMemo(() => (resultado ? explicarDeteccion(resultado) : null), [resultado])

  const longitudAnalizada = useMemo(
    () => aGrafemas(textoCifrado).filter((caracter) => alfabeto.includes(caracter)).length,
    [textoCifrado, alfabeto],
  )
  const esTextoCorto = longitudAnalizada > 0 && longitudAnalizada < UMBRAL_TEXTO_CORTO

  const otrosCandidatos = useMemo(() => {
    if (!resultado) return []
    return [...resultado.candidatos.slice(1)].sort((a, b) => a.chiCuadrado - b.chiCuadrado).slice(0, 3)
  }, [resultado])

  const porcCercania = useMemo(() => {
    const finitos = otrosCandidatos.map((c) => c.chiCuadrado).filter(Number.isFinite)
    const min = finitos.length ? Math.min(...finitos) : 0
    const max = finitos.length ? Math.max(...finitos) : 1
    const rango = max - min || 1
    return (chiCuadrado: number) => (Number.isFinite(chiCuadrado) ? (1 - (chiCuadrado - min) / rango) * 100 : 0)
  }, [otrosCandidatos])

  function manejarAnalizar() {
    if (!textoCifrado || !alfabetoValido) return
    setMostrarDetalle(false)
    setResultado(detectarMetodo(textoCifrado, alfabeto))
    setDisparador((d) => d + 1)
  }

  const frecuenciasObservadas = useMemo(() => {
    if (!resultado) return null
    const conteos = new Map<string, number>()
    let cubiertas = 0
    for (const caracter of aGrafemas(resultado.ganador.texto)) {
      const clave = caracter.toUpperCase()
      if (clave in FRECUENCIAS_ESPANOL) {
        cubiertas++
        conteos.set(clave, (conteos.get(clave) ?? 0) + 1)
      }
    }
    const entradas = [...conteos.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    const registro: Record<string, number> = {}
    for (const [letra, conteo] of entradas) {
      registro[letra] = (conteo / Math.max(cubiertas, 1)) * 100
    }
    return registro
  }, [resultado])

  return (
    <div className="el-escenario">
      <p className="el-lema">
        Pega el mensaje cifrado — el sistema <strong>decide solo</strong> cómo romperlo.
      </p>

      <div className="el-campo">
        <textarea
          className="el-mega"
          value={textoCifrado}
          onChange={(e) => {
            setTextoCifrado(e.target.value)
            setResultado(null)
          }}
          spellCheck={false}
          placeholder="Pega aquí el texto cifrado..."
        />
      </div>

      {esTextoCorto && (
        <p className="el-advertencia-longitud">
          Con menos de {UMBRAL_TEXTO_CORTO} caracteres analizables (tienes {longitudAnalizada}), la detección puede
          fallar o salir con confianza baja — es un límite real de información estadística, no un error.
        </p>
      )}

      <div className="el-expandir">
        <button type="button" className="el-tipo-enlace" onClick={() => setMostrarAlfabeto((v) => !v)}>
          {mostrarAlfabeto ? '− ocultar' : '⚙ personalizar'} alfabeto
        </button>
        {mostrarAlfabeto && (
          <div className="el-expandir">
            <EditorAlfabeto
              alfabetoCrudo={alfabetoCrudo}
              alfabeto={alfabeto}
              alCambiarAlfabetoCrudo={(valor) => {
                setAlfabetoCrudo(valor)
                setResultado(null)
              }}
            />
          </div>
        )}
        {!alfabetoValido && (
          <p className="el-advertencia-alfabeto">El alfabeto necesita al menos 2 caracteres distintos.</p>
        )}
      </div>

      <div className="el-acciones">
        <button type="button" className="el-boton-grande" onClick={manejarAnalizar} disabled={!textoCifrado || !alfabetoValido}>
          Descifrar →
        </button>
      </div>

      {resultado && (
        <div className="el-resultado">
          <div className="el-resultado-caja">
            {resultado.determinado ? (
              <div className="el-resultado-texto">{textoRevelado}</div>
            ) : (
              <div className="el-resultado-texto" style={{ opacity: 0.7, fontStyle: 'italic' }}>
                No se pudo determinar — este alfabeto no tiene ninguna letra en común con la tabla de
                referencia del español.
              </div>
            )}
          </div>
          <div className="el-fila-pastillas">
            {resultado.determinado ? (
              <>
                <span className="el-pastilla">{resultado.ganador.metodo === 'cesar' ? 'César' : 'Atbash'}</span>
                {resultado.ganador.metodo === 'cesar' && <span className="el-pastilla">k = {resultado.ganador.k}</span>}
                <span className="el-pastilla el-pastilla--apagada">confianza: {resultado.porcConfianza}%</span>
              </>
            ) : (
              <span className="el-pastilla el-pastilla--apagada">no se pudo determinar el método</span>
            )}
          </div>

          <button
            type="button"
            className="el-tipo-enlace"
            style={{ marginTop: 18 }}
            onClick={() => setMostrarDetalle((v) => !v)}
          >
            {mostrarDetalle ? '− ocultar' : '¿cómo lo dedujo? →'}
          </button>

          {mostrarDetalle && explicacion && (
            <div className="el-detalle">
              <div className="el-veredicto">
                <span className="el-veredicto__titular">{explicacion.titular}</span>
                {explicacion.chiCuadrado !== null && Number.isFinite(explicacion.chiCuadrado) && (
                  <span className="el-insignia-chi" title="Chi-cuadrado de Al-Kindi (más bajo = más parecido al español)">
                    χ² {explicacion.chiCuadrado.toFixed(1)}
                  </span>
                )}
                {explicacion.porcConfianza !== null && (
                  <span
                    className="el-insignia-confianza"
                    style={{ color: colorConfianza(explicacion.porcConfianza) }}
                    title="Qué tan seguro está el sistema del resultado"
                  >
                    {explicacion.porcConfianza}% seguro
                  </span>
                )}
              </div>

              {explicacion.razonamiento && <p className="el-narracion">{explicacion.razonamiento}</p>}

              {frecuenciasObservadas && Object.keys(frecuenciasObservadas).length > 0 && (
                <div>
                  <p className="el-detalle-titulo">Desviación frente al español esperado</p>
                  <BarrasFrecuencia observadas={frecuenciasObservadas} />
                </div>
              )}

              {otrosCandidatos.length > 0 && (
                <div>
                  <p className="el-detalle-titulo">Otros candidatos considerados</p>
                  <div className="el-lista-candidatos">
                    {otrosCandidatos.map((c, i) => (
                      <div className="el-fila-candidato" key={i}>
                        <div className="el-fila-candidato__arriba">
                          <div className="el-fila-candidato__cercania" title="Qué tan cerca quedó del ganador">
                            <div
                              className="el-fila-candidato__cercania-relleno"
                              style={{ width: `${porcCercania(c.chiCuadrado)}%` }}
                            />
                          </div>
                          <span className="el-fila-candidato__metodo">
                            {c.metodo === 'cesar' ? `César · k=${c.k}` : 'Atbash'}
                          </span>
                          <span className="el-fila-candidato__chi">
                            χ²={Number.isFinite(c.chiCuadrado) ? c.chiCuadrado.toFixed(1) : '∞'}
                          </span>
                        </div>
                        <span className="el-fila-candidato__texto">{c.texto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
