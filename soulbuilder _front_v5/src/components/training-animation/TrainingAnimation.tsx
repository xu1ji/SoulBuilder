/**
 * 训练动画主组件
 * 迁移自 matrix-kungfu-demo.html
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { CodeRain } from './CodeRain'
import { PixelFighter, type FighterAction } from './PixelFighter'
import { initAudio, playSoundForAction } from './sounds'
import './TrainingAnimation.css'

interface TrainingAnimationProps {
  onComplete: () => void
  duration?: number // 训练时长（秒）
  agentName?: string
  // 分数相关
  beforeScore?: number
  afterScore?: number
  beforeRank?: string
  afterRank?: string
  skills?: string[]
}

const BASIC_ACTIONS: FighterAction[] = ['idle', 'punch', 'kick', 'training']
const SPECIAL_ACTION: FighterAction = 'awakening'

// 生成随机动作序列
function generateSequence(): Array<{ action: FighterAction; duration: number }> {
  const sequence = []
  const length = Math.floor(Math.random() * 6) + 5

  for (let i = 0; i < length; i++) {
    const action = BASIC_ACTIONS[Math.floor(Math.random() * BASIC_ACTIONS.length)]
    const duration = Math.floor(Math.random() * 400) + 300
    sequence.push({ action, duration })
  }

  sequence.push({ action: SPECIAL_ACTION, duration: 1500 })
  sequence.push({ action: 'idle', duration: Math.floor(Math.random() * 500) + 500 })

  return sequence
}

export function TrainingAnimation({
  onComplete,
  duration = 20,
  agentName = 'SoloBrave',
  beforeScore = 85,
  afterScore = 94,
  beforeRank = 'A',
  afterRank = 'S',
  skills = ['SPIN 销售法', 'Challenger Sale', '大客户管理策略'],
}: TrainingAnimationProps) {
  const [started, setStarted] = useState(false)
  const [currentAction, setCurrentAction] = useState<FighterAction>('idle')
  const [countdown, setCountdown] = useState(duration)
  const [isComplete, setIsComplete] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [displaySkills, setDisplaySkills] = useState<string[]>([])
  const [displayScore, setDisplayScore] = useState(beforeScore)

  const sequenceRef = useRef<Array<{ action: FighterAction; duration: number }>>([])
  const sequenceIndexRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // 分数动画
  useEffect(() => {
    if (showComparison) {
      const startScore = beforeScore
      const endScore = afterScore
      const durationMs = 1500
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / durationMs, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentScore = Math.round(startScore + (endScore - startScore) * easeOut)
        setDisplayScore(currentScore)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [showComparison, beforeScore, afterScore])

  // 技能打字机效果
  useEffect(() => {
    if (showComparison && skills.length > 0) {
      const interval = setInterval(() => {
        setDisplaySkills((prev) => {
          if (prev.length < skills.length) {
            return skills.slice(0, prev.length + 1)
          }
          clearInterval(interval)
          return prev
        })
      }, 400)

      return () => clearInterval(interval)
    }
  }, [showComparison, skills])

  // 倒计时
  useEffect(() => {
    if (!started || isComplete) return

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          setIsComplete(true)
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [started, isComplete])

  // 播放动作序列
  const playNextAction = useCallback(() => {
    if (isComplete) return

    const sequence = sequenceRef.current
    if (sequence.length === 0) {
      sequenceRef.current = generateSequence()
      sequenceIndexRef.current = 0
    }

    const current = sequence[sequenceIndexRef.current]
    if (!current) {
      sequenceRef.current = generateSequence()
      sequenceIndexRef.current = 0
      playNextAction()
      return
    }

    setCurrentAction(current.action)
    playSoundForAction(current.action)

    sequenceIndexRef.current++

    if (sequenceIndexRef.current >= sequence.length) {
      sequenceRef.current = generateSequence()
      sequenceIndexRef.current = 0
    }

    timeoutRef.current = setTimeout(playNextAction, current.duration)
  }, [isComplete])

  useEffect(() => {
    if (started && !isComplete) {
      sequenceRef.current = generateSequence()
      sequenceIndexRef.current = 0
      playNextAction()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [started, isComplete, playNextAction])

  // 完成后显示对比面板
  useEffect(() => {
    if (isComplete) {
      setCurrentAction('awakening')
      playSoundForAction('awakening')

      // 2秒后显示对比面板
      const timer = setTimeout(() => {
        setShowComparison(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isComplete])

  // 点击继续按钮
  const handleContinue = () => {
    onComplete()
  }

  // 开始按钮点击
  const handleStart = () => {
    initAudio()
    setStarted(true)
  }

  // 开始确认弹窗
  if (!started) {
    return (
      <div className="training-start-overlay">
        <div className="training-start-dialog">
          <h2>🥋 准备开始训练</h2>
          <p>用 {duration} 秒走完人类3-10年的成长之路</p>
          <button className="training-start-btn" onClick={handleStart}>
            开始修炼
          </button>
        </div>
      </div>
    )
  }

  // 分数对比面板
  if (showComparison) {
    const scoreDiff = afterScore - beforeScore
    const rankUp = beforeRank !== afterRank

    return (
      <div className="training-animation">
        <CodeRain opacity={0.5} />

        <div className="training-foreground">
          <div className="training-comparison-panel">
            {/* 标题 */}
            <div className="comparison-title">
              🎉 训练完成
            </div>

            {/* 分数对比 */}
            <div className="comparison-scores">
              {/* Before */}
              <div className="comparison-before">
                <div className="comparison-label">BEFORE</div>
                <div className="comparison-rank">{beforeRank}</div>
                <div className="comparison-score">{beforeScore}%</div>
              </div>

              {/* 箭头 */}
              <div className="comparison-arrow">→</div>

              {/* After */}
              <div className="comparison-after">
                <div className="comparison-label">AFTER</div>
                <div className="comparison-rank">{afterRank}</div>
                <div className="comparison-score">{displayScore}%</div>
              </div>
            </div>

            {/* 提升幅度 */}
            <div className="comparison-boost">
              <span className="boost-plus">+{scoreDiff}%</span>
              <span className="boost-text"> Boost</span>
              {rankUp && (
                <span className="boost-rankup">
                  {beforeRank} → {afterRank}
                </span>
              )}
            </div>

            {/* 获得技能 */}
            <div className="comparison-skills">
              {displaySkills.map((skill, index) => (
                <div
                  key={skill}
                  className="skill-tag"
                  style={{
                    opacity: index === displaySkills.length - 1 ? 1 : 0.6,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  I know {skill}.
                </div>
              ))}
            </div>

            {/* 确认按钮 */}
            <button className="comparison-continue-btn" onClick={handleContinue}>
              <span>✓</span>
              最后确认更新
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="training-animation">
      {/* 代码雨背景 */}
      <CodeRain />

      {/* 前景内容 */}
      <div className="training-foreground">
        <div className="training-center-box">
          <h1 className="training-title">员工段位快速升级中</h1>

          <div className={`training-countdown ${isComplete ? 'complete' : ''}`}>
            {isComplete ? (
              <>
                {agentName}，最勇敢的人就是一支完整队伍<br />
                训练完成！
              </>
            ) : (
              <>
                {agentName}，最勇敢的人就是一支完整队伍<br />
                本次训练还需要 <span className="training-timer">{countdown}</span> 秒
              </>
            )}
          </div>

          <div className="training-fighter-stage">
            <div className="training-ground-reflection" />
            <PixelFighter action={isComplete ? 'awakening' : currentAction} scale={0.5} />
          </div>
        </div>
      </div>

      {/* 底部署名 */}
      <div className="training-credits">
        Pixel Art: <a href="https://opengameart.org/content/rpg-asset-character-kung-fu-man-gameboy" target="_blank" rel="noopener noreferrer">Kung Fu Man NES</a> (CC0)
      </div>
    </div>
  )
}

export default TrainingAnimation
