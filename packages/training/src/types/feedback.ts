/**
 * 训练反馈类型定义
 *
 * 基于「游戏化反馈设计.md」设计
 */

import { AgentRank } from '@soulbuilder/shared'

/**
 * 提升点类型
 */
export type ImprovementType =
  | 'methodology'   // 方法论注入
  | 'style'         // 风格优化
  | 'boundary'      // 边界明确
  | 'knowledge'     // 知识补充
  | 'scenario'      // 场景适配

/**
 * 提升点
 */
export interface Improvement {
  type: ImprovementType
  icon: string
  label: string
  detail: string
}

/**
 * 惊喜
 */
export interface Surprise {
  id: string
  name: string
  description: string
  icon: string
}

/**
 * 训练反馈
 */
export interface TrainingFeedback {
  // 基础信息
  oldScore: number
  newScore: number
  scoreDiff: number

  // 段位变化
  oldRank: AgentRank
  newRank: AgentRank
  rankUp: boolean  // 是否升段位

  // 提升点
  improvements: Improvement[]

  // 惊喜
  surprises: Surprise[]

  // 下一步建议
  nextStepSuggestion: string

  // 文案
  title: string
  message: string
}

/**
 * 训练历史（用于惊喜检测）
 */
export interface TrainingHistory {
  totalTrainings: number
  totalMethodologies: number
  lastTwoBoosts?: number[]
  lastTwoModes?: ('describe' | 'methodology' | 'case-study' | 'knowledge' | 'scenario')[]
  scenarioOptimizations: number
  rankHistory: AgentRank[]
}

/**
 * 惊喜类型
 */
export const SURPRISE_TYPES = {
  FIRST_TRAINING: 'first-training',
  PROFESSIONAL_CERTIFIED: 'professional-certified',
  GROWTH_RECORD: 'growth-record',
  QUANTUM_LEAP: 'quantum-leap',
  STEADY_GROWTH: 'steady-growth',
  HIGH_POTENTIAL: 'high-potential',
  METHODOLOGY_MASTER: 'methodology-master',
  PERFECTIONIST: 'perfectionist',
  SCENARIO_EXPERT: 'scenario-expert',
  MASTER_CERTIFIED: 'master-certified',
} as const

/**
 * 提升点图标映射
 */
export const IMPROVEMENT_ICONS: Record<ImprovementType, string> = {
  methodology: '📚',
  style: '✅',
  boundary: '🛡️',
  knowledge: '🧠',
  scenario: '🎯',
}

/**
 * 提升点标签映射
 */
export const IMPROVEMENT_LABELS: Record<ImprovementType, string> = {
  methodology: '方法论注入',
  style: '风格优化',
  boundary: '边界明确',
  knowledge: '知识补充',
  scenario: '场景适配',
}
