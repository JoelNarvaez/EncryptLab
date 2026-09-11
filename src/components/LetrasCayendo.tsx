import { useMemo } from 'react'

// Decoracion pura de fondo, a los costados donde no hay contenido en
// pantallas anchas (en angostas queda oculta por CSS, no hay espacio).
const GRUPO_LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const CANTIDAD = 14

interface LetraCayendo {
  id: number
  caracter: string
  izquierda: number
  duracion: number
  retraso: number
  tamano: number
}

function aleatorioEnRango(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function crearLetras(): LetraCayendo[] {
  return Array.from({ length: CANTIDAD }, (_, i) => {
    // mitad de las letras cae del lado izquierdo, mitad del derecho
    const [izquierdaMin, izquierdaMax] = i % 2 === 0 ? [1, 14] : [86, 99]
    return {
      id: i,
      caracter: GRUPO_LETRAS[Math.floor(Math.random() * GRUPO_LETRAS.length)],
      izquierda: aleatorioEnRango(izquierdaMin, izquierdaMax),
      duracion: aleatorioEnRango(14, 26),
      retraso: -aleatorioEnRango(0, 24), // negativo: arrancan ya a mitad de caida
      tamano: aleatorioEnRango(12, 22),
    }
  })
}

export function LetrasCayendo() {
  // useMemo con deps vacias: se generan una sola vez: valores random
  // estables que no saltan en cada render.
  const letras = useMemo(crearLetras, [])

  return (
    <div className="el-letras-cayendo" aria-hidden="true">
      {letras.map((letra) => (
        <span
          key={letra.id}
          className="el-letra-cayendo"
          style={{
            left: `${letra.izquierda}%`,
            fontSize: `${letra.tamano}px`,
            animationDuration: `${letra.duracion}s`,
            animationDelay: `${letra.retraso}s`,
          }}
        >
          {letra.caracter}
        </span>
      ))}
    </div>
  )
}
