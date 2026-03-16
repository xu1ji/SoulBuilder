/**
 * 训练动画主组件
 */

import { memo, useState, useEffect } from 'react'
import { MATRIX_COLORS } from '@soulbuilder/shared'
import type { TrainingAnimationProps } from '../types'
import { CodeRain } from './CodeRain'
import { PixelFighter } from './PixelFighter'
import { ProgressOverlay } from './ProgressOverlay'
import { BeforeAfterComparison } from './BeforeAfterComparison'
import { SkipButton } from './SkipButton'
import { useAnimation } from '../hooks'

/**
 * 训练动画主组件
 */
export const TrainingAnimation = memo(function TrainingAnimation({
  config,
  onComplete,
  onPhaseChange,
  skippable = true,
}: TrainingAnimationProps) {
  const [showComparison, setShowComparison] = useState(false)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [skills, setSkills] = useState<string[]>([])

  const {
    currentPhase,
    phaseProgress,
    totalProgress,
    currentAction,
    fighterVisible,
    currentLabel,
    isComplete,
    skip,
  } = useAnimation({
    onPhaseChange,
    onComplete: () => {
      setShowComparison(true)
    },
  })

  // 技能打字机效果
  useEffect(() => {
    if (currentPhase === 'complete' && config.skills.length > 0) {
      const interval = setInterval(() => {
        setCurrentSkillIndex((i) => {
          const next = i + 1
          if (next <= config.skills.length) {
            setSkills(config.skills.slice(0, next))
            return next
          }
          return i
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [currentPhase, config.skills])

  // 计算训练阶段的进度
  const getTrainingProgress = (): number => {
    if (currentPhase === 'training') {
      return phaseProgress
    }
    return currentPhase === 'complete' ? 100 : 0
  }

  return (
    <div style={styles.container}>
      {/* 代码雨背景 */}
      <CodeRain
        opacity={currentPhase === 'enter' ? 0.3 : 0.7}
        speed={currentPhase === 'training' ? 1.5 : 1}
      />

      {/* 内容区域 */}
      <div style={styles.content}>
        {/* 进度显示 */}
        {!showComparison && (
          <ProgressOverlay
            phase={currentPhase}
            progress={getTrainingProgress()}
            skill={skills[skills.length - 1]}
          />
        )}

        {/* 像素小人 */}
        <div style={styles.fighterContainer}>
          <PixelFighter
            action={currentAction}
            visible={fighterVisible}
            scale={1.5}
          />
        </div>

        {/* 技能显示 */}
        {currentPhase === 'complete' && !showComparison && (
          <div style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <div
                key={`${skill}-${index}`}
                style={{
                  ...styles.skillText,
                  opacity: index === skills.length - 1 ? 1 : 0.5,
                }}
              >
                I know {skill}.
              </div>
            ))}
          </div>
        )}

        {/* Before/After 对比 */}
        {showComparison && (
          <BeforeAfterComparison
            before={{
              score: config.beforeScore,
              rank: config.beforeRank,
            }}
            after={{
              score: config.afterScore,
              rank: config.afterRank,
            }}
            skills={config.skills}
          />
        )}
      </div>

      {/* 跳过按钮 */}
      {skippable && !isComplete && (
        <SkipButton onClick={skip} visible={!showComparison} />
      )}
    </div>
  )
})

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: MATRIX_COLORS.black,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    textAlign: 'center',
  },
  fighterContainer: {
    margin: '20px 0',
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
  skillText: {
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    color: MATRIX_COLORS.green,
    textShadow: `0 0 10px ${MATRIX_COLORS.green}`,
    transition: 'opacity 0.3s ease',
  },
}

export default TrainingAnimation
