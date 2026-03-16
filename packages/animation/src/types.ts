/**
 * @soulbuilder/animation - 类型定义
 */

import type { AgentRank, AnimationPhase } from '@soulbuilder/shared'

// 重新导出 shared 中的类型
export type { AgentRank, AnimationPhase }

/**
 * 小人动作类型
 */
export type FighterAction = 'idle' | 'punch' | 'kick' | 'stance' | 'flip' | 'meditate' | 'awaken'

/**
 * 代码雨 Props
 */
export interface CodeRainProps {
  opacity?: number    // 0-1，默认 1
  speed?: number      // 0.5-1.5，默认 1
  density?: number    // 0.5-1.5，默认 1
}

/**
 * 像素小人 Props
 */
export interface PixelFighterProps {
  action: FighterAction
  visible?: boolean   // 默认 true
  scale?: number      // 缩放比例，默认 1
}

/**
 * 进度覆盖层 Props
 */
export interface ProgressOverlayProps {
  phase: AnimationPhase
  progress: number    // 0-100
  skill?: string      // 当前技能（complete 阶段显示）
}

/**
 * Before/After 对比 Props
 */
export interface BeforeAfterComparisonProps {
  before: {
    score: number
    rank: AgentRank
  }
  after: {
    score: number
    rank: AgentRank
  }
  skills: string[]
}

/**
 * 跳过按钮 Props
 */
export interface SkipButtonProps {
  onClick: () => void
  visible?: boolean
}

/**
 * 主组件 Props
 */
export interface TrainingAnimationProps {
  config: {
    skills: string[]          // 技能名称数组
    beforeScore: number       // 训练前分数
    afterScore: number        // 训练后分数
    beforeRank: AgentRank     // 训练前等级
    afterRank: AgentRank      // 训练后等级
  }
  onComplete: () => void      // 完成回调（必调）
  onPhaseChange?: (phase: AnimationPhase, progress: number) => void
  skippable?: boolean         // 默认 true
}

/**
 * 动画阶段配置
 */
export interface PhaseConfig {
  phase: AnimationPhase
  duration: number   // 毫秒
  action: FighterAction
  fighterVisible: boolean
  label: string
}

/**
 * 像素帧数据类型
 */
export type PixelFrame = [number, number][]  // [x, y] 坐标数组

/**
 * 动作帧数据映射
 */
export type FighterFrames = Record<FighterAction, PixelFrame[]>
