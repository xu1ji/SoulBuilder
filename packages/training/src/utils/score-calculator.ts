/**
 * 训练分数计算器
 *
 * 基于「游戏化进阶系统设计.md」的渐进式分数增长模型
 *
 * 核心原则：
 * - 4-5 次训练达到 80+ 分
 * - 收益递减曲线
 * - 单次最大增幅限制
 */

import { AgentRank, calculateRank, RANK_THRESHOLDS } from '@soulbuilder/shared'

/**
 * 训练效果配置
 */
export const SCORE_CONFIG = {
  // 单次最大增幅
  MAX_SINGLE_BOOST: 25,

  // 基础增幅范围
  BASE_BOOST_MIN: 8,
  BASE_BOOST_MAX: 15,

  // 训练方式加成
  METHOD_BONUS: {
    describe: 1.0,      // 基准
    methodology: 1.3,   // 方法论加成 30%
    'case-study': 1.2,  // 案例学习加成 20%
    knowledge: 1.1,     // 知识库加成 10%
    scenario: 1.15,     // 场景调优加成 15%
  },

  // 收益递减系数（基于当前分数）
  DIMINISHING_RETURNS: {
    // 分数区间: 递减系数
    '0-30': 1.0,    // 无递减
    '30-50': 0.9,   // 10% 递减
    '50-70': 0.75,  // 25% 递减
    '70-85': 0.5,   // 50% 递减
    '85-95': 0.3,   // 70% 递减
    '95-100': 0.1,  // 90% 递减
  },

  // 首次训练加成
  FIRST_TRAINING_BONUS: 5,

  // 升段位保护（差一点就升段时的额外加成）
  RANK_UP_NUDGE: 3,
}

/**
 * 获取收益递减系数
 */
function getDiminishingFactor(score: number): number {
  if (score < 30) return SCORE_CONFIG.DIMINISHING_RETURNS['0-30']
  if (score < 50) return SCORE_CONFIG.DIMINISHING_RETURNS['30-50']
  if (score < 70) return SCORE_CONFIG.DIMINISHING_RETURNS['50-70']
  if (score < 85) return SCORE_CONFIG.DIMINISHING_RETURNS['70-85']
  if (score < 95) return SCORE_CONFIG.DIMINISHING_RETURNS['85-95']
  return SCORE_CONFIG.DIMINISHING_RETURNS['95-100']
}

/**
 * 计算下一次训练的分数增幅
 */
export function calculateScoreBoost(params: {
  currentScore: number
  method: 'describe' | 'methodology' | 'case-study' | 'knowledge' | 'scenario'
  isFirstTraining: boolean
  conversationQuality: 'low' | 'medium' | 'high'  // 对话质量评估
}): number {
  const { currentScore, method, isFirstTraining, conversationQuality } = params

  // 1. 基础增幅
  const baseRange = SCORE_CONFIG.BASE_BOOST_MAX - SCORE_CONFIG.BASE_BOOST_MIN
  const qualityFactor = conversationQuality === 'high' ? 1.0 :
                        conversationQuality === 'medium' ? 0.7 : 0.5
  const baseBoost = SCORE_CONFIG.BASE_BOOST_MIN + baseRange * qualityFactor

  // 2. 训练方式加成
  const methodBonus = SCORE_CONFIG.METHOD_BONUS[method]

  // 3. 收益递减
  const diminishingFactor = getDiminishingFactor(currentScore)

  // 4. 计算最终增幅
  let boost = Math.round(baseBoost * methodBonus * diminishingFactor)

  // 5. 首次训练加成
  if (isFirstTraining) {
    boost += SCORE_CONFIG.FIRST_TRAINING_BONUS
  }

  // 6. 升段位保护（差 3 分以内就升段）
  const nextRankThreshold = getNextRankThreshold(currentScore)
  if (nextRankThreshold && currentScore + boost < nextRankThreshold) {
    const gap = nextRankThreshold - currentScore
    if (gap <= 5 && gap > boost) {
      boost = gap + SCORE_CONFIG.RANK_UP_NUDGE
    }
  }

  // 7. 限制最大增幅
  boost = Math.min(boost, SCORE_CONFIG.MAX_SINGLE_BOOST)

  // 8. 确保不超过 100
  const finalScore = Math.min(currentScore + boost, 100)
  boost = finalScore - currentScore

  return Math.max(boost, 1) // 至少加 1 分
}

/**
 * 获取下一个段位的阈值
 */
function getNextRankThreshold(score: number): number | null {
  if (score >= RANK_THRESHOLDS.S) return null
  if (score >= RANK_THRESHOLDS.A) return RANK_THRESHOLDS.S
  if (score >= RANK_THRESHOLDS.B) return RANK_THRESHOLDS.A
  if (score >= RANK_THRESHOLDS.C) return RANK_THRESHOLDS.B
  if (score >= RANK_THRESHOLDS.D) return RANK_THRESHOLDS.C
  return RANK_THRESHOLDS.D
}

/**
 * 预测达到目标分数需要的训练次数
 */
export function estimateTrainingsNeeded(
  currentScore: number,
  targetScore: number,
  method: 'describe' | 'methodology' | 'case-study' | 'knowledge' | 'scenario' = 'methodology'
): number {
  let score = currentScore
  let trainings = 0

  // 模拟训练过程
  while (score < targetScore && trainings < 20) {
    const boost = calculateScoreBoost({
      currentScore: score,
      method,
      isFirstTraining: trainings === 0,
      conversationQuality: 'medium',
    })
    score += boost
    trainings++
  }

  return trainings
}

/**
 * 计算训练进度（到下一段位的进度百分比）
 */
export function calculateProgressToNextRank(currentScore: number): number {
  const currentRank = calculateRank(currentScore)
  const currentThreshold = RANK_THRESHOLDS[currentRank]

  let nextThreshold: number
  switch (currentRank) {
    case 'E': nextThreshold = RANK_THRESHOLDS.D; break
    case 'D': nextThreshold = RANK_THRESHOLDS.C; break
    case 'C': nextThreshold = RANK_THRESHOLDS.B; break
    case 'B': nextThreshold = RANK_THRESHOLDS.A; break
    case 'A': nextThreshold = RANK_THRESHOLDS.S; break
    case 'S': return 100 // 已满级
    default: nextThreshold = RANK_THRESHOLDS.D
  }

  const range = nextThreshold - currentThreshold
  const progress = currentScore - currentThreshold
  return Math.round((progress / range) * 100)
}

/**
 * 获取推荐的训练方式
 */
export function getRecommendedMethod(
  currentScore: number,
  currentRank: AgentRank
): 'describe' | 'methodology' | 'case-study' | 'knowledge' | 'scenario' {
  // 低分阶段：推荐方法论注入（最大加成）
  if (currentScore < 40) {
    return 'methodology'
  }

  // 中等分数：推荐案例学习或场景调优
  if (currentScore < 70) {
    return 'case-study'
  }

  // 高分阶段：推荐场景化精调
  return 'scenario'
}
