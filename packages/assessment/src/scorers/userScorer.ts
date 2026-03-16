/**
 * USER.md 评分器
 *
 * 评分标准：
 * - 0-20: 文件不存在或几乎为空（大量占位符）
 * - 20-40: 有基础信息但大量是模板
 * - 40-60: 基本信息完整，有沟通偏好
 * - 60-80: 有决策风格、工作习惯
 * - 80-100: 深度了解雇主，有盲区、期望定义
 */

import { BaseScorer, type ScorerResult } from './types'
import { parseMarkdown } from '../parsers'

export class UserScorer extends BaseScorer {
  constructor() {
    super('user')
  }

  score(content: string | null): ScorerResult {
    const fields: string[] = []
    const suggestions: string[] = []
    let score = 0

    // 文件不存在或内容过少
    if (!this.hasContent(content)) {
      suggestions.push('USER.md 文件不存在或为空')
      return { score: 0, fields, suggestions }
    }

    const parser = parseMarkdown(content!)
    const length = this.getContentLength(content)

    // 检查是否大量占位符
    const placeholderCount = this.countPlaceholderOccurrences(content!)
    if (placeholderCount > 5) {
      suggestions.push('USER.md 存在大量模板占位符，建议填写真实信息')
      return { score: Math.min(20, length / 10), fields, suggestions }
    }

    if (length < 100) {
      suggestions.push('内容过少，建议补充雇主信息')
      return { score: Math.max(10, length / 5), fields, suggestions }
    }

    // === 基础信息检查 ===

    const basicInfoKeywords = ['name', '名字', '公司', 'company', '行业', 'industry']
    if (this.containsKeywords(content, basicInfoKeywords)) {
      fields.push('基础信息')
      score += 15
    } else {
      suggestions.push('建议添加雇主基础信息')
    }

    // === 角色与职责 ===

    const roleKeywords = ['角色', 'role', '职责', 'responsibilit', '工作']
    if (this.containsKeywords(content, roleKeywords)) {
      fields.push('角色职责')
      score += 10
    }

    // === 沟通偏好 ===

    const commKeywords = ['沟通', 'communicat', '偏好', 'preference', '风格', '联系']
    if (this.containsKeywords(content, commKeywords)) {
      fields.push('沟通偏好')
      score += 15
    } else {
      suggestions.push('建议定义沟通偏好')
    }

    // === 决策风格 ===

    const decisionKeywords = ['决策', 'decision', '风格', '习惯', '风格']
    if (this.containsKeywords(content, decisionKeywords)) {
      fields.push('决策风格')
      score += 15
    }

    // === 工作习惯 ===

    const habitKeywords = ['习惯', 'habit', '时间', '工作', '工作方式']
    if (this.containsKeywords(content, habitKeywords)) {
      fields.push('工作习惯')
      score += 10
    }

    // === 深度信息 ===

    // 盲区/弱点
    const blindSpotKeywords = ['盲区', '弱点', '不足', '避免', '痛点']
    if (this.containsKeywords(content, blindSpotKeywords)) {
      fields.push('盲区意识')
      score += 15
    }

    // 期望/目标
    const expectationKeywords = ['期望', 'expectation', '目标', 'goal', '希望']
    if (this.containsKeywords(content, expectationKeywords)) {
      fields.push('期望目标')
      score += 10
    }

    // === 内容长度加分 ===

    if (length > 500) score += 10
    else if (length > 200) score += 5

    // 限制最大分数
    score = Math.min(100, score)

    return { score, fields, suggestions }
  }

  private countPlaceholderOccurrences(content: string): number {
    const placeholderPatterns = [
      /\(to be configured\)/gi,
      /\(待配置\)/g,
      /\(待填写\)/g,
      /\[待填写\]/g,
      /TODO/gi,
      /TBD/gi,
      'N/A',
      '...',
    ]

    let count = 0
    for (const pattern of placeholderPatterns) {
      const matches = content.match(pattern)
      if (matches) {
        count += matches.length
      }
    }
    return count
  }
}

export const userScorer = new UserScorer()
