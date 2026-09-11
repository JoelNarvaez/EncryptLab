export type ModoApp = 'cifrar' | 'descifrar'

interface PropsSelectorModo {
  modo: ModoApp
  alCambiar: (modo: ModoApp) => void
}

export function SelectorModo({ modo, alCambiar }: PropsSelectorModo) {
  return (
    <div className="el-interruptor" role="tablist" aria-label="Modo">
      <button
        type="button"
        role="tab"
        aria-selected={modo === 'cifrar'}
        className={`el-interruptor__boton ${modo === 'cifrar' ? 'esta-activo' : ''}`}
        onClick={() => alCambiar('cifrar')}
      >
        Cifrar
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={modo === 'descifrar'}
        className={`el-interruptor__boton ${modo === 'descifrar' ? 'esta-activo' : ''}`}
        onClick={() => alCambiar('descifrar')}
      >
        Descifrar
      </button>
    </div>
  )
}
