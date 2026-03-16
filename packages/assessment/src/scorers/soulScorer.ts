/**
 * SOUL.md 评分器
 *
 * 评分标准：
 * - 0-20: 文件不存在或 < 100 字符
 * - 20-40: 有 mission 但模糊（< 50 字）
 * - 40-60: mission 清晰，values 有 3+ 条
 * - 60-80: 有 boundaries，有哲学底色
 * - 80-100: 完整的灵魂宪法，有独特的 Vibe 定义
 */

import { BaseScorer, type ScorerResult } from './types'
import { parseMarkdown } from '../parsers'

export class SoulScorer extends BaseScorer {
  constructor() {
    super('soul')
  }

  score(content: string | null): ScorerResult {
    const fields: string[] = []
    const suggestions: string[] = []
    let score = 0

    // 文件不存在或内容过少
    if (!this.hasContent(content)) {
      suggestions.push('SOUL.md 文件不存在或为空')
      return { score: 0, fields, suggestions }
    }

    const parser = parseMarkdown(content!)
    const length = this.getContentLength(content)

    if (length < 100) {
      suggestions.push('内容过少，建议补充灵魂定义')
      return { score: Math.max(10, length / 5), fields, suggestions }
    }

    // === Mission 检查 ===

    const missionKeywords = ['mission', '使命', '核心任务', '我的使命', '职责']
    const missionSection = parser.extractSection('使命') || parser.extractSection('mission')

    if (this.containsKeywords(content, missionKeywords)) {
      fields.push('mission')
      score += 15

      // 检查 mission 深度
      if (missionSection && missionSection.content.length > 50) {
        score += 10
      }
    }

    // === Values 检查 ===

    const valuesKeywords = ['values', '价值观', '价值', '原则', 'principle']
    const valuesSection = parser.extractSection('价值') || parser.extractSection('values')

    if (this.containsKeywords(content, valuesKeywords)) {
      const listItems = parser.extractListItems()
      if (listItems.length >= 3) {
        fields.push('values')
        score += 15

        // 检查价值观深度
        const deepValues = listItems.filter(item => item.length > 15)
        if (deepValues.length >= 3) {
          score += 5
        }
      }
    } else {
      suggestions.push('建议添加 3 条以上核心价值观')
    }

    // === Boundaries 检查 ===

    const boundaryKeywords = ['boundaries', '边界', '底线', '不做', '禁止', '绝对']
    if (this.containsKeywords(content, boundaryKeywords)) {
      fields.push('boundaries')
      score += 15
    } else {
      suggestions.push('建议定义行为边界/底线')
    }

    // === 哲学底色检查 ===

    const philosophyKeywords = ['哲学', '理念', '信仰', '思想', '世界观', '视角']
    if (this.containsKeywords(content, philosophyKeywords)) {
      fields.push('哲学底色')
      score += 15
    }

    // 检查特殊深度概念
    const deepConcepts = ['永生', '长期主义', '200年', '对抗', '熵增', '演化']
    const deepCount = deepConcepts.filter(c => content!.includes(c)).length
    if (deepCount > 0) {
      fields.push('深度概念')
      score += deepCount * 5
    }

    // === Vibe/氛围检查 ===

    const vibeKeywords = ['vibe', '氛围', '气质', '调性', '味道']
    if (this.containsKeywords(content, vibeKeywords)) {
      fields.push('vibe')
      score += 10
    }

    // === 内容长度加分 ===

    if (length > 800) score += 10
    else if (length > 400) score += 5

    // 限制最大分数
    score = Math.min(100, score)

    return { score, fields, suggestions }
  }
}

export const soulScorer = new SoulScorer()
