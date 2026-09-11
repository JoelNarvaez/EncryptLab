import { useMemo, useState } from 'react'
import { esAlfabetoValido } from '../lib/alfabeto'
import { EditorAlfabeto } from './EditorAlfabeto'
import { cifrarCesar, desplazamientoMaximo } from '../lib/cesar'
import { atbash } from '../lib/atbash'
import type { Metodo } from '../lib/deteccion'

interface PropsVistaCifrado {
  alfabetoCrudo: string
  setAlfabetoCrudo: (valor: string) => void
  alfabeto: string[]
}

export function VistaCifrado({ alfabetoCrudo, setAlfabetoCrudo, alfabeto }: PropsVistaCifrado) {
  const [mostrarAlfabeto, setMostrarAlfabeto] = useState(false)
  const [metodo, setMetodo] = useState<Metodo>('cesar')
  const [k, setK] = useState(3)
  const [textoPlano, setTextoPlano] = useState('EL CIFRADO CESAR ES UNA SUSTITUCION MONOALFABETICA')
  const [copiado, setCopiado] = useState(false)

  const alfabetoValido = esAlfabetoValido(alfabeto)
  const kMaximo = desplazamientoMaximo(alfabeto)
  const kEfectivo = Math.min(k, kMaximo)

  const textoCifrado = useMemo(() => {
    if (!textoPlano || !alfabetoValido) return ''
    return metodo === 'cesar'
      ? cifrarCesar(textoPlano, alfabeto, kEfectivo)
      : atbash(textoPlano, alfabeto)
  }, [textoPlano, alfabetoValido, metodo, alfabeto, kEfectivo])

  function manejarCopiar() {
    if (!textoCifrado) return
    navigator.clipboard.writeText(textoCifrado).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    })
  }

  return (
    <div className="el-escenario">
      <p className="el-lema">
        Escribe tu mensaje y elige cómo <strong>cifrarlo</strong>.
      </p>

      <div className="el-campo">
        <textarea
          className="el-mega"
          value={textoPlano}
          onChange={(e) => setTextoPlano(e.target.value)}
          spellCheck={false}
          placeholder="Escribe aquí tu mensaje..."
        />
      </div>

      <div className="el-fila-controles">
        <div className="el-selector-pastilla">
          <button
            type="button"
            className={`el-selector-pastilla__boton ${metodo === 'cesar' ? 'esta-activo' : ''}`}
            onClick={() => setMetodo('cesar')}
          >
            César
          </button>
          <button
            type="button"
            className={`el-selector-pastilla__boton ${metodo === 'atbash' ? 'esta-activo' : ''}`}
            onClick={() => setMetodo('atbash')}
          >
            Atbash
          </button>
        </div>

        {metodo === 'cesar' && (
          <div className="el-fila-deslizador el-revelar">
            <input
              type="range"
              className="el-deslizador"
              min={1}
              max={kMaximo}
              value={kEfectivo}
              onChange={(e) => setK(Number(e.target.value))}
            />
            <span className="el-insignia-valor">{kEfectivo}</span>
          </div>
        )}
      </div>

      <div className="el-expandir" style={{ marginTop: 14 }}>
        <button type="button" className="el-tipo-enlace" onClick={() => setMostrarAlfabeto((v) => !v)}>
          {mostrarAlfabeto ? '− ocultar' : '⚙ personalizar'} alfabeto
        </button>
        {mostrarAlfabeto && (
          <div className="el-expandir">
            <EditorAlfabeto alfabetoCrudo={alfabetoCrudo} alfabeto={alfabeto} alCambiarAlfabetoCrudo={setAlfabetoCrudo} />
          </div>
        )}
        {!alfabetoValido && (
          <p className="el-advertencia-alfabeto">El alfabeto necesita al menos 2 caracteres distintos.</p>
        )}
      </div>

      <div className="el-resultado">
        <div className="el-resultado-caja">
          <div className="el-resultado-cabecera">
            <span className="el-campo__etiqueta" style={{ marginBottom: 0 }}>
              Resultado
            </span>
            <button type="button" className="el-boton-copiar" onClick={manejarCopiar} disabled={!textoCifrado}>
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="el-resultado-texto">{textoCifrado || '—'}</div>
        </div>
        <div className="el-fila-pastillas">
          <span className="el-pastilla el-pastilla--apagada">{textoPlano.length} caracteres</span>
          <span className="el-pastilla">{metodo === 'cesar' ? 'César' : 'Atbash'}</span>
          {metodo === 'cesar' && <span className="el-pastilla">k = {kEfectivo}</span>}
        </div>
      </div>
    </div>
  )
}
