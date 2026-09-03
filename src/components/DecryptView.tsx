import { useMemo, useState } from 'react'
import { FrequencyBars } from './FrequencyBars'
import { DEFAULT_ALPHABET, normalizeAlphabet } from '../lib/alphabet'
import { caesarEncrypt } from '../lib/caesar'
import { detectarMetodo, type DetectionResult } from '../lib/detect'
import { explainDetection } from '../lib/narrate'
import { SPANISH_FREQUENCIES } from '../lib/frequencies'
import { useScramble } from '../hooks/useScramble'

const SAMPLE_PLAINTEXT = 'LA CRIPTOGRAFIA CLASICA FUE SUPERADA CUANDO AL KINDI DESCUBRIO EL ANALISIS DE FRECUENCIA'

export function DecryptView() {
  const [alphabetRaw, setAlphabetRaw] = useState(DEFAULT_ALPHABET)
  const [showAlphabet, setShowAlphabet] = useState(false)
  const alphabet = useMemo(() => normalizeAlphabet(alphabetRaw), [alphabetRaw])

  const [ciphertext, setCiphertext] = useState(() => caesarEncrypt(SAMPLE_PLAINTEXT, normalizeAlphabet(DEFAULT_ALPHABET), 11))
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [trigger, setTrigger] = useState(0)
  const [showDetail, setShowDetail] = useState(false)

  const revealedText = useScramble(result?.winner.text ?? '', trigger)

  function handleAnalyze() {
    if (!ciphertext) return
    setShowDetail(false)
    setResult(detectarMetodo(ciphertext, alphabet))
    setTrigger((t) => t + 1)
  }

  const observedFrequencies = useMemo(() => {
    if (!result) return null
    const counts = new Map<string, number>()
    let covered = 0
    for (const char of result.winner.text) {
      const key = char.toUpperCase()
      if (key in SPANISH_FREQUENCIES) {
        covered++
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    const record: Record<string, number> = {}
    for (const [letter, count] of entries) {
      record[letter] = (count / Math.max(covered, 1)) * 100
    }
    return record
  }, [result])

  return (
    <div className="el-stage">
      <p className="el-tagline">
        Pega el mensaje cifrado — el sistema <strong>decide solo</strong> cómo romperlo.
      </p>

      <div className="el-field">
        <textarea
          className="el-mega"
          value={ciphertext}
          onChange={(e) => {
            setCiphertext(e.target.value.toUpperCase())
            setResult(null)
          }}
          spellCheck={false}
          placeholder="Pega aquí el texto cifrado..."
        />
      </div>

      <div className="el-expand">
        <button type="button" className="el-linklike" onClick={() => setShowAlphabet((v) => !v)}>
          {showAlphabet ? '− ocultar' : '⚙ personalizar'} alfabeto
        </button>
        {showAlphabet && (
          <div className="el-expand">
            <input
              className="el-mega el-mega--small"
              value={alphabetRaw}
              onChange={(e) => {
                setAlphabetRaw(e.target.value.toUpperCase())
                setResult(null)
              }}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div className="el-actions">
        <button type="button" className="el-btn-big" onClick={handleAnalyze}>
          Descifrar →
        </button>
      </div>

      {result && (
        <div className="el-result">
          <div className="el-result-box">
            <div className="el-result-text">{revealedText}</div>
          </div>
          <div className="el-pills-row">
            <span className="el-pill">{result.winner.method === 'cesar' ? 'César' : 'Atbash'}</span>
            {result.winner.method === 'cesar' && <span className="el-pill">k = {result.winner.k}</span>}
            <span className="el-pill el-pill--muted">confianza: {result.confidence}</span>
          </div>

          <button type="button" className="el-linklike" style={{ marginTop: 18 }} onClick={() => setShowDetail((v) => !v)}>
            {showDetail ? '− ocultar' : '¿cómo lo dedujo? →'}
          </button>

          {showDetail && (
            <div className="el-detail">
              <p className="el-narration">{explainDetection(result)}</p>

              {observedFrequencies && Object.keys(observedFrequencies).length > 0 && (
                <FrequencyBars observed={observedFrequencies} />
              )}

              <div className="el-candidates-list">
                {result.candidates.slice(1, 6).map((c, i) => (
                  <div className="el-candidate-row" key={i}>
                    <span>
                      {c.method === 'cesar' ? `César · k=${c.k}` : 'Atbash'} · χ²=
                      {Number.isFinite(c.chiSquare) ? c.chiSquare.toFixed(1) : '∞'}
                    </span>
                    <span className="el-candidate-row__text">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
