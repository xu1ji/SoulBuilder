import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Agent } from '../../stores/useStore';
import { getStatusColor, getStatusLabel } from '../../utils/theme';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const radarData = [
    { subject: '身份', value: agent.dimensions.identity },
    { subject: '灵魂', value: agent.dimensions.soul },
    { subject: '用户', value: agent.dimensions.user },
    { subject: '工具', value: agent.dimensions.tools },
    { subject: '协作', value: agent.dimensions.agents },
    { subject: '记忆', value: agent.dimensions.memory },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      className="card flex flex-col h-full hover:border-gray-300"
    >
      <div className="flex items-start gap-4 mb-6">
        {agent.avatar ? (
          <img 
            src={agent.avatar} 
            alt={agent.name} 
            className="w-12 h-12 rounded-xl object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {agent.name[0]}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
            <span className="text-sm text-gray-400">· {agent.title}</span>
          </div>
          <div className="text-sm font-bold text-gray-600">
            {agent.rank} 级 · {agent.score} 分
          </div>
        </div>
      </div>

      <div className="h-32 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="subject" tick={false} />
            <Radar
              name={agent.name}
              dataKey="value"
              stroke="#000000"
              fill="#000000"
              fillOpacity={0.1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 text-center">
          身份 {agent.dimensions.identity}
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 text-center">
          灵魂 {agent.dimensions.soul}
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 text-center">
          用户 {agent.dimensions.user}
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 text-center">
          工具 {agent.dimensions.tools}
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 text-center">
          协作 {agent.dimensions.agents}
        </div>
        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-600 text-center">
          记忆 {agent.dimensions.memory}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
          <span className="text-xs text-gray-500">
            {getStatusLabel(agent.status)} · {agent.lastTrained ? `${agent.lastTrained}训练` : '从未训练'}
          </span>
        </div>
        <div className="flex gap-2">
          <Link to={`/agents/${agent.id}`} className="btn-secondary text-xs py-1.5 px-3">
            查看详情
          </Link>
          <Link to={`/agents/${agent.id}/train`} className="btn-primary text-xs py-1.5 px-3">
            开始训练
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
