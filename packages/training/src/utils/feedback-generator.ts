/**
 * 反馈生成器
 *
 * 基于「游戏化反馈设计.md」的专业 SaaS 风格反馈文案
 */

import { AgentRank } from '@soulbuilder/shared'
import {
  TrainingFeedback,
  Improvement,
  TrainingHistory,
  IMPROVEMENT_ICONS,
  IMPROVEMENT_LABELS,
} from '../types/feedback'
import { detectSurprises } from './surprise-detector'

/**
 * 段位升级文案
 */
const RANK_UP_COPY: Record<string, { title: string; message: string; suggestion: string }> = {
  'E->D': {
    title: '初具雏形',
    message: '从零开始，Agent 已具备基础工作能力。',
    suggestion: '继续训练可以进一步提升专业度。',
  },
  'D->C': {
    title: '专业上岗',
    message: 'Agent 已能独立处理大部分工作。',
    suggestion: '注入行业方法论可以更上一层楼。',
  },
  'C->B': {
    title: '专业可靠',
    message: 'Agent 已成为可信赖的工作伙伴。',
    suggestion: '针对性优化可以让它更贴合你的业务。',
  },
  'B->A': {
    title: '专业水准',
    message: 'Agent 已达到行业专业水准。',
    suggestion: '精细打磨可以让它成为你的最佳搭档。',
  },
  'A->S': {
    title: '顶级配置',
    message: 'Agent 已是顶尖配置，可以放心交付重要工作。',
    suggestion: '建议定期维护，保持最佳状态。',
  },
}

/**
 * 加分文案（按提升幅度）
 */
const SCORE_UP_COPY = {
  small: {
    title: '微调优化',
    message: '细节优化完成，Agent 在这个维度更加精准了。',
    suggestion: '继续训练可以更快提升整体水平。',
  },
  medium: {
    title: '稳步提升',
    message: '关键能力有了明显提升，Agent 更加可靠了。',
    suggestion: '针对性训练可以加速升级。',
  },
  large: {
    title: '显著进步',
    message: '这次训练效果显著，Agent 在核心能力上大幅提升。',
    suggestion: '已经接近升级，再训练 1-2 次即可升级。',
  },
  huge: {
    title: '质的飞跃',
    message: '训练效果超出预期，Agent 获得了突破性提升。',
    suggestion: '继续保持这个节奏，很快就能升级。',
  },
}

/**
 * 星级显示
 */
function getStars(rank: AgentRank): string {
  const starMap: Record<AgentRank, string> = {
    E: '☆☆☆☆☆',
    D: '★☆☆☆☆',
    C: '★★★☆☆',
    B: '★★★★☆',
    A: '★★★★★',
    S: '★★★★★✨',
  }
  return starMap[rank]
}

/**
 * 生成训练反馈
 */
export function generateTrainingFeedback(params: {
  agentName: string
  agentTitle: string
  oldScore: number
  newScore: number
  oldRank: AgentRank
  newRank: AgentRank
  methodologies: string[]
  styleChanges: string[]
  boundaries: string[]
  knowledge: string[]
  scenario: string
  history: TrainingHistory
}): TrainingFeedback {
  const {
    agentName,
    agentTitle,
    oldScore,
    newScore,
    oldRank,
    newRank,
    methodologies,
    styleChanges,
    boundaries,
    knowledge,
    scenario,
    history,
  } = params

  const scoreDiff = newScore - oldScore
  const rankUp = newRank !== oldRank

  // 生成提升点
  const improvements = generateImprovements({
    methodologies,
    styleChanges,
    boundaries,
    knowledge,
    scenario,
  })

  // 检测惊喜
  const surprises = detectSurprises({
    oldRank,
    newRank,
    oldScore,
    newScore,
    scoreDiff,
    methodologiesCount: methodologies.length + (history.totalMethodologies || 0),
    history,
  })

  // 选择文案
  const { title, message, suggestion } = selectCopy(rankUp, oldRank, newRank, scoreDiff)

  return {
    oldScore,
    newScore,
    scoreDiff,
    oldRank,
    newRank,
    rankUp,
    improvements,
    surprises,
    nextStepSuggestion: suggestion,
    title,
    message,
  }
}

/**
 * 生成提升点列表
 */
function generateImprovements(params: {
  methodologies: string[]
  styleChanges: string[]
  boundaries: string[]
  knowledge: string[]
  scenario: string
}): Improvement[] {
  const improvements: Improvement[] = []
  const { methodologies, styleChanges, boundaries, knowledge, scenario } = params

  // 方法论注入
  if (methodologies.length > 0) {
    improvements.push({
      type: 'methodology',
      icon: IMPROVEMENT_ICONS.methodology,
      label: IMPROVEMENT_LABELS.methodology,
      detail: `新增：${methodologies.join('、')}`,
    })
  }

  // 风格优化
  if (styleChanges.length > 0) {
    improvements.push({
      type: 'style',
      icon: IMPROVEMENT_ICONS.style,
      label: IMPROVEMENT_LABELS.style,
      detail: `调整为：${styleChanges.join('，')}`,
    })
  }

  // 边界明确
  if (boundaries.length > 0) {
    improvements.push({
      type: 'boundary',
      icon: IMPROVEMENT_ICONS.boundary,
      label: IMPROVEMENT_LABELS.boundary,
      detail: `新增：${boundaries.join('、')}`,
    })
  }

  // 知识补充
  if (knowledge.length > 0) {
    improvements.push({
      type: 'knowledge',
      icon: IMPROVEMENT_ICONS.knowledge,
      label: IMPROVEMENT_LABELS.knowledge,
      detail: `新增：${knowledge.join('、')}`,
    })
  }

  // 场景适配
  if (scenario) {
    improvements.push({
      type: 'scenario',
      icon: IMPROVEMENT_ICONS.scenario,
      label: IMPROVEMENT_LABELS.scenario,
      detail: `优化：${scenario}`,
    })
  }

  return improvements
}

/**
 * 选择文案
 */
function selectCopy(
  rankUp: boolean,
  oldRank: AgentRank,
  newRank: AgentRank,
  scoreDiff: number
): { title: string; message: string; suggestion: string } {
  if (rankUp) {
    // 段位升级文案
    const key = `${oldRank}->${newRank}`
    return RANK_UP_COPY[key] || RANK_UP_COPY['D->C']
  } else {
    // 加分文案（按提升幅度）
    if (scoreDiff <= 5) return SCORE_UP_COPY.small
    if (scoreDiff <= 10) return SCORE_UP_COPY.medium
    if (scoreDiff <= 20) return SCORE_UP_COPY.large
    return SCORE_UP_COPY.huge
  }
}

/**
 * 生成完成页面数据
 */
export function generateCompletionPageData(feedback: TrainingFeedback, agentName: string, agentTitle: string) {
  return {
    // Agent 信息
    agentName,
    agentTitle,

    // 分数变化
    beforeScore: feedback.oldScore,
    afterScore: feedback.newScore,
    scoreDiff: feedback.scoreDiff,

    // 段位变化
    beforeRank: feedback.oldRank,
    afterRank: feedback.newRank,
    beforeStars: getStars(feedback.oldRank),
    afterStars: getStars(feedback.newRank),

    // 是否升段
    rankUp: feedback.rankUp,

    // 标题和消息
    title: feedback.title,
    message: feedback.message,

    // 提升点
    improvements: feedback.improvements.map(imp => ({
      icon: imp.icon,
      label: imp.label,
      detail: imp.detail,
    })),

    // 惊喜
    surprises: feedback.surprises.map(s => ({
      icon: s.icon,
      name: s.name,
      description: s.description,
    })),

    // 下一步建议
    nextStep: feedback.nextStepSuggestion,
  }
}
