/**
 * OpenClaw 配置解析器
 * 读取 ~/.openclaw/ 下的配置文件
 */

import { readFile, readdir, stat } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { existsSync } from 'node:fs'
import type {
  OpenClawConfig,
  OpenClawAgentConfig,
  Agent,
} from '@soulbuilder/shared'

export interface WorkspaceFiles {
  identity?: string
  soul?: string
  user?: string
  tools?: string
  agents?: string
  memory?: string
}

const WORKSPACE_FILES = [
  'IDENTITY.md',
  'SOUL.md',
  'USER.md',
  'TOOLS.md',
  'AGENTS.md',
  'MEMORY.md',
] as const

export class OpenClawParser {
  private openclawPath: string
  private config: OpenClawConfig | null = null

  constructor(openclawPath?: string) {
    // 默认路径 ~/.openclaw
    this.openclawPath = openclawPath || join(process.env.HOME || '', '.openclaw')
  }

  /**
   * 获取 OpenClaw 主配置
   */
  async getConfig(): Promise<OpenClawConfig> {
    if (this.config) {
      return this.config
    }

    const configPath = join(this.openclawPath, 'openclaw.json')
    const content = await readFile(configPath, 'utf-8')
    this.config = JSON.parse(content)
    return this.config!
  }

  /**
   * 获取所有 Agent 配置
   */
  async getAgentConfigs(): Promise<OpenClawAgentConfig[]> {
    const config = await this.getConfig()
    return config.agents?.list || []
  }

  /**
   * 获取单个 Agent 配置
   */
  async getAgentConfig(agentId: string): Promise<OpenClawAgentConfig | null> {
    const agents = await this.getAgentConfigs()
    return agents.find(a => a.id === agentId) || null
  }

  /**
   * 获取 Agent 的 workspace 路径
   */
  getWorkspacePath(agentId: string): string {
    return join(this.openclawPath, `workspace-${agentId}`)
  }

  /**
   * 读取 Agent workspace 下的所有配置文件
   */
  async readWorkspaceFiles(agentId: string): Promise<WorkspaceFiles> {
    const workspacePath = this.getWorkspacePath(agentId)
    const files: WorkspaceFiles = {}

    for (const filename of WORKSPACE_FILES) {
      const filepath = join(workspacePath, filename)
      if (existsSync(filepath)) {
        try {
          const content = await readFile(filepath, 'utf-8')
          // 映射文件名到 key
          const key = filename.replace('.md', '').toLowerCase() as keyof WorkspaceFiles
          files[key] = content
        } catch {
          // 文件读取失败，跳过
        }
      }
    }

    return files
  }

  /**
   * 读取单个配置文件
   */
  async readFile(agentId: string, filename: string): Promise<string | null> {
    const filepath = join(this.getWorkspacePath(agentId), filename)
    if (!existsSync(filepath)) {
      return null
    }
    try {
      return await readFile(filepath, 'utf-8')
    } catch {
      return null
    }
  }

  /**
   * 获取 workspace 的最后修改时间
   */
  async getLastModified(agentId: string): Promise<Date | null> {
    const workspacePath = this.getWorkspacePath(agentId)
    if (!existsSync(workspacePath)) {
      return null
    }
    try {
      const stats = await stat(workspacePath)
      return stats.mtime
    } catch {
      return null
    }
  }

  /**
   * 检查 workspace 是否存在
   */
  workspaceExists(agentId: string): boolean {
    const workspacePath = this.getWorkspacePath(agentId)
    return existsSync(workspacePath)
  }

  /**
   * 获取所有可用的 Agent ID
   */
  async getAvailableAgentIds(): Promise<string[]> {
    const agents = await this.getAgentConfigs()
    return agents
      .filter(a => this.workspaceExists(a.id))
      .map(a => a.id)
  }

  /**
   * 解析 Agent 基础信息
   */
  parseAgentBasicInfo(
    config: OpenClawAgentConfig,
    identityContent?: string
  ): Partial<Agent> {
    const agent: Partial<Agent> = {
      id: config.id,
      workspace: config.workspace,
      model: config.model,
    }

    // 从 IDENTITY.md 解析 name 和 title
    if (identityContent) {
      const nameMatch = identityContent.match(/(?:name|名字|名称)[:：]\s*(.+)/i)
      const titleMatch = identityContent.match(/(?:title|岗位|职位|角色)[:：]\s*(.+)/i)

      if (nameMatch) {
        agent.name = nameMatch[1].trim()
      } else {
        // 默认使用 agentId 作为名字
        agent.name = config.id
      }

      if (titleMatch) {
        agent.title = titleMatch[1].trim()
      }
    } else {
      agent.name = config.id
      agent.title = 'Unknown'
    }

    return agent
  }

  /**
   * 获取 OpenClaw 路径
   */
  getOpenClawPath(): string {
    return this.openclawPath
  }
}

// 单例导出
export const openClawParser = new OpenClawParser()
