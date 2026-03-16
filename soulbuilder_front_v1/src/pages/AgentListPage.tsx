import React from 'react';
import { useStore } from '../stores/useStore';
import { AgentCard } from '../components/features/AgentCard';

const AgentListPage: React.FC = () => {
  const agents = useStore((state) => state.agents);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h1 className="text-xl font-bold tracking-tight">SoulBuilder</h1>
        </div>
        <button className="matrix-btn-primary">
          新建 Agent
        </button>
      </header>

      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🤖 我的 Agent 团队 ({agents.length})</h2>
        </div>
        <select className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none focus:border-matrix-green">
          <option>按等级排序</option>
          <option>按时间排序</option>
          <option>按名称排序</option>
        </select>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default AgentListPage;
