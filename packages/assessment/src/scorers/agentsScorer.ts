/**
 * AGENTS.md 评分器
 *
 * 评分标准：
 * - 0-20: 文件不存在或 < 50 字符
 * - 20-40: 有基础协议但无协作关系
 * - 40-60: 有与其他 Agent 的关系定义
 * - 60-80: 有协作流程，有转交规则
 * - 80-100: 完整的多 Agent 协作生态
 */

import { BaseScorer, type ScorerResult } from './types'
import { parseMarkdown } from '../parsers'

export class AgentsScorer extends BaseScorer {
  constructor() {
    super('agents')
  }

  score(content: string | null): ScorerResult {
    const fields: string[] = []
    const suggestions: string[] = []
    let score = 0

    // 文件不存在或内容过少
    if (!this.hasContent(content)) {
      suggestions.push('AGENTS.md 文件不存在或为空')
      return { score: 0, fields, suggestions }
    }

    const parser = parseMarkdown(content!)
    const length = this.getContentLength(content)

    if (length < 50) {
      suggestions.push('内容过少，建议补充协作协议')
      return { score: Math.max(10, length / 3), fields, suggestions }
    }

    // === 启动协议 ===

    const startupKeywords = ['启动', 'startup', '初始化', 'init', '启动流程', 'boot']
    if (this.containsKeywords(content, startupKeywords)) {
      fields.push('启动协议')
      score += 15
    }

    // === 协作关系 ===

    const collabKeywords = [
      '协作', 'collab', '合作', 'partner', '配合',
      '汇报', 'report', '对接', '向', '负责'
    ]
    if (this.containsKeywords(content, collabKeywords)) {
      fields.push('协作关系')
      score += 20
    } else {
      suggestions.push('建议定义与其他 Agent 的协作关系')
    }

    // 检查是否提到其他 Agent 名字
    const agentNames = ['trumind', 'gates', 'emily', 'grace', 'olivia', 'eason', 'eric', 'summer', 'stella', 'cynthia']
    const mentionedAgents = agentNames.filter(name =>
      content!.toLowerCase().includes(name)
    )
    if (mentionedAgents.length >= 2) {
      fields.push('具体协作对象')
      score += 10
    }

    // === 转交规则 ===

    const handoffKeywords = ['转交', 'handoff', '转给', '交给', '委托', 'delegate']
    if (this.containsKeywords(content, handoffKeywords)) {
      fields.push('转交规则')
      score += 15
    }

    // === 群聊行为 ===

    const channelKeywords = ['群聊', 'channel', '群组', 'group', '成员', 'member']
    if (this.containsKeywords(content, channelKeywords)) {
      fields.push('群聊行为')
      score += 10
    }

    // === 工作流程 ===

    const workflowKeywords = ['流程', 'workflow', '步骤', 'step', '顺序', 'sequence']
    if (this.containsKeywords(content, workflowKeywords)) {
      fields.push('工作流程')
      score += 15
    }

    // === 代码示例 ===

    const codeBlocks = parser.extractCodeBlocks()
    if (codeBlocks.length > 0) {
      fields.push('配置示例')
      score += 5
    }

    // === 内容长度加分 ===

    if (length > 300) score += 10
    else if (length > 100) score += 5

    // 限制最大分数
    score = Math.min(100, score)

    return { score, fields, suggestions }
  }
}

export const agentsScorer = new AgentsScorer()
