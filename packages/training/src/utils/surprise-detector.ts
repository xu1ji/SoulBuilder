/**
 * 惊喜检测器
 *
 * 基于「游戏化反馈设计.md」的 10 个惊喜触点
 */

import { AgentRank } from '@soulbuilder/shared'
import { Surprise, TrainingHistory, SURPRISE_TYPES } from '../types/feedback'

/**
 * 惊喜定义
 */
const SURPRISE_DEFINITIONS = {
  [SURPRISE_TYPES.FIRST_TRAINING]: {
    name: '首次升级',
    description: '恭喜完成首次训练！Agent 已有雏形。',
    icon: '🎉',
  },
  [SURPRISE_TYPES.PROFESSIONAL_CERTIFIED]: {
    name: '专业认证',
    description: 'Agent 已具备专业工作能力。',
    icon: '🏆',
  },
  [SURPRISE_TYPES.GROWTH_RECORD]: {
    name: '成长记录',
    description: '3 次训练，见证蜕变！',
    icon: '📈',
  },
  [SURPRISE_TYPES.QUANTUM_LEAP]: {
    name: '质的飞跃',
    description: '这次训练效果显著！',
    icon: '🚀',
  },
  [SURPRISE_TYPES.STEADY_GROWTH]: {
    name: '稳定成长',
    description: '正在稳步变强！',
    icon: '💪',
  },
  [SURPRISE_TYPES.HIGH_POTENTIAL]: {
    name: '潜力股',
    description: '进步神速，未来可期！',
    icon: '💎',
  },
  [SURPRISE_TYPES.METHODOLOGY_MASTER]: {
    name: '方法论大师',
    description: '已掌握多种专业框架！',
    icon: '📚',
  },
  [SURPRISE_TYPES.PERFECTIONIST]: {
    name: '完美主义',
    description: '追求卓越！',
    icon: '✨',
  },
  [SURPRISE_TYPES.SCENARIO_EXPERT]: {
    name: '场景专家',
    description: '已深度适配业务场景！',
    icon: '🎯',
  },
  [SURPRISE_TYPES.MASTER_CERTIFIED]: {
    name: '大师认证',
    description: '已达到专业级别，可放心使用！',
    icon: '👑',
  },
}

/**
 * 检测触发的惊喜
 */
export function detectSurprises(params: {
  oldRank: AgentRank
  newRank: AgentRank
  oldScore: number
  newScore: number
  scoreDiff: number
  methodologiesCount: number
  history: TrainingHistory
}): Surprise[] {
  const { oldRank, newRank, oldScore, scoreDiff, methodologiesCount, history } = params
  const surprises: Surprise[] = []

  // 1. 🎉 首次训练
  if (history.totalTrainings === 0) {
    surprises.push(createSurprise(SURPRISE_TYPES.FIRST_TRAINING))
  }

  // 2. 🏆 专业认证（首次达到 C 级）
  if ((oldRank === 'D' || oldRank === 'E') && newRank === 'C') {
    surprises.push(createSurprise(SURPRISE_TYPES.PROFESSIONAL_CERTIFIED))
  }

  // 3. 📈 成长记录（累计训练 3 次）
  if (history.totalTrainings === 2) { // 这次是第 3 次
    surprises.push(createSurprise(SURPRISE_TYPES.GROWTH_RECORD))
  }

  // 4. 🚀 质的飞跃（单次 +20 分以上）
  if (scoreDiff >= 20) {
    surprises.push(createSurprise(SURPRISE_TYPES.QUANTUM_LEAP))
  }

  // 5. 💪 稳定成长（历史连续两次 +10 以上）
  if (history.lastTwoBoosts && history.lastTwoBoosts.length >= 2) {
    const allBoosts = [...history.lastTwoBoosts, scoreDiff]
    if (allBoosts.slice(-2).every(b => b >= 10)) {
      surprises.push(createSurprise(SURPRISE_TYPES.STEADY_GROWTH))
    }
  }

  // 6. 💎 潜力股（从 E 到 C 少于 3 次训练）
  if (oldScore < 40 && newRank === 'C' && history.totalTrainings <= 2) {
    surprises.push(createSurprise(SURPRISE_TYPES.HIGH_POTENTIAL))
  }

  // 7. 📚 方法论大师（累计注入 5 个方法论）
  if (methodologiesCount >= 5 &&
      !hasSurprise(surprises, SURPRISE_TYPES.METHODOLOGY_MASTER)) {
    surprises.push(createSurprise(SURPRISE_TYPES.METHODOLOGY_MASTER))
  }

  // 8. ✨ 完美主义（连续两次精调优化）
  if (history.lastTwoModes &&
      history.lastTwoModes.length >= 1 &&
      history.lastTwoModes[history.lastTwoModes.length - 1] === 'scenario') {
    surprises.push(createSurprise(SURPRISE_TYPES.PERFECTIONIST))
  }

  // 9. 🎯 场景专家（针对同一场景优化 3 次）
  if (history.scenarioOptimizations >= 2) { // 这次是第 3 次
    surprises.push(createSurprise(SURPRISE_TYPES.SCENARIO_EXPERT))
  }

  // 10. 👑 大师认证（首次达到 A 级）
  if (newRank === 'A' && oldRank !== 'A') {
    surprises.push(createSurprise(SURPRISE_TYPES.MASTER_CERTIFIED))
  }

  return surprises
}

/**
 * 创建惊喜对象
 */
function createSurprise(type: string): Surprise {
  const def = SURPRISE_DEFINITIONS[type as keyof typeof SURPRISE_DEFINITIONS]
  return {
    id: type,
    name: def.name,
    description: def.description,
    icon: def.icon,
  }
}

/**
 * 检查是否已有该惊喜
 */
function hasSurprise(surprises: Surprise[], id: string): boolean {
  return surprises.some(s => s.id === id)
}
