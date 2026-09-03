import { SPANISH_FREQUENCIES } from '../lib/frequencies'

interface FrequencyBarsProps {
  observed: Record<string, number>
}

export function FrequencyBars({ observed }: FrequencyBarsProps) {
  const letters = Object.keys(observed)
  const maxVal = Math.max(
    ...letters.map((l) => Math.max(observed[l], SPANISH_FREQUENCIES[l] ?? 0)),
    1,
  )

  return (
    <div>
      <div className="el-freqchart">
        {letters.map((letter) => {
          const obs = observed[letter]
          const exp = SPANISH_FREQUENCIES[letter] ?? 0
          return (
            <div className="el-freqchart__col" key={letter}>
              <div className="el-freqchart__track">
                <div
                  className="el-freqchart__bar"
                  style={{ height: `${(obs / maxVal) * 100}%` }}
                />
                <div
                  className="el-freqchart__marker"
                  style={{ bottom: `${(exp / maxVal) * 100}%` }}
                />
              </div>
              <span className="el-freqchart__letter">{letter}</span>
            </div>
          )
        })}
      </div>
      <div className="el-freqchart-legend">
        <span>
          <i className="el-legend-dot" /> observado
        </span>
        <span>
          <i className="el-legend-line" /> esperado en español
        </span>
      </div>
    </div>
  )
}
