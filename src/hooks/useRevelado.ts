import { useEffect, useState } from 'react'

const GRUPO_ALEATORIO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MS_POR_CUADRO = 28
const CUADROS_ASENTAMIENTO = 8
const CUADROS_ESCALONADO = 1.4

// Revela `objetivo` de izquierda a derecha, mostrando caracteres al azar
// antes de que cada posicion se asiente en su valor final. `disparador`
// fuerza que la animacion se repita aunque `objetivo` no cambie (ej.
// reintentar el mismo texto).
export function useRevelado(objetivo: string, disparador: number): string {
  const [visible, setVisible] = useState(objetivo)

  useEffect(() => {
    if (!objetivo) return

    let cuadro = 0
    const ultimoCuadroNecesario = objetivo.length * CUADROS_ESCALONADO + CUADROS_ASENTAMIENTO

    const id = setInterval(() => {
      cuadro++
      setVisible(
        [...objetivo]
          .map((caracter, i) => {
            if (caracter === ' ') return ' '
            const asentadoEn = i * CUADROS_ESCALONADO + CUADROS_ASENTAMIENTO
            if (cuadro >= asentadoEn) return caracter
            return GRUPO_ALEATORIO[Math.floor(Math.random() * GRUPO_ALEATORIO.length)]
          })
          .join(''),
      )
      if (cuadro >= ultimoCuadroNecesario) clearInterval(id)
    }, MS_POR_CUADRO)

    return () => clearInterval(id)
  }, [objetivo, disparador])

  return visible
}
