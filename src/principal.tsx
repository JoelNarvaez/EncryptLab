import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos.css'
import Aplicacion from './Aplicacion.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
)
