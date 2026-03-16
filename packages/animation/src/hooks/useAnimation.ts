/**
 * 动画控制 hook - 管理阶段切换和进度
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { AnimationPhase } from '@soulbuilder/shared'
import type { PhaseConfig, FighterAction } from '../types'
import { ANIMATION_PHASES_CONFIG, TRAINING_ACTIONS } from '../constants/frames'

interface UseAnimationOptions {
  onPhaseChange?: (phase: AnimationPhase, progress: number) => void
  onComplete: () => void
}

interface UseAnimationReturn {
  currentPhase: AnimationPhase
  phaseProgress: number      // 0-100 当前阶段进度
  totalProgress: number      // 0-100 总进度
  currentAction: FighterAction
  fighterVisible: boolean
  currentLabel: string
  isComplete: boolean
  isSkipped: boolean
  skip: () => void
  restart: () => void
}

/**
 * 动画控制 hook
 */
export function useAnimation(options: UseAnimationOptions): UseAnimationReturn {
  const { onPhaseChange, onComplete } = options

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)
  const [trainingActionIndex, setTrainingActionIndex] = useState(0)

  const startTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>()

  const currentConfig = ANIMATION_PHASES_CONFIG[currentPhaseIndex]
  const currentPhase = currentConfig?.phase ?? 'complete'
  const totalDuration = ANIMATION_PHASES_CONFIG.reduce((sum, p) => sum + p.duration, 0)

  // 获取当前阶段配置
  const getCurrentConfig = useCallback((): PhaseConfig => {
    return ANIMATION_PHASES_CONFIG[currentPhaseIndex] ?? ANIMATION_PHASES_CONFIG[ANIMATION_PHASES_CONFIG.length - 1]
  }, [currentPhaseIndex])

  // 计算总进度
  const calculateTotalProgress = useCallback((phaseIdx: number, phaseProg: number): number => {
    let elapsed = 0
    for (let i = 0; i < phaseIdx; i++) {
      elapsed += ANIMATION_PHASES_CONFIG[i].duration
    }
    const currentPhaseDuration = ANIMATION_PHASES_CONFIG[phaseIdx]?.duration ?? 0
    elapsed += (currentPhaseDuration * phaseProg) / 100
    return (elapsed / totalDuration) * 100
  }, [totalDuration])

  // 跳过动画
  const skip = useCallback(() => {
    setIsSkipped(true)
    setIsComplete(true)

    // 清除动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // 触发回调
    onPhaseChange?.('complete', 100)

    // 延迟触发 onComplete，让用户看到完成状态
    setTimeout(() => {
      onComplete()
    }, 500)
  }, [onPhaseChange, onComplete])

  // 重新开始
  const restart = useCallback(() => {
    setCurrentPhaseIndex(0)
    setPhaseProgress(0)
    setIsComplete(false)
    setIsSkipped(false)
    setTrainingActionIndex(0)
    startTimeRef.current = 0
  }, [])

  // 动画循环
  useEffect(() => {
    if (isComplete || isSkipped) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const config = getCurrentConfig()
      const { phase, duration, action, fighterVisible } = config

      // 计算已过时间
      let elapsed = 0
      for (let i = 0; i < currentPhaseIndex; i++) {
        elapsed += ANIMATION_PHASES_CONFIG[i].duration
      }
      elapsed += timestamp - startTimeRef.current

      // 计算阶段内进度
      const phaseElapsed = timestamp - startTimeRef.current
      const progress = duration > 0 ? Math.min((phaseElapsed / duration) * 100, 100) : 100
      setPhaseProgress(progress)

      // 计算总进度
      const totalProg = calculateTotalProgress(currentPhaseIndex, progress)

      // 触发回调
      onPhaseChange?.(phase, totalProg)

      // 训练阶段随机切换动作
      if (phase === 'training' && phaseElapsed > 0) {
        const actionInterval = 800 // 每 800ms 换一个动作
        const newActionIndex = Math.floor(phaseElapsed / actionInterval) % TRAINING_ACTIONS.length
        if (newActionIndex !== trainingActionIndex) {
          setTrainingActionIndex(newActionIndex)
        }
      }

      // 检查是否进入下一阶段
      if (duration > 0 && phaseElapsed >= duration) {
        const nextIndex = currentPhaseIndex + 1
        if (nextIndex < ANIMATION_PHASES_CONFIG.length) {
          setCurrentPhaseIndex(nextIndex)
          startTimeRef.current = timestamp
          setPhaseProgress(0)
        } else {
          // 动画完成
          setIsComplete(true)
          setPhaseProgress(100)
          onPhaseChange?.('complete', 100)

          // 完成后延迟触发 onComplete
          setTimeout(() => {
            onComplete()
          }, 1000)
          return
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [currentPhaseIndex, isComplete, isSkipped, getCurrentConfig, onPhaseChange, onComplete, calculateTotalProgress, trainingActionIndex])

  // 获取当前动作
  const getCurrentAction = (): FighterAction => {
    const config = getCurrentConfig()
    if (config.phase === 'training') {
      return TRAINING_ACTIONS[trainingActionIndex]
    }
    return config.action
  }

  // 计算总进度
  const totalProgress = calculateTotalProgress(currentPhaseIndex, phaseProgress)

  return {
    currentPhase,
    phaseProgress,
    totalProgress,
    currentAction: getCurrentAction(),
    fighterVisible: getCurrentConfig().fighterVisible,
    currentLabel: getCurrentConfig().label,
    isComplete,
    isSkipped,
    skip,
    restart,
  }
}

/**
 * 获取指定阶段索引
 */
export function getPhaseIndex(phase: AnimationPhase): number {
  return ANIMATION_PHASES_CONFIG.findIndex(p => p.phase === phase)
}
