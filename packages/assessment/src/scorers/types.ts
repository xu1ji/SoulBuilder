/**
 * 评分器类型定义
 */

import type { AssessmentDetails } from '@soulbuilder/shared'

export interface ScorerResult {
  score: number           // 0-100
  fields: string[]        // 已填写的字段
  suggestions: string[]   // 改进建议
}

export type DimensionKey = 'identity' | 'soul' | 'user' | 'tools' | 'agents' | 'memory'

export type ScorerFunction = (content: string | null) => ScorerResult

/**
 * 评分器基础类
 */
export abstract class BaseScorer {
  protected dimension: DimensionKey

  constructor(dimension: DimensionKey) {
    this.dimension = dimension
  }

  abstract score(content: string | null): ScorerResult

  /**
   * 检查内容是否存在且非空
   */
  protected hasContent(content: string | null): content is string {
    return content !== null && content.trim().length > 0
  }

  /**
   * 获取内容长度
   */
  protected getContentLength(content: string | null): number {
    if (!content) return 0
    // 移除代码块后计算
    return content.replace(/```[\s\S]*?```/g, '').trim().length
  }

  /**
   * 检查是否包含关键词
   */
  protected containsKeywords(content: string | null, keywords: (string | RegExp)[]): boolean[] {
    if (!content) return keywords.map(() => false)
    return keywords.map(k => {
      if (typeof k === 'string') {
        return content.toLowerCase().includes(k.toLowerCase())
      }
      return k.test(content)
    })
  }

  /**
   * 统计关键词出现次数
   */
  protected countKeyword(content: string | null, keyword: string | RegExp): number {
    if (!content) return 0
    if (typeof keyword === 'string') {
      const regex = new RegExp(keyword, 'gi')
      return (content.match(regex) || []).length
    }
    return (content.match(keyword) || []).length
  }

  /**
   * 检查是否有模板占位符
   */
  protected hasPlaceholders(content: string | null): boolean {
    if (!content) return true
    const placeholderPatterns = [
      /\(to be configured\)/i,
      /\(待配置\)/,
      /\(待填写\)/,
      /\[待填写\]/,
      /TODO/i,
      /TBD/i,
    ]
    return placeholderPatterns.some(p => p.test(content))
  }
}
