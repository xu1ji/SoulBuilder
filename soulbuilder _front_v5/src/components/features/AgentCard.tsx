import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Agent } from '../../stores/useStore';

interface AgentCardProps {
  agent: Agent;
}

// 根据分数返回颜色
const getScoreColor = (value: number): string => {
  if (value >= 90) return 'bg-emerald-500';
  if (value >= 75) return 'bg-blue-500';
  if (value >= 60) return 'bg-amber-500';
  if (value >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};

const DimensionMiniBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-gray-500 w-6 shrink-0">{label}</span>
    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${getScoreColor(value)}`}
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
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative bg-gray-50 rounded-2xl border border-gray-200/60 p-5 shadow-lg shadow-gray-200/50 transition-all duration-200"
    >
      {/* 等级标识 - 右上角半透明 */}
      <div className="absolute top-3 right-4 text-2xl font-bold text-gray-900/40">
        {agent.rank}
      </div>

      {/* 头部：头像 + 名称 + 状态 */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-10 h-10 rounded-lg object-cover shrink-0"
        />

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
