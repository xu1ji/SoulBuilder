import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Agent } from '../../stores/useStore';

interface AgentCardProps {
  agent: Agent;
}

const DimensionMiniBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-gray-500 w-6 shrink-0">{label}</span>
    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gray-800 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
    <span className="text-[10px] font-semibold text-gray-700 w-5 text-right">{value}</span>
  </div>
);

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();

  const radarData = [
    { subject: '身份', value: agent.dimensions.identity },
    { subject: '灵魂', value: agent.dimensions.soul },
    { subject: '用户', value: agent.dimensions.user },
    { subject: '工具', value: agent.dimensions.tools },
    { subject: '协作', value: agent.dimensions.agents },
    { subject: '记忆', value: agent.dimensions.memory },
  ];

  const rankGradients: Record<string, string> = {
    S: 'from-amber-400 to-orange-500',
    A: 'from-violet-400 to-purple-500',
    B: 'from-blue-400 to-indigo-500',
    C: 'from-emerald-400 to-green-500',
    D: 'from-orange-400 to-red-500',
    E: 'from-gray-400 to-gray-500',
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition-all duration-200"
    >
      {/* 等级角标 - 右上角 */}
      <div className="absolute -top-1 -right-1 z-10">
        <div className={`p-[2px] rounded-lg bg-gradient-to-br ${rankGradients[agent.rank]}`}>
          <div className="bg-white rounded-[6px] px-2 py-1 text-center min-w-[44px]">
            <div className="text-sm font-bold text-gray-900 leading-none">{agent.rank}</div>
            <div className="text-[9px] text-gray-500 font-medium mt-0.5">{agent.score}</div>
          </div>
        </div>
      </div>

      {/* 头部：头像 + 名称 + 状态 */}
      <div className="flex items-center gap-3 mb-4 pr-12">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {agent.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {agent.name} · {agent.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${
              agent.status === 'new' ? 'bg-gray-400' :
              agent.status === 'upgradable' ? 'bg-amber-500' : 'bg-success'
            }`} />
            <span className="text-[10px] text-gray-500">
              {agent.status === 'new' ? '新建' : `已训练 · ${agent.lastTrained}`}
            </span>
          </div>
        </div>
      </div>

      {/* 雷达图 - 正方形容器 */}
      <div className="flex justify-center mb-4">
        <div className="w-[160px] h-[160px] shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="#E5E5E5" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#737373', fontSize: 9, fontWeight: 500 }}
              />
              <Radar
                name="能力值"
                dataKey="value"
                stroke="#000000"
                fill="#000000"
                fillOpacity={0.08}
                strokeWidth={1.5}
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 维度迷你条形图 - 两列布局 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <DimensionMiniBar label="身份" value={agent.dimensions.identity} />
        <DimensionMiniBar label="灵魂" value={agent.dimensions.soul} />
        <DimensionMiniBar label="用户" value={agent.dimensions.user} />
        <DimensionMiniBar label="工具" value={agent.dimensions.tools} />
        <DimensionMiniBar label="协作" value={agent.dimensions.agents} />
        <DimensionMiniBar label="记忆" value={agent.dimensions.memory} />
      </div>

      {/* 底部：状态 + 操作 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            {agent.score}分
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/agents/${agent.id}`)}
            className="px-3 py-1.5 text-[10px] font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            详情
          </button>
          <button
            onClick={() => navigate(`/agents/${agent.id}/train`)}
            className="px-3 py-1.5 text-[10px] font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            训练
          </button>
        </div>
      </div>
    </motion.div>
  );
};
