/**
 * TOOLS.md 评分器
 *
 * 评分标准：
 * - 0-20: 文件不存在或 < 50 字符
 * - 20-40: 有工具列表但无说明
 * - 40-60: 有工具分类，有使用场景
 * - 60-80: 有使用规范，有权限定义
 * - 80-100: 完整的工具生态，有最佳实践
 */

import { BaseScorer, type ScorerResult } from './types'
import { parseMarkdown } from '../parsers'

export class ToolsScorer extends BaseScorer {
  constructor() {
    super('tools')
  }

  score(content: string | null): ScorerResult {
    const fields: string[] = []
    const suggestions: string[] = []
    let score = 0

    // 文件不存在或内容过少
    if (!this.hasContent(content)) {
      suggestions.push('TOOLS.md 文件不存在或为空')
      return { score: 0, fields, suggestions }
    }

    const parser = parseMarkdown(content!)
    const length = this.getContentLength(content)

    if (length < 50) {
      suggestions.push('内容过少，建议补充工具配置')
      return { score: Math.max(10, length / 3), fields, suggestions }
    }

    // === 工具列表检查 ===

    // 检查是否有列表形式的工具
    const listItems = parser.extractListItems()
    if (listItems.length >= 3) {
      fields.push('工具列表')
      score += 15
    }

    // 常见工具关键词
    const toolKeywords = [
      'read', 'write', 'search', 'exec', 'http', 'fetch',
      'browser', 'file', 'code', 'git', 'terminal',
      'web', 'api', 'database', 'memory'
    ]
    const foundTools = toolKeywords.filter(k =>
      this.containsKeywords(content, [k])
    )

    if (foundTools.length >= 3) {
      fields.push('工具定义')
      score += 10 + foundTools.length * 2
    }

    // === 工具分类 ===

    const categoryKeywords = ['分类', 'category', '类型', 'type', '本地', '远程']
    if (this.containsKeywords(content, categoryKeywords)) {
      fields.push('工具分类')
      score += 15
    }

    // === 使用规范 ===

    const guidelineKeywords = ['规范', 'guideline', '使用', 'usage', '规则', 'rule']
    if (this.containsKeywords(content, guidelineKeywords)) {
      fields.push('使用规范')
      score += 15
    } else {
      suggestions.push('建议添加工具使用规范')
    }

    // === 权限/安全 ===

    const securityKeywords = ['权限', 'permission', '安全', 'security', '限制', 'limit']
    if (this.containsKeywords(content, securityKeywords)) {
      fields.push('权限定义')
      score += 15
    }

    // === 最佳实践 ===

    const practiceKeywords = ['最佳', 'best practice', '推荐', 'recommend', '注意']
    if (this.containsKeywords(content, practiceKeywords)) {
      fields.push('最佳实践')
      score += 10
    }

    // === 代码示例 ===

    const codeBlocks = parser.extractCodeBlocks()
    if (codeBlocks.length > 0) {
      fields.push('代码示例')
      score += 10
    }

    // === 内容长度加分 ===

    if (length > 300) score += 10
    else if (length > 100) score += 5

    // 限制最大分数
    score = Math.min(100, score)

    return { score, fields, suggestions }
  }
}

export const toolsScorer = new ToolsScorer()
