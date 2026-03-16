/**
 * @soulbuilder/animation
 * SoulBuilder 2.0 仪式感训练动画
 */

// 主组件
export { TrainingAnimation } from './components/TrainingAnimation'

// 子组件
export { CodeRain } from './components/CodeRain'
export { PixelFighter } from './components/PixelFighter'
export { ProgressOverlay } from './components/ProgressOverlay'
export { BeforeAfterComparison } from './components/BeforeAfterComparison'
export { SkipButton } from './components/SkipButton'

// Hooks
export { useAnimation, useCanvas, useCanvasRef } from './hooks'

// 常量
export { FIGHTER_FRAMES, FRAME_CONFIG, ANIMATION_PHASES_CONFIG, TRAINING_ACTIONS } from './constants/frames'

// 类型
export type {
  FighterAction,
  CodeRainProps,
  PixelFighterProps,
  ProgressOverlayProps,
  BeforeAfterComparisonProps,
  SkipButtonProps,
  TrainingAnimationProps,
  PhaseConfig,
  PixelFrame,
  FighterFrames,
} from './types'
