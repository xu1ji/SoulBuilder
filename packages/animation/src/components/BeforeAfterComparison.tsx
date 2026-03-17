/**
 * Before/After 对比组件
 */

import { memo, useState, useEffect } from 'react'
import { MATRIX_COLORS } from '@soulbuilder/shared'
import type { BeforeAfterComparisonProps } from '../types'

/**
 * 继续按钮组件
 */
function ContinueButton({ onClick }: { onClick: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={onClick}
      style={styles.continueButton}
    >
      <span style={styles.continueIcon}>→</span>
      继续升级
    </button>
  )
}

/**
 * 分数跳动动画组件
 */
function AnimatedScore({ value, color }: { value: number; color: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(Math.round(startValue + (value - startValue) * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span style={{ color }}>{displayValue}%</span>
  )
}

/**
 * 打字机效果技能
 */
function TypewriterSkill({ skill, delay }: { skill: string; delay: number }) {
  const [displayText, setDisplayText] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let index = 0
    const interval = setInterval(() => {
      if (index <= skill.length) {
        setDisplayText(skill.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [started, skill])

  if (!started) return null

  return (
    <div style={styles.skillTag}>
      I know {displayText}
      {displayText.length < skill.length && <span style={styles.cursor}>|</span>}
    </div>
  )
}

/**
 * Before/After 对比组件
 */
export const BeforeAfterComparison = memo(function BeforeAfterComparison({
  before,
  after,
  skills,
  onContinue,
}: BeforeAfterComparisonProps) {
  const [visible, setVisible] = useState(false)
  const scoreDiff = after.score - before.score
  const rankUp = before.rank !== after.rank

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div style={styles.container}>
      {/* 对比面板 */}
      <div style={styles.comparison}>
        {/* Before */}
        <div style={styles.panel}>
          <div style={styles.label}>BEFORE</div>
          <div style={styles.rank}>{before.rank}</div>
          <AnimatedScore value={before.score} color={MATRIX_COLORS.greenDark} />
        </div>

        {/* 箭头 */}
        <div style={styles.arrow}>→</div>

        {/* After */}
        <div style={{ ...styles.panel, ...styles.afterPanel }}>
          <div style={{ ...styles.label, color: MATRIX_COLORS.success }}>AFTER</div>
          <div style={{ ...styles.rank, color: MATRIX_COLORS.gold }}>{after.rank}</div>
          <AnimatedScore value={after.score} color={MATRIX_COLORS.success} />
        </div>
      </div>

      {/* 提升幅度 */}
      <div style={styles.boost}>
        <span style={{ color: MATRIX_COLORS.success }}>+{scoreDiff}%</span>
        <span style={{ color: MATRIX_COLORS.greenDark }}> Boost</span>
        {rankUp && (
          <span style={{ color: MATRIX_COLORS.gold, marginLeft: '8px' }}>
            {before.rank} → {after.rank}
          </span>
        )}
      </div>

      {/* 技能列表 */}
      <div style={styles.skills}>
        {skills.map((skill, index) => (
          <TypewriterSkill
            key={skill}
            skill={skill}
            delay={500 + index * 300}
          />
        ))}
      </div>

      {/* 继续按钮 */}
      <ContinueButton onClick={onContinue} />
    </div>
  )
})

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    zIndex: 20,
    textAlign: 'center',
    padding: '20px',
    animation: 'fadeIn 0.5s ease-out',
  },
  comparison: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  panel: {
    padding: '15px 25px',
    border: `1px solid ${MATRIX_COLORS.greenDark}`,
    borderRadius: '8px',
    background: 'rgba(0, 255, 65, 0.05)',
  },
  afterPanel: {
    border: `1px solid ${MATRIX_COLORS.success}`,
    background: 'rgba(74, 222, 128, 0.1)',
    boxShadow: `0 0 20px ${MATRIX_COLORS.success}40`,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: MATRIX_COLORS.greenDark,
    marginBottom: '8px',
    letterSpacing: '2px',
  },
  rank: {
    fontFamily: 'monospace',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: MATRIX_COLORS.greenDark,
    marginBottom: '4px',
  },
  arrow: {
    fontSize: '2rem',
    color: MATRIX_COLORS.green,
    textShadow: `0 0 10px ${MATRIX_COLORS.green}`,
  },
  boost: {
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    marginBottom: '20px',
  },
  skills: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  skillTag: {
    fontFamily: 'monospace',
    fontSize: '1rem',
    color: MATRIX_COLORS.green,
    textShadow: `0 0 5px ${MATRIX_COLORS.green}`,
    padding: '5px 15px',
    border: `1px solid ${MATRIX_COLORS.green}`,
    borderRadius: '4px',
    background: 'rgba(0, 255, 65, 0.1)',
  },
  cursor: {
    animation: 'blink 0.5s infinite',
  },
  continueButton: {
    marginTop: '30px',
    padding: '12px 32px',
    fontFamily: 'monospace',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: MATRIX_COLORS.black,
    background: MATRIX_COLORS.green,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: `0 0 20px ${MATRIX_COLORS.green}60`,
    transition: 'all 0.3s ease',
  },
  continueIcon: {
    fontSize: '1.25rem',
    transition: 'transform 0.3s ease',
  },
}

export default BeforeAfterComparison
