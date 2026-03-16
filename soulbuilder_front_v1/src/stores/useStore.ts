import { create } from 'zustand';

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
export type Status = 'new' | 'trained' | 'upgradable';

export interface Agent {
  id: string;
  name: string;
  title: string;
  level: number;
  score: number;
  rank: Rank;
  status: Status;
  lastTrained: string | null;
  model: string;
}

interface AppState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
}

export const useStore = create<AppState>((set) => ({
  agents: [
    {
      id: 'xiao-ming',
      name: '小明',
      title: '销售总监',
      level: 5,
      score: 96,
      rank: 'S',
      status: 'trained',
      lastTrained: '2025-03-15',
      model: 'claude-sonnet-4-6'
    },
    {
      id: 'xiao-hong',
      name: '小红',
      title: '客服主管',
      level: 4,
      score: 87,
      rank: 'A',
      status: 'trained',
      lastTrained: '2025-03-10',
      model: 'claude-sonnet-4-6'
    },
    {
      id: 'xiao-li',
      name: '小李',
      title: '产品经理',
      level: 3,
      score: 58,
      rank: 'C',
      status: 'trained',
      lastTrained: '2025-02-20',
      model: 'claude-sonnet-4-6'
    },
    {
      id: 'xiao-wang',
      name: '小王',
      title: '数据分析',
      level: 1,
      score: 15,
      rank: 'E',
      status: 'new',
      lastTrained: null,
      model: 'claude-sonnet-4-6'
    }
  ],
  setAgents: (agents) => set({ agents }),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
}));
