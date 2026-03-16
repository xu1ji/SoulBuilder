/**
 * 评分引擎
 * 整合所有评分器，生成综合评估结果
 */

import type {
  AssessmentDimensions,
  AssessmentDetails,
} from '@soulbuilder/shared'
import type { WorkspaceFiles } from '../parsers'
import type { ScorerResult, DimensionKey } from './types'
import { identityScorer } from './identityScorer'
import { soulScorer } from './soulScorer'
import { userScorer } from './userScorer'
import { toolsScorer } from './toolsScorer'
import { agentsScorer } from './agentsScorer'
import { memoryScorer } from './memoryScorer'

export interface ScoringResult {
  dimensions: AssessmentDimensions
  details: AssessmentDetails
}

export class ScoringEngine {
  /**
   * 对所有维度进行评分
   */
  scoreAll(files: WorkspaceFiles): ScoringResult {
    const results: Record<DimensionKey, ScorerResult> = {
      identity: identityScorer.score(files.identity || null),
      soul: soulScorer.score(files.soul || null),
      user: userScorer.score(files.user || null),
      tools: toolsScorer.score(files.tools || null),
      agents: agentsScorer.score(files.agents || null),
      memory: memoryScorer.score(files.memory || null),
    }

    const dimensions: AssessmentDimensions = {
      identity: results.identity.score,
      soul: results.soul.score,
      user: results.user.score,
      tools: results.tools.score,
      agents: results.agents.score,
      memory: results.memory.score,
    }

    const details: AssessmentDetails = {
      identityFields: results.identity.fields,
      soulFields: results.soul.fields,
      userFields: results.user.fields,
      toolsFields: results.tools.fields,
      agentsFields: results.agents.fields,
      memoryFields: results.memory.fields,
      suggestions: this.aggregateSuggestions(results),
    }

    return { dimensions, details }
  }

  /**
   * 对单个维度进行评分
   */
  scoreDimension(dimension: DimensionKey, content: string | null): ScorerResult {
    switch (dimension) {
      case 'identity':
        return identityScorer.score(content)
      case 'soul':
        return soulScorer.score(content)
      case 'user':
        return userScorer.score(content)
      case 'tools':
        return toolsScorer.score(content)
      case 'agents':
        return agentsScorer.score(content)
      case 'memory':
        return memoryScorer.score(content)
      default:
        return { score: 0, fields: [], suggestions: ['未知维度'] }
    }
  }

  /**
   * 汇总所有建议
   */
  private aggregateSuggestions(results: Record<DimensionKey, ScorerResult>): string[] {
    const allSuggestions: string[] = []

    for (const [dimension, result] of Object.entries(results)) {
      if (result.suggestions.length > 0) {
        for (const suggestion of result.suggestions) {
          allSuggestions.push(`[${dimension}] ${suggestion}`)
        }
      }
    }

    // 按优先级排序（分数低的维度优先）
    return allSuggestions
  }

  /**
   * 获取评分摘要
   */
  getSummary(dimensions: AssessmentDimensions): {
    strongest: DimensionKey
    weakest: DimensionKey
    average: number
  } {
    const entries = Object.entries(dimensions) as [DimensionKey, number][]
    const sorted = entries.sort((a, b) => b[1] - a[1])

    const strongest = sorted[0][0]
    const weakest = sorted[sorted.length - 1][0]
    const average = entries.reduce((sum, [, score]) => sum + score, 0) / entries.length

    return { strongest, weakest, average }
  }
}

export const scoringEngine = new ScoringEngine()
