import { useEffect, useMemo, useState } from 'react'
import './Aplicacion.css'
import { SelectorModo, type ModoApp } from './components/SelectorModo'
import { SelectorTema, type Tema } from './components/SelectorTema'
import { LetrasCayendo } from './components/LetrasCayendo'
import { VistaCifrado } from './components/VistaCifrado'
import { VistaDescifrado } from './components/VistaDescifrado'
import { ALFABETO_POR_DEFECTO, normalizarAlfabeto } from './lib/alfabeto'

const CLAVE_TEMA = 'encryptlab-tema'

function obtenerTemaInicial(): Tema {
  const guardado = localStorage.getItem(CLAVE_TEMA)
  return guardado === 'oscuro' ? 'oscuro' : 'claro'
}

function Aplicacion() {
  const [modo, setModo] = useState<ModoApp>('cifrar')
  const [tema, setTema] = useState<Tema>(obtenerTemaInicial)
  const [alfabetoCrudo, setAlfabetoCrudo] = useState(ALFABETO_POR_DEFECTO)
  const alfabeto = useMemo(() => normalizarAlfabeto(alfabetoCrudo), [alfabetoCrudo])

  useEffect(() => {
    localStorage.setItem(CLAVE_TEMA, tema)
    document.documentElement.dataset.theme = tema
  }, [tema])

  return (
    <div data-mode={modo}>
      <div className="el-fondo" aria-hidden="true" />
      <LetrasCayendo />
      <div className="el-contenedor">
        <nav className="el-nav">
          <div className="el-grupo-nav">
            <div className="el-marca">
              <span className="el-marca__cursor">{'>'}</span>EncryptLab
            </div>
            <span className="el-insignia-idioma" title="Idioma de referencia para el análisis de frecuencia">
              🇪🇸 Español
            </span>
            <SelectorTema tema={tema} alCambiar={setTema} />
          </div>
          <SelectorModo modo={modo} alCambiar={setModo} />
        </nav>

        <div hidden={modo !== 'cifrar'}>
          <VistaCifrado alfabetoCrudo={alfabetoCrudo} setAlfabetoCrudo={setAlfabetoCrudo} alfabeto={alfabeto} />
        </div>
        <div hidden={modo !== 'descifrar'}>
          <VistaDescifrado alfabetoCrudo={alfabetoCrudo} setAlfabetoCrudo={setAlfabetoCrudo} alfabeto={alfabeto} />
        </div>
      </div>
    </div>
  )
}

export default Aplicacion
