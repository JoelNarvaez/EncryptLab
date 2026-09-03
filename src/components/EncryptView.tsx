import { useMemo, useState } from 'react'
import { DEFAULT_ALPHABET, normalizeAlphabet } from '../lib/alphabet'
import { caesarEncrypt, maxShift } from '../lib/caesar'
import { atbash } from '../lib/atbash'
import type { Method } from '../lib/detect'

export function EncryptView() {
  const [alphabetRaw, setAlphabetRaw] = useState(DEFAULT_ALPHABET)
  const [showAlphabet, setShowAlphabet] = useState(false)
  const [method, setMethod] = useState<Method>('cesar')
  const [k, setK] = useState(3)
  const [plaintext, setPlaintext] = useState('EL CIFRADO CESAR ES UNA SUSTITUCION MONOALFABETICA')
  const [copied, setCopied] = useState(false)

  const alphabet = useMemo(() => normalizeAlphabet(alphabetRaw), [alphabetRaw])
  const upperK = maxShift(alphabet)
  const effectiveK = Math.min(k, upperK)

  const ciphertext = useMemo(() => {
    if (!plaintext) return ''
    return method === 'cesar'
      ? caesarEncrypt(plaintext, alphabet, effectiveK)
      : atbash(plaintext, alphabet)
  }, [plaintext, method, alphabet, effectiveK])

  function handleCopy() {
    if (!ciphertext) return
    navigator.clipboard.writeText(ciphertext).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="el-stage">
      <p className="el-tagline">
        Escribe tu mensaje y elige cómo <strong>cifrarlo</strong>.
      </p>

      <div className="el-field">
        <textarea
          className="el-mega"
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
          spellCheck={false}
          placeholder="Escribe aquí tu mensaje..."
        />
      </div>

      <div className="el-controls-row">
        <div className="el-pilltoggle">
          <button
            type="button"
            className={`el-pilltoggle__btn ${method === 'cesar' ? 'is-active' : ''}`}
            onClick={() => setMethod('cesar')}
          >
            César
          </button>
          <button
            type="button"
            className={`el-pilltoggle__btn ${method === 'atbash' ? 'is-active' : ''}`}
            onClick={() => setMethod('atbash')}
          >
            Atbash
          </button>
        </div>

        {method === 'cesar' && (
          <div className="el-slider-row el-reveal">
            <input
              type="range"
              className="el-slider"
              min={1}
              max={upperK}
              value={effectiveK}
              onChange={(e) => setK(Number(e.target.value))}
            />
            <span className="el-value-badge">{effectiveK}</span>
          </div>
        )}
      </div>

      <div className="el-expand" style={{ marginTop: 14 }}>
        <button type="button" className="el-linklike" onClick={() => setShowAlphabet((v) => !v)}>
          {showAlphabet ? '− ocultar' : '⚙ personalizar'} alfabeto
        </button>
        {showAlphabet && (
          <div className="el-expand">
            <input
              className="el-mega el-mega--small"
              value={alphabetRaw}
              onChange={(e) => setAlphabetRaw(e.target.value.toUpperCase())}
              spellCheck={false}
            />
            <div className="el-alphabet-strip">
              {alphabet.map((char, i) => (
                <span className="el-alphabet-strip__chip" key={`${char}-${i}`}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="el-result">
        <div className="el-result-box">
          <div className="el-result-head">
            <span className="el-field__label" style={{ marginBottom: 0 }}>
              Resultado
            </span>
            <button type="button" className="el-copy-btn" onClick={handleCopy}>
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="el-result-text">{ciphertext || '—'}</div>
        </div>
        <div className="el-pills-row">
          <span className="el-pill el-pill--muted">{plaintext.length} caracteres</span>
          <span className="el-pill">{method === 'cesar' ? 'César' : 'Atbash'}</span>
          {method === 'cesar' && <span className="el-pill">k = {effectiveK}</span>}
        </div>
      </div>
    </div>
  )
}
