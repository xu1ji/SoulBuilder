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
      id: 'alex-sales',
      name: 'Alex',
      title: 'Sales Director',
      level: 5,
      score: 96,
      rank: 'S',
      status: 'trained',
      lastTrained: '2025-03-15',
      model: 'gemini-3.1-pro'
    },
    {
      id: 'sarah-support',
      name: 'Sarah',
      title: 'Support Lead',
      level: 4,
      score: 87,
      rank: 'A',
      status: 'trained',
      lastTrained: '2025-03-10',
      model: 'gemini-3.1-pro'
    },
    {
      id: 'leo-product',
      name: 'Leo',
      title: 'Product Manager',
      level: 3,
      score: 58,
      rank: 'C',
      status: 'trained',
      lastTrained: '2025-02-20',
      model: 'gemini-3.1-pro'
    },
    {
      id: 'maya-data',
      name: 'Maya',
      title: 'Data Analyst',
      level: 1,
      score: 15,
      rank: 'E',
      status: 'new',
      lastTrained: null,
      model: 'gemini-3.1-pro'
    }
  ],
  setAgents: (agents) => set({ agents }),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
}));
