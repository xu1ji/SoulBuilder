/**
 * IDENTITY.md 评分器
 *
 * 评分标准：
 * - 0-20: 文件不存在或 < 100 字符
 * - 20-40: 有 name + title，但 traits/style 缺失或 < 3 条
 * - 40-60: 基本信息完整，traits 有 3+ 条
 * - 60-80: traits 有深度描述（每条 > 20 字），style 明确
 * - 80-100: 有哲学底色，与其他 Agent 的关系明确
 */

import { BaseScorer, type ScorerResult } from './types'
import { parseMarkdown } from '../parsers'

export class IdentityScorer extends BaseScorer {
  constructor() {
    super('identity')
  }

  score(content: string | null): ScorerResult {
    const fields: string[] = []
    const suggestions: string[] = []
    let score = 0

    // 文件不存在或内容过少
    if (!this.hasContent(content)) {
      suggestions.push('IDENTITY.md 文件不存在或为空')
      return { score: 0, fields, suggestions }
    }

    const parser = parseMarkdown(content!)
    const length = this.getContentLength(content)

    if (length < 100) {
      suggestions.push('内容过少，建议补充更多身份描述')
      return { score: Math.max(10, length / 5), fields, suggestions }
    }

    // === 基础字段检查 ===

    // 检查 name
    if (parser.containsKeywords(content, ['name', '名字', '名称'])) {
      fields.push('name')
      score += 10
    } else {
      suggestions.push('建议添加 name 字段')
    }

    // 检查 title/岗位
    if (parser.containsKeywords(content, ['title', '岗位', '职位', '角色'])) {
      fields.push('title')
      score += 10
    } else {
      suggestions.push('建议添加 title/岗位 字段')
    }

    // === 特质检查 ===

    // 检查 traits/特质
    const traitKeywords = ['trait', '特质', '特点', '性格', 'personality']
    const hasTraits = this.containsKeywords(content, traitKeywords)
    const traitItems = parser.extractListItems()

    // 过滤出可能是特质的列表项
    const traitListItems = traitItems.filter(item =>
      traitKeywords.some(k => item.toLowerCase().includes(k.toLowerCase())) ||
      parser.countKeyword(item, /[，。；]/) >= 0 // 包含标点的描述性文字
    )

    if (hasTraits || traitListItems.length >= 3) {
      fields.push('traits')
      score += 15

      // 检查特质深度（每个特质描述 > 20 字）
      const deepTraits = traitListItems.filter(item => item.length > 20)
      if (deepTraits.length >= 3) {
        score += 10
      }
    } else {
      suggestions.push('建议添加 3 条以上核心特质')
    }

    // === 风格检查 ===

    const styleKeywords = ['style', '风格', '语态', '说话', '沟通']
    if (this.containsKeywords(content, styleKeywords)) {
      fields.push('style')
      score += 10
    } else {
      suggestions.push('建议定义沟通风格/语态')
    }

    // === 深度内容 ===

    // 检查禁用语/必用语（语态定义）
    if (parser.containsKeywords(content, ['禁用', '禁止', '不要', 'never'])) {
      fields.push('禁止用语')
      score += 5
    }
    if (parser.containsKeywords(content, ['必用', '必须', '要用', 'always'])) {
      fields.push('必用表达')
      score += 5
    }

    // 检查与其他 Agent 的关系
    if (parser.containsKeywords(content, ['协作', '关系', '向', '汇报', 'partner'])) {
      fields.push('协作关系')
      score += 10
    }

    // 检查哲学底色/理念
    if (parser.containsKeywords(content, ['哲学', '理念', '信仰', '价值观', '使命'])) {
      fields.push('哲学底色')
      score += 10
    }

    // === 内容长度加分 ===

    if (length > 500) score += 10
    else if (length > 200) score += 5

    // 限制最大分数
    score = Math.min(100, score)

    return { score, fields, suggestions }
  }
}

export const identityScorer = new IdentityScorer()
