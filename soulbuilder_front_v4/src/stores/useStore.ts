import { create } from 'zustand';

export interface AgentDimensions {
  identity: number;
  soul: number;
  user: number;
  tools: number;
  agents: number;
  memory: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
  score: number;
  dimensions: AgentDimensions;
  status: 'new' | 'trained' | 'upgradable';
  lastTrained: string | null;
}

interface AppState {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'xiao-ming',
    name: '小明',
    title: '销售总监',
    avatar: '',
    rank: 'S',
    score: 96,
    dimensions: { identity: 95, soul: 92, user: 88, tools: 98, agents: 85, memory: 94 },
    status: 'trained',
    lastTrained: '3天前',
  },
  {
    id: 'xiao-hong',
    name: '小红',
    title: '客服主管',
    avatar: '',
    rank: 'A',
    score: 87,
    dimensions: { identity: 85, soul: 82, user: 78, tools: 90, agents: 75, memory: 88 },
    status: 'trained',
    lastTrained: '1周前',
  },
  {
    id: 'xiao-li',
    name: '小李',
    title: '产品经理',
    avatar: '',
    rank: 'C',
    score: 58,
    dimensions: { identity: 55, soul: 50, user: 45, tools: 70, agents: 40, memory: 60 },
    status: 'trained',
    lastTrained: '1个月前',
  },
  {
    id: 'xiao-wang',
    name: '小王',
    title: '数据分析',
    avatar: '',
    rank: 'E',
    score: 15,
    dimensions: { identity: 10, soul: 5, user: 20, tools: 25, agents: 0, memory: 15 },
    status: 'new',
    lastTrained: null,
  },
];

export const useStore = create<AppState>((set) => ({
  agents: INITIAL_AGENTS,
  addAgent: (agent) => set((state) => ({ agents: [agent, ...state.agents] })),
  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
}));
