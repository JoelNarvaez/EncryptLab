import { ALFABETO_POR_DEFECTO, ALFABETO_ESPANOL } from '../lib/alfabeto'

interface PropsEditorAlfabeto {
  alfabetoCrudo: string
  alfabeto: string[]
  alCambiarAlfabetoCrudo: (valor: string) => void
}

export function EditorAlfabeto({ alfabetoCrudo, alfabeto, alCambiarAlfabetoCrudo }: PropsEditorAlfabeto) {
  return (
    <div className="el-editor-alfabeto">
      <div className="el-editor-alfabeto__cabecera">
        <div className="el-selector-pastilla">
          <button
            type="button"
            className={`el-selector-pastilla__boton ${alfabetoCrudo === ALFABETO_ESPANOL ? 'esta-activo' : ''}`}
            onClick={() => alCambiarAlfabetoCrudo(ALFABETO_ESPANOL)}
          >
            Español
          </button>
          <button
            type="button"
            className={`el-selector-pastilla__boton ${alfabetoCrudo === ALFABETO_POR_DEFECTO ? 'esta-activo' : ''}`}
            onClick={() => alCambiarAlfabetoCrudo(ALFABETO_POR_DEFECTO)}
          >
            ASCII
          </button>
        </div>
        <span className="el-editor-alfabeto__cantidad">{alfabeto.length} símbolos</span>
      </div>

      <div className="el-tira-alfabeto" key={alfabeto.join('')}>
        {alfabeto.map((caracter, i) => (
          <span className="el-tira-alfabeto__ficha" key={i}>
            {caracter === ' ' ? '␣' : caracter}
          </span>
        ))}
      </div>

      <label className="el-editor-alfabeto__personalizado">
        <span className="el-campo__etiqueta">o escribe tu propio conjunto</span>
        <input
          className="el-mega el-mega--chico"
          value={alfabetoCrudo}
          onChange={(e) => alCambiarAlfabetoCrudo(e.target.value)}
          spellCheck={false}
        />
      </label>
    </div>
  )
}
