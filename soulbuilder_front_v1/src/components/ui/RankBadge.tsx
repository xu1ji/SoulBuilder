import React from 'react';
import { Rank } from '../../stores/useStore';
import { getRankBg, getRankColor } from '../../utils/theme';

interface RankBadgeProps {
  rank: Rank;
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, score, size = 'md' }) => {
  const dimensions = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-16 h-16' : 'w-12 h-12';
  const fontSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  const scoreSize = size === 'lg' ? 'text-sm' : 'text-[10px]';

  return (
    <div 
      className={`${dimensions} rounded-xl flex flex-col items-center justify-center font-bold`}
      style={{ backgroundColor: getRankBg(rank), color: getRankColor(rank) }}
    >
      <span className={fontSize}>{rank}</span>
      <span className={scoreSize}>{score}</span>
    </div>
  );
};
