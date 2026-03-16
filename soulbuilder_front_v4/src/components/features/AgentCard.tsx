import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Agent } from '../../stores/useStore';
import { RankBadge } from '../ui/RankBadge';

interface AgentCardProps {
  agent: Agent;
}

const DimensionPill: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-[10px] font-medium text-gray-600 border border-gray-100">
    {label}
    <span className="text-gray-900 font-bold">{value}</span>
  </span>
);

const Avatar: React.FC<{ name: string; avatar?: string }> = ({ name, avatar }) => {
  const gradients = [
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
  ];
  const gradientIndex = name.charCodeAt(0) % gradients.length;

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover shadow-sm"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[gradientIndex]} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
      {name[0]}
    </div>
  );
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const radarData = [
    { subject: '身份', value: agent.dimensions.identity },
    { subject: '灵魂', value: agent.dimensions.soul },
    { subject: '用户', value: agent.dimensions.user },
    { subject: '工具', value: agent.dimensions.tools },
    { subject: '协作', value: agent.dimensions.agents },
    { subject: '记忆', value: agent.dimensions.memory },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden bg-white-pure rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-xl"
    >
      {/* Glow Effect */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(0,0,0,0.03), transparent 40%)`
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-5 relative z-20">
        <Avatar name={agent.name} avatar={agent.avatar} />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">
            {agent.name} · {agent.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <RankBadge rank={agent.rank} score={agent.score} />
          </div>
        </div>
      </div>

      {/* Mini Radar Chart */}
      <div className="flex justify-center mb-5 h-32 relative z-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#E5E5E5" />
            <PolarAngleAxis dataKey="subject" tick={false} />
            <Radar
              name="能力值"
              dataKey="value"
              stroke="#000000"
              fill="#000000"
              fillOpacity={0.05}
              strokeWidth={2}
              animationDuration={1000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Dimension Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 relative z-20">
        <DimensionPill label="身份" value={agent.dimensions.identity} />
        <DimensionPill label="灵魂" value={agent.dimensions.soul} />
        <DimensionPill label="用户" value={agent.dimensions.user} />
        <DimensionPill label="工具" value={agent.dimensions.tools} />
        <DimensionPill label="协作" value={agent.dimensions.agents} />
        <DimensionPill label="记忆" value={agent.dimensions.memory} />
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-2 mb-6 relative z-20">
        <div className={`w-2 h-2 rounded-full ${agent.status === 'new' ? 'bg-blue-500' : 'bg-success'}`} />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          {agent.status === 'new' ? '新建' : `已训练 · ${agent.lastTrained}`}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 relative z-20">
        <button 
          onClick={() => navigate(`/agents/${agent.id}`)}
          className="btn-secondary flex-1 py-2.5 text-xs font-bold uppercase tracking-widest"
        >
          查看详情
        </button>
        <button 
          onClick={() => navigate(`/agents/${agent.id}/train`)}
          className="btn-primary flex-1 py-2.5 text-xs font-bold uppercase tracking-widest"
        >
          开始训练
        </button>
      </div>
    </motion.div>
  );
};
