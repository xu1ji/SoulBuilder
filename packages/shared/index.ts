/**
 * SoulBuilder 2.0 - 共享类型定义
 * @soulbuilder/shared
 *
 * 这是整个项目的接口契约，所有子项目必须遵循。
 *
 * @version 2.0.0
 * @author SoulBuilder Team
 */

// ============================================
// Agent 相关
// ============================================

/**
 * Agent 基本信息
 * 从 OpenClaw 配置解析出的 Agent 基本信息
 */
export interface Agent {
  id: string
  name: string
  title: string         // 岗位
  level: number         // 能力等级 1-5
  score: number         // 能力值 0-100
  rank: AgentRank
  lastTrained?: Date
  status: AgentStatus
  workspace: string     // workspace 目录路径
  model?: string        // 使用的模型
}

export type AgentRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
export type AgentStatus = 'new' | 'trained' | 'upgradable'

// ============================================
// 评估相关 (Assessment)
// ============================================

/**
 * 评估维度
 * 对应 OpenClaw 6层架构的文件
 */
export interface AssessmentDimensions {
  identity: number      // IDENTITY.md - 身份档案完整度 0-100
  soul: number          // SOUL.md - 灵魂深度 0-100
  user: number          // USER.md - 雇主信息 0-100
  tools: number         // TOOLS.md - 工具配置 0-100
  agents: number        // AGENTS.md - 协作关系 0-100
  memory: number        // MEMORY.md - 记忆管理 0-100
}

/**
 * 评估结果
 */
export interface Assessment {
  agentId: string
  totalScore: number    // 0-100 总分
  rank: AgentRank
  dimensions: AssessmentDimensions
  radarData: number[]   // 雷达图数据 [identity, soul, user, tools, agents, memory]
  assessedAt: Date
  details?: AssessmentDetails
}

/**
 * 评估详情
 */
export interface AssessmentDetails {
  identityFields: string[]    // IDENTITY.md 已填写的字段
  soulFields: string[]        // SOUL.md 已填写的字段
  userFields: string[]
  toolsFields: string[]
  agentsFields: string[]
  memoryFields: string[]
  suggestions: string[]       // 改进建议
}

/**
 * 评估配置
 */
export interface AssessmentConfig {
  weights: AssessmentDimensions  // 各维度权重
  thresholds: RankThresholds     // 等级阈值
}

export interface RankThresholds {
  S: number  // 95
  A: number  // 85
  B: number  // 70
  C: number  // 55
  D: number  // 40
  E: number  // 0
}

// ============================================
// 训练相关 (Training)
// ============================================

/**
 * 训练模式
 */
export type TrainingMode =
  | 'new'           // 全新训练 - 从零开始创建 Agent
  | 'upgrade'       // 升级训练 - 基于现有版本提升
  | 'inject'        // 技能注入 - 注入特定方法论

/**
 * 训练方式
 */
export type TrainingMethod =
  | 'describe'      // 描述更强的样子 - 用户口述理想状态
  | 'methodology'   // 注入行业标准方法论 - AI 推荐
  | 'case-study'    // 分析优秀案例 - 参考标杆
  | 'knowledge'     // 知识库增强 - 注入领域知识
  | 'scenario'      // 场景化调优 - 针对具体场景

/**
 * 训练方式详情
 */
export interface TrainingMethodInfo {
  id: TrainingMethod
  name: string
  description: string
  example: string
}

/**
 * 对话消息
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * 训练会话
 */
export interface TrainingSession {
  sessionId: string
  agentId: string
  mode: TrainingMode
  method: TrainingMethod
  messages: ChatMessage[]
  currentRound: number      // 当前轮次 1-5
  totalRounds: number       // 总轮次，默认 5
  startedAt: Date
  status: 'active' | 'completed' | 'abandoned'
  collectedData?: Partial<TrainingCollectedData>
}

/**
 * 训练过程中收集的数据
 */
export interface TrainingCollectedData {
  // 基础信息
  name?: string
  title?: string

  // 特质
  traits?: string[]

  // 沟通风格
  style?: string

  // 边界底线
  boundaries?: string[]

  // 行业场景
  industry?: string
  scenario?: string

  // 方法论（AI 自动补充）
  methodologies?: string[]
}

/**
 * 训练结果
 */
export interface TrainingResult {
  agentId: string
  sessionId: string
  oldScore: number
  newScore: number
  scoreDiff: number   // newScore - oldScore
  skills: string[]    // 注入的技能列表
  files: TrainingResultFiles
  completedAt: Date
}

/**
 * 训练结果 - 要写入的文件内容
 */
export interface TrainingResultFiles {
  identity: string      // IDENTITY.md 新内容
  soul: string          // SOUL.md 新内容
  user: string          // USER.md 新内容
  tools: string         // TOOLS.md 新内容
  agents: string        // AGENTS.md 新内容
}

// ============================================
// 动画相关 (Animation)
// ============================================

/**
 * 动画阶段
 */
export type AnimationPhase =
  | 'enter'       // 接入 Construct (3s)
  | 'transfer'    // 数据传输 (5s)
  | 'training'    // 训练中 (15s)
  | 'awakening'   // 觉醒 (5s)
  | 'complete'    // 完成 (2s)

/**
 * 动画阶段配置
 */
export interface AnimationPhaseConfig {
  phase: AnimationPhase
  duration: number  // 毫秒
  label: string     // 显示文字
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  phases: AnimationPhaseConfig[]
  totalDuration: number  // 总时长（毫秒）
  skills: string[]       // 技能列表（用于显示 "I know X"）
  beforeScore: number
  afterScore: number
  beforeRank: AgentRank
  afterRank: AgentRank
}

/**
 * 动画组件 Props
 */
export interface AnimationProps {
  config: AnimationConfig
  onComplete: () => void
  onPhaseChange?: (phase: AnimationPhase, progress: number) => void
  skipable?: boolean
}

// ============================================
// OpenClaw 配置相关
// ============================================

/**
 * OpenClaw 主配置结构
 */
export interface OpenClawConfig {
  agents: {
    list: OpenClawAgentConfig[]
    defaults: OpenClawAgentDefaults
  }
  bindings: OpenClawBinding[]
  models?: OpenClawModels
}

export interface OpenClawAgentConfig {
  id: string
  workspace: string
  model: string
  tools?: {
    exec?: {
      host: string
      security: string
    }
  }
  sandbox?: {
    mode: string
  }
}

export interface OpenClawAgentDefaults {
  model: {
    primary: string
  }
  workspace: string
  compaction?: {
    mode: string
  }
  maxConcurrent?: number
}

export interface OpenClawBinding {
  agentId: string
  match: {
    channel: string
    accountId: string
  }
}

export interface OpenClawModels {
  providers: Record<string, {
    baseUrl: string
    apiKey: string
    api: string
    models: Array<{
      id: string
      name: string
      contextWindow: number
      maxTokens: number
    }>
  }>
}

// ============================================
// API 请求/响应类型
// ============================================

// 获取 Agent 列表
export interface GetAgentsResponse {
  agents: Agent[]
  total: number
}

// 获取评估
export interface GetAssessmentRequest {
  agentId: string
  forceRefresh?: boolean  // 强制重新评估
}
export interface GetAssessmentResponse {
  assessment: Assessment
}

// 开始训练
export interface StartTrainingRequest {
  agentId: string
  mode: TrainingMode
  method: TrainingMethod
}
export interface StartTrainingResponse {
  sessionId: string
  session: TrainingSession
}

// 训练对话
export interface TrainingChatRequest {
  sessionId: string
  message: string
}
// 响应为 SSE 流，格式：data: { content: string }\n\n
export interface TrainingChatSSEData {
  content: string
  done?: boolean
  error?: string
}

// 完成训练
export interface CompleteTrainingRequest {
  sessionId: string
}
export interface CompleteTrainingResponse {
  success: boolean
  result: TrainingResult
}

// 保存配置
export interface SaveConfigRequest {
  agentId: string
  result: TrainingResult
  createBackup?: boolean  // 是否创建备份，默认 true
}
export interface SaveConfigResponse {
  success: boolean
  backupPath?: string
  writtenFiles: string[]
}

// ============================================
// 常量
// ============================================

/**
 * 评估权重 (v1.1 - 6维模型)
 */
export const ASSESSMENT_WEIGHTS: AssessmentDimensions = {
  identity: 22,    // 22%
  soul: 22,        // 22%
  user: 17,        // 17%
  tools: 17,       // 17%
  agents: 11,      // 11%
  memory: 11,      // 11%
}

/**
 * 等级阈值
 */
export const RANK_THRESHOLDS: RankThresholds = {
  S: 95,
  A: 85,
  B: 70,
  C: 55,
  D: 40,
  E: 0,
}

/**
 * 动画阶段配置
 */
export const ANIMATION_PHASES: AnimationPhaseConfig[] = [
  { phase: 'enter', duration: 3000, label: 'Entering Construct...' },
  { phase: 'transfer', duration: 5000, label: 'Transferring data...' },
  { phase: 'training', duration: 15000, label: 'Training in progress...' },
  { phase: 'awakening', duration: 5000, label: 'Awakening...' },
  { phase: 'complete', duration: 2000, label: 'Training complete.' },
]

/**
 * Matrix 颜色
 */
export const MATRIX_COLORS = {
  green: '#00FF41',
  greenDark: '#008F11',
  white: '#FFFFFF',
  black: '#0D0208',
  success: '#4ADE80',
  gold: '#FBBF24',
  red: '#EF4444',
} as const

// 类型导出
export type MatrixColors = typeof MATRIX_COLORS

/**
 * 训练方式详情
 */
export const TRAINING_METHODS: TrainingMethodInfo[] = [
  {
    id: 'describe',
    name: '描述更强的样子',
    description: '你口述理想 Agent 的样子，AI 帮你实现',
    example: '我想要一个能带团队、能谈大客户、风格强势的销售总监',
  },
  {
    id: 'methodology',
    name: '注入行业标准方法论',
    description: 'AI 根据岗位自动推荐行业最佳实践',
    example: '销售总监 → SPIN销售法、Challenger Sale、顾问式销售',
  },
  {
    id: 'case-study',
    name: '分析优秀案例',
    description: '参考行业标杆，学习他们的长处',
    example: '参考阿里铁军的销售体系',
  },
  {
    id: 'knowledge',
    name: '知识库增强',
    description: '注入特定领域的专业知识',
    example: '注入跨境电商的行业知识',
  },
  {
    id: 'scenario',
    name: '场景化调优',
    description: '针对具体使用场景进行优化',
    example: '主要用于跟供应商谈判',
  },
]

// ============================================
// 工具函数
// ============================================

/**
 * 根据分数计算等级
 */
export function calculateRank(score: number): AgentRank {
  if (score >= RANK_THRESHOLDS.S) return 'S'
  if (score >= RANK_THRESHOLDS.A) return 'A'
  if (score >= RANK_THRESHOLDS.B) return 'B'
  if (score >= RANK_THRESHOLDS.C) return 'C'
  if (score >= RANK_THRESHOLDS.D) return 'D'
  return 'E'
}

/**
 * 计算总分
 */
export function calculateTotalScore(dimensions: AssessmentDimensions): number {
  return (
    dimensions.identity * (ASSESSMENT_WEIGHTS.identity / 100) +
    dimensions.soul * (ASSESSMENT_WEIGHTS.soul / 100) +
    dimensions.user * (ASSESSMENT_WEIGHTS.user / 100) +
    dimensions.tools * (ASSESSMENT_WEIGHTS.tools / 100) +
    dimensions.agents * (ASSESSMENT_WEIGHTS.agents / 100) +
    dimensions.memory * (ASSESSMENT_WEIGHTS.memory / 100)
  )
}

/**
 * 生成雷达图数据
 */
export function generateRadarData(dimensions: AssessmentDimensions): number[] {
  return [
    dimensions.identity,
    dimensions.soul,
    dimensions.user,
    dimensions.tools,
    dimensions.agents,
    dimensions.memory,
  ]
}

/**
 * 生成 sessionId
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 生成消息 ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
