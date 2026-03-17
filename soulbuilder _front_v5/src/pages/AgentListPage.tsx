import React from 'react';
import { motion } from 'motion/react';
import { Plus, ChevronDown } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { AgentCard } from '../components/features/AgentCard';

const AgentListPage: React.FC = () => {
  const agents = useStore((state) => state.agents);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* 顶部栏 - 更紧凑 */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SoulBuilder</h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              AI Agent 训练平台
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white
                          text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors">
          <Plus size={14} />
          新建
        </button>
      </header>

      {/* 统计栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-900">我的团队</span>
          <span className="text-xs text-gray-400">{agents.length} 位 Agent</span>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-500
                          hover:text-gray-700 transition-colors">
          按等级排序
          <ChevronDown size={12} />
        </button>
      </div>

      {/* 卡片网格 - 3列 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1,
                transition: { type: 'spring', stiffness: 350, damping: 28 } }
            }}
          >
            <AgentCard agent={agent} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AgentListPage;
