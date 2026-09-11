export type Tema = 'oscuro' | 'claro'

interface PropsSelectorTema {
  tema: Tema
  alCambiar: (tema: Tema) => void
}

export function SelectorTema({ tema, alCambiar }: PropsSelectorTema) {
  const esClaro = tema === 'claro'

  return (
    <button
      type="button"
      className="el-selector-tema"
      onClick={() => alCambiar(esClaro ? 'oscuro' : 'claro')}
      aria-label={esClaro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={esClaro ? 'Modo oscuro' : 'Modo claro'}
    >
      {esClaro ? '☀' : '☾'}
    </button>
  )
}
