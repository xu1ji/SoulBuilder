import React from 'react';
import { Link } from 'react-router-dom';
import { Agent } from '../../stores/useStore';
import { RankBadge } from '../ui/RankBadge';
import { getStars, getStatusLabel } from '../../utils/theme';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="matrix-card flex items-center gap-4">
      <RankBadge rank={agent.rank} score={agent.score} />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
          <span className="text-sm text-gray-500">· {agent.title}</span>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-yellow-500">{getStars(agent.rank)}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
            {getStatusLabel(agent.status)}
          </span>
        </div>
        
        <div className="text-[10px] text-gray-400 mt-2">
          最后训练: {agent.lastTrained || '从未训练'}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link to={`/agents/${agent.id}`} className="matrix-btn-secondary text-sm py-1 px-4">
          查看
        </Link>
        <Link to={`/agents/${agent.id}/train`} className="matrix-btn-primary text-sm py-1 px-4">
          训练
        </Link>
      </div>
    </div>
  );
};
