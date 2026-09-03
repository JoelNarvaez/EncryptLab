export type AppMode = 'cifrar' | 'descifrar'

interface ModeSwitchProps {
  mode: AppMode
  onChange: (mode: AppMode) => void
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="el-switch" role="tablist" aria-label="Modo">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'cifrar'}
        className={`el-switch__btn ${mode === 'cifrar' ? 'is-active' : ''}`}
        onClick={() => onChange('cifrar')}
      >
        Cifrar
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'descifrar'}
        className={`el-switch__btn ${mode === 'descifrar' ? 'is-active' : ''}`}
        onClick={() => onChange('descifrar')}
      >
        Descifrar
      </button>
    </div>
  )
}
