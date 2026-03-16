/**
 * MEMORY.md 评分器
 *
 * 评分标准：
 * - 0-20: 文件不存在或 < 30 字符
 * - 20-40: 有基础描述但无策略
 * - 40-60: 有记忆策略定义
 * - 60-80: 有分层存储，有回写规则
 * - 80-100: 完整的记忆管理生态
 */

import { BaseScorer, type ScorerResult } from './types'
import { parseMarkdown } from '../parsers'

export class MemoryScorer extends BaseScorer {
  constructor() {
    super('memory')
  }

  score(content: string | null): ScorerResult {
    const fields: string[] = []
    const suggestions: string[] = []
    let score = 0

    // 文件不存在或内容过少
    if (!this.hasContent(content)) {
      suggestions.push('MEMORY.md 文件不存在或为空')
      return { score: 0, fields, suggestions }
    }

    const parser = parseMarkdown(content!)
    const length = this.getContentLength(content)

    if (length < 30) {
      suggestions.push('内容过少，建议补充记忆策略')
      return { score: Math.max(10, length / 3), fields, suggestions }
    }

    // === 记忆策略 ===

    const strategyKeywords = ['策略', 'strategy', '记忆', 'memory', '存储', 'store']
    if (this.containsKeywords(content, strategyKeywords)) {
      fields.push('记忆策略')
      score += 20
    } else {
      suggestions.push('建议定义记忆存储策略')
    }

    // === 分层存储 ===

    const layerKeywords = ['分层', 'layer', '短期', 'short', '长期', 'long', '工作', 'working']
    if (this.containsKeywords(content, layerKeywords)) {
      fields.push('分层存储')
      score += 20
    }

    // === 回写规则 ===

    const writeKeywords = ['回写', 'write', '更新', 'update', '保存', 'save', '持久化', 'persist']
    if (this.containsKeywords(content, writeKeywords)) {
      fields.push('回写规则')
      score += 15
    }

    // === 知识库 ===

    const knowledgeKeywords = ['知识库', 'knowledge', '文档', 'document', '资料', 'reference']
    if (this.containsKeywords(content, knowledgeKeywords)) {
      fields.push('知识库')
      score += 15
    }

    // === 遗忘策略 ===

    const forgetKeywords = ['遗忘', 'forget', '清理', 'clean', '过期', 'expire', '删除', 'delete']
    if (this.containsKeywords(content, forgetKeywords)) {
      fields.push('遗忘策略')
      score += 10
    }

    // === 文件路径 ===

    const pathKeywords = ['.md', '.json', 'path', '路径', '目录', 'directory']
    if (this.containsKeywords(content, pathKeywords)) {
      fields.push('文件路径')
      score += 5
    }

    // === 内容长度加分 ===

    if (length > 200) score += 10
    else if (length > 80) score += 5

    // 限制最大分数
    score = Math.min(100, score)

    return { score, fields, suggestions }
  }
}

export const memoryScorer = new MemoryScorer()
