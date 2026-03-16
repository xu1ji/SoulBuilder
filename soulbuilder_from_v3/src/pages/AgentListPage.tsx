import React from 'react';
import { motion } from 'motion/react';
import { Plus, ChevronDown } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { AgentCard } from '../components/features/AgentCard';

const AgentListPage: React.FC = () => {
  const agents = useStore((state) => state.agents);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">SoulBuilder</h1>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          新建 Agent
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-end mb-8"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">我的团队 ({agents.length})</h2>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
          按等级排序
          <ChevronDown size={16} />
        </button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AgentCard agent={agent} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgentListPage;
