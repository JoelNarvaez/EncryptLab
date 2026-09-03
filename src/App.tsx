import { useState } from 'react'
import './App.css'
import { ModeSwitch, type AppMode } from './components/ModeSwitch'
import { EncryptView } from './components/EncryptView'
import { DecryptView } from './components/DecryptView'

function App() {
  const [mode, setMode] = useState<AppMode>('cifrar')

  return (
    <div data-mode={mode}>
      <div className="el-bg" aria-hidden="true" />
      <div className="el-shell">
        <nav className="el-nav">
          <div className="el-navgroup">
            <div className="el-wordmark">
              <span className="el-wordmark__caret">{'>'}</span>EncryptLab
            </div>
            <span className="el-lang-badge" title="Idioma de referencia para el análisis de frecuencia">
              🇪🇸 Español
            </span>
          </div>
          <ModeSwitch mode={mode} onChange={setMode} />
        </nav>

        {mode === 'cifrar' ? <EncryptView /> : <DecryptView />}

        <p className="el-footer">César &amp; Atbash sobre un alfabeto configurable · UAA · Seguridad</p>
      </div>
    </div>
  )
}

export default App
