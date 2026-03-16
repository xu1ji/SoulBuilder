/**
 * 进度覆盖层组件
 */

import { memo, useState, useEffect } from 'react'
import { MATRIX_COLORS } from '@soulbuilder/shared'
import type { ProgressOverlayProps, AnimationPhase } from '../types'

const PHASE_LABELS: Record<AnimationPhase, string> = {
  enter: 'Entering Construct...',
  transfer: 'Transferring data...',
  training: 'Training in progress...',
  awakening: 'Awakening...',
  complete: 'I know',
}

/**
 * 进度覆盖层组件
 */
export const ProgressOverlay = memo(function ProgressOverlay({
  phase,
  progress,
  skill,
}: ProgressOverlayProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  // 进度动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 50)
    return () => clearTimeout(timer)
  }, [progress])

  const label = phase === 'complete' && skill
    ? `I know ${skill}.`
    : PHASE_LABELS[phase]

  const showProgress = phase === 'training'

  return (
    <div style={styles.overlay}>
      {/* 阶段标签 */}
      <div style={{
        ...styles.label,
        color: phase === 'complete' ? MATRIX_COLORS.gold : MATRIX_COLORS.green,
      }}>
        {label}
      </div>

      {/* 进度条 */}
      {showProgress && (
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${displayProgress}%`,
              }}
            />
          </div>
          <div style={styles.progressText}>
            {Math.round(displayProgress)}%
          </div>
        </div>
      )}

      {/* 完成时的光效 */}
      {phase === 'complete' && (
        <div style={styles.completeGlow} />
      )}
    </div>
  )
})

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'relative',
    zIndex: 20,
    textAlign: 'center',
    padding: '20px',
  },
  label: {
    fontFamily: '"JetBrains Mono", "Courier New", monospace',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textShadow: `0 0 10px ${MATRIX_COLORS.green}`,
    marginBottom: '1rem',
    letterSpacing: '2px',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressBar: {
    width: '300px',
    maxWidth: '80vw',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MATRIX_COLORS.green,
    transition: 'width 0.1s ease-out',
    boxShadow: `0 0 10px ${MATRIX_COLORS.green}`,
  },
  progressText: {
    fontFamily: 'monospace',
    fontSize: '1rem',
    color: MATRIX_COLORS.green,
    textShadow: `0 0 5px ${MATRIX_COLORS.green}`,
  },
  completeGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    background: `radial-gradient(circle, ${MATRIX_COLORS.gold}40 0%, transparent 70%)`,
    borderRadius: '50%',
    pointerEvents: 'none',
    animation: 'pulse 1s ease-in-out infinite',
  },
}

export default ProgressOverlay
