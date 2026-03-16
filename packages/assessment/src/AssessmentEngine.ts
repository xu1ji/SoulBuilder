/**
 * 评估引擎
 *
 * 核心类，负责读取 OpenClaw 配置并生成评估结果
 */

import type {
  Agent,
  Assessment,
  AssessmentDimensions,
  AssessmentDetails,
  AgentRank,
  AgentStatus,
  OpenClawAgentConfig,
} from '@soulbuilder/shared'
import {
  calculateRank,
  calculateTotalScore,
  generateRadarData,
} from '@soulbuilder/shared'
import { OpenClawParser } from './parsers/OpenClawParser'
import { ScoringEngine } from './scorers/ScoringEngine'

export { OpenClawParser } from './parsers/OpenClawParser'
export { ScoringEngine } from './scorers/ScoringEngine'

export class AssessmentEngine {
  private parser: OpenClawParser
  private scorer: ScoringEngine
  private cache: Map<string, { assessment: Assessment; timestamp: number }>
  private cacheTimeout: number = 60000 // 1 分钟缓存

  constructor(openclawPath?: string) {
    this.parser = new OpenClawParser(openclawPath)
    this.scorer = new ScoringEngine()
    this.cache = new Map()
  }

  /**
   * 评估单个 Agent
   */
  async assess(agentId: string, forceRefresh: boolean = false): Promise<Assessment> {
    // 检查缓存
    if (!forceRefresh) {
      const cached = this.cache.get(agentId)
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.assessment
      }
    }

    // 读取配置文件
    const files = await this.parser.readWorkspaceFiles(agentId)

    // 评分
    const { dimensions, details } = this.scorer.scoreAll(files)

    // 计算总分和等级
    const totalScore = Math.round(calculateTotalScore(dimensions) * 10) / 10
    const rank = calculateRank(totalScore)

    // 生成雷达图数据
    const radarData = generateRadarData(dimensions)

    const assessment: Assessment = {
      agentId,
      totalScore,
      rank,
      dimensions,
      radarData,
      assessedAt: new Date(),
      details: {
        identityFields: details.identityFields,
        soulFields: details.soulFields,
        userFields: details.userFields,
        toolsFields: details.toolsFields,
        agentsFields: details.agentsFields,
        memoryFields: details.memoryFields,
        suggestions: details.suggestions,
      },
    }

    // 更新缓存
    this.cache.set(agentId, { assessment, timestamp: Date.now() })

    return assessment
  }

  /**
   * 批量评估所有 Agent
   */
  async assessAll(forceRefresh: boolean = false): Promise<Assessment[]> {
    const agentIds = await this.parser.getAvailableAgentIds()
    const assessments: Assessment[] = []

    for (const agentId of agentIds) {
      try {
        const assessment = await this.assess(agentId, forceRefresh)
        assessments.push(assessment)
      } catch (error) {
        console.error(`Failed to assess agent ${agentId}:`, error)
      }
    }

    // 按分数排序
    return assessments.sort((a, b) => b.totalScore - a.totalScore)
  }

  /**
   * 获取所有 Agent 列表（带评估分数）
   */
  async getAgents(): Promise<Agent[]> {
    const configs = await this.parser.getAgentConfigs()
    const agents: Agent[] = []

    for (const config of configs) {
      if (!this.parser.workspaceExists(config.id)) {
        continue
      }

      try {
        const agent = await this.buildAgent(config)
        agents.push(agent)
      } catch (error) {
        console.error(`Failed to build agent ${config.id}:`, error)
      }
    }

    // 按分数排序
    return agents.sort((a, b) => b.score - a.score)
  }

  /**
   * 获取单个 Agent 信息
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    const config = await this.parser.getAgentConfig(agentId)
    if (!config || !this.parser.workspaceExists(agentId)) {
      return null
    }

    return this.buildAgent(config)
  }

  /**
   * 构建 Agent 对象
   */
  private async buildAgent(config: OpenClawAgentConfig): Promise<Agent> {
    // 读取 IDENTITY.md 获取基本信息
    const identityContent = await this.parser.readFile(config.id, 'IDENTITY.md')
    const basicInfo = this.parser.parseAgentBasicInfo(config, identityContent || undefined)

    // 评估获取分数
    const assessment = await this.assess(config.id)

    // 获取最后修改时间
    const lastModified = await this.parser.getLastModified(config.id)

    // 确定状态
    const status = this.determineStatus(assessment.totalScore)

    return {
      id: config.id,
      name: basicInfo.name || config.id,
      title: basicInfo.title || 'Unknown',
      level: this.scoreToLevel(assessment.totalScore),
      score: assessment.totalScore,
      rank: assessment.rank,
      lastTrained: lastModified || undefined,
      status,
      workspace: config.workspace,
      model: config.model,
    }
  }

  /**
   * 分数转等级 (1-5)
   */
  private scoreToLevel(score: number): number {
    if (score >= 90) return 5
    if (score >= 75) return 4
    if (score >= 60) return 3
    if (score >= 40) return 2
    return 1
  }

  /**
   * 确定状态
   */
  private determineStatus(score: number): AgentStatus {
    if (score < 40) return 'new'
    if (score >= 85) return 'upgradable'
    return 'trained'
  }

  /**
   * 清除缓存
   */
  clearCache(agentId?: string): void {
    if (agentId) {
      this.cache.delete(agentId)
    } else {
      this.cache.clear()
    }
  }

  /**
   * 获取评估摘要
   */
  async getSummary(agentId: string): Promise<{
    assessment: Assessment
    summary: {
      strongest: string
      weakest: string
      average: number
      gap: number
    }
  }> {
    const assessment = await this.assess(agentId)
    const summary = this.scorer.getSummary(assessment.dimensions)

    return {
      assessment,
      summary: {
        ...summary,
        strongest: summary.strongest,
        gap: 100 - assessment.totalScore,
      },
    }
  }
}

// 默认导出
export const assessmentEngine = new AssessmentEngine()
