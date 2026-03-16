import React from 'react';
import { motion } from 'motion/react';
import { Plus, ChevronDown } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { AgentCard } from '../components/features/AgentCard';

const AgentListPage: React.FC = () => {
  const agents = useStore((state) => state.agents);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black-pure rounded-2xl flex items-center justify-center text-white-pure font-bold text-2xl shadow-lg">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SoulBuilder</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">AI Agent 训练平台</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-primary flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Plus size={18} />
            新建 Agent
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">我的团队</h2>
        <button className="btn-secondary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2 px-4">
          按等级排序
          <ChevronDown size={14} />
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      >
        {agents.map((agent) => (
          <motion.div key={agent.id} variants={itemVariants}>
            <AgentCard agent={agent} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AgentListPage;
