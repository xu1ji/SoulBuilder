import React from 'react';
import { Rank } from '../../stores/useStore';

interface RankBadgeProps {
  rank: Rank;
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, score, size = 'md' }) => {
  const dimensions = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-12 h-12' : 'w-10 h-10';
  const fontSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-xl' : 'text-lg';
  const scoreSize = size === 'lg' ? 'text-sm' : 'text-[10px]';

  return (
    <div 
      className={`${dimensions} rounded-xl flex flex-col items-center justify-center font-bold bg-gray-900 text-white`}
    >
      <span className={fontSize}>{rank}</span>
      <span className={`${scoreSize} text-gray-400 font-medium`}>{score}</span>
    </div>
  );
};
