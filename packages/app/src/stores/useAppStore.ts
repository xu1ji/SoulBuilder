import { create } from 'zustand'
import type {
  Agent,
  Assessment,
  TrainingSession,
  TrainingMode,
  TrainingMethod,
  TrainingResult,
  AnimationPhase,
} from '@soulbuilder/shared'

interface TrainingFeedback {
  collected: string[]
  pending: string[]
  extracted: {
    position?: string
    goals?: string[]
    style?: string
    industry?: string
    scenario?: string
    boundaries?: string[]
  }
  willInject: string[]
}

interface AppState {
  // Agent 列表
  agents: Agent[]
  loading: boolean

  // 当前选中的 Agent
  currentAgent: Agent | null
  currentAssessment: Assessment | null

  // 训练会话
  currentSession: TrainingSession | null
  trainingFeedback: TrainingFeedback

  // 训练结果
  trainingResult: TrainingResult | null

  // 动画状态
  animationPhase: AnimationPhase
  animationProgress: number

  // Actions
  fetchAgents: () => Promise<void>
  selectAgent: (id: string) => Promise<void>
  startTraining: (mode: TrainingMode, method: TrainingMethod) => Promise<void>
  updateTrainingFeedback: (feedback: Partial<TrainingFeedback>) => void
  completeTraining: (result: TrainingResult) => void
  setAnimationPhase: (phase: AnimationPhase, progress: number) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  resetTraining: () => void
}

// Mock 数据
const mockAgents: Agent[] = [
  {
    id: 'sales-director',
    name: '销售总监',
    title: '大客户销售总监',
    level: 4,
    score: 85,
    rank: 'A',
    status: 'upgradable',
    lastTrained: new Date('2025-03-14'),
    workspace: '~/.openclaw/workspace-sales',
    model: 'claude-sonnet-4-6',
  },
  {
    id: 'product-manager',
    name: '产品经理',
    title: '高级产品经理',
    level: 3,
    score: 72,
    rank: 'B',
    status: 'trained',
    lastTrained: new Date('2025-03-10'),
    workspace: '~/.openclaw/workspace-product',
    model: 'claude-sonnet-4-6',
  },
  {
    id: 'data-analyst',
    name: '数据分析师',
    title: '数据分析专家',
    level: 2,
    score: 58,
    rank: 'C',
    status: 'new',
    workspace: '~/.openclaw/workspace-data',
    model: 'claude-sonnet-4-6',
  },
  {
    id: 'coo-assistant',
    name: 'COO助理',
    title: '首席运营官助理',
    level: 2,
    score: 65,
    rank: 'C',
    status: 'trained',
    lastTrained: new Date('2025-03-08'),
    workspace: '~/.openclaw/workspace-coo',
    model: 'claude-sonnet-4-6',
  },
  {
    id: 'tech-expert',
    name: '技术专家',
    title: '全栈技术专家',
    level: 4,
    score: 88,
    rank: 'A',
    status: 'trained',
    lastTrained: new Date('2025-03-12'),
    workspace: '~/.openclaw/workspace-tech',
    model: 'claude-opus-4-6',
  },
  {
    id: 'content-editor',
    name: '内容主编',
    title: '内容运营主编',
    level: 3,
    score: 75,
    rank: 'B',
    status: 'upgradable',
    lastTrained: new Date('2025-03-05'),
    workspace: '~/.openclaw/workspace-content',
    model: 'claude-sonnet-4-6',
  },
]

const mockAssessments: Record<string, Assessment> = {
  'sales-director': {
    agentId: 'sales-director',
    totalScore: 85,
    rank: 'A',
    dimensions: {
      identity: 92,
      soul: 88,
      user: 78,
      tools: 85,
      agents: 82,
      memory: 75,
    },
    radarData: [92, 88, 78, 85, 82, 75],
    assessedAt: new Date(),
    details: {
      identityFields: ['姓名', '岗位', '性格特质', '沟通风格'],
      soulFields: ['使命', '价值观', '边界底线'],
      userFields: ['雇主名称'],
      toolsFields: ['Slack', 'Notion', 'CRM'],
      agentsFields: ['产品经理', '数据分析师'],
      memoryFields: ['短期记忆', '长期记忆'],
      suggestions: [
        '建议补充行业场景细节',
        '可以配置更多协作关系',
        '记忆管理策略可以更丰富',
      ],
    },
  },
}

const initialFeedback: TrainingFeedback = {
  collected: [],
  pending: ['岗位定位', '沟通风格', '行业场景', '方法论偏好', '边界底线'],
  extracted: {},
  willInject: [],
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  agents: [],
  loading: false,
  currentAgent: null,
  currentAssessment: null,
  currentSession: null,
  trainingFeedback: initialFeedback,
  trainingResult: null,
  animationPhase: 'enter',
  animationProgress: 0,

  // Actions
  fetchAgents: async () => {
    set({ loading: true })
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    set({ agents: mockAgents, loading: false })
  },

  selectAgent: async (id: string) => {
    const agent = get().agents.find(a => a.id === id) || mockAgents.find(a => a.id === id)
    const assessment = mockAssessments[id]

    set({
      currentAgent: agent || null,
      currentAssessment: assessment || null,
    })
  },

  startTraining: async (mode: TrainingMode, method: TrainingMethod) => {
    const agent = get().currentAgent
    if (!agent) return

    const session: TrainingSession = {
      sessionId: `session_${Date.now()}`,
      agentId: agent.id,
      mode,
      method,
      messages: [],
      currentRound: 1,
      totalRounds: 5,
      startedAt: new Date(),
      status: 'active',
    }

    set({
      currentSession: session,
      trainingFeedback: initialFeedback,
    })
  },

  updateTrainingFeedback: (feedback: Partial<TrainingFeedback>) => {
    set(state => ({
      trainingFeedback: { ...state.trainingFeedback, ...feedback },
    }))
  },

  completeTraining: (result: TrainingResult) => {
    set({ trainingResult: result })
  },

  setAnimationPhase: (phase: AnimationPhase, progress: number) => {
    set({ animationPhase: phase, animationProgress: progress })
  },

  updateAgent: (id: string, updates: Partial<Agent>) => {
    set(state => ({
      agents: state.agents.map(a =>
        a.id === id ? { ...a, ...updates } : a
      ),
      currentAgent: state.currentAgent?.id === id
        ? { ...state.currentAgent, ...updates }
        : state.currentAgent,
    }))
  },

  resetTraining: () => {
    set({
      currentSession: null,
      trainingFeedback: initialFeedback,
      trainingResult: null,
      animationPhase: 'enter',
      animationProgress: 0,
    })
  },
}))
