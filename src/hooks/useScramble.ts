import { useEffect, useState } from 'react'

const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const FRAME_MS = 28
const SETTLE_FRAMES = 8
const STAGGER_FRAMES = 1.4

// Revela `target` de izquierda a derecha, mostrando caracteres al azar antes
// de que cada posicion se asiente en su valor final. `trigger` fuerza que la
// animacion se repita aunque `target` no cambie (ej. reintentar el mismo texto).
export function useScramble(target: string, trigger: number): string {
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    if (!target) return

    let frame = 0
    const lastFrameNeeded = target.length * STAGGER_FRAMES + SETTLE_FRAMES

    const id = setInterval(() => {
      frame++
      setDisplay(
        [...target]
          .map((char, i) => {
            if (char === ' ') return ' '
            const settledAt = i * STAGGER_FRAMES + SETTLE_FRAMES
            if (frame >= settledAt) return char
            return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)]
          })
          .join(''),
      )
      if (frame >= lastFrameNeeded) clearInterval(id)
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [target, trigger])

  return display
}
