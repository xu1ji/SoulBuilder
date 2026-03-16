import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Agent } from '../../stores/useStore';
import { RankBadge } from '../ui/RankBadge';
import { getStatusColor, getStatusLabel } from '../../utils/theme';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card flex items-center gap-6 hover:shadow-lg"
    >
      <RankBadge rank={agent.rank} score={agent.score} />
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
          <span className="text-sm text-gray-400">· {agent.title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Rank {agent.rank} · {agent.score} PTS</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
            <span className="text-xs text-gray-500">
              {getStatusLabel(agent.status)} · {agent.lastTrained ? `Last trained ${agent.lastTrained}` : 'Never trained'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Link to={`/agents/${agent.id}`} className="btn-secondary text-sm py-2 px-5">
          Profile
        </Link>
        <Link to={`/agents/${agent.id}/train`} className="btn-primary text-sm py-2 px-5">
          Train
        </Link>
      </div>
    </motion.div>
  );
};
