import React from 'react';
import { motion } from 'motion/react';

interface RankBadgeProps {
  rank: string;
  score: number;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, score }) => {
  const gradients: Record<string, string> = {
    S: 'from-yellow-400 via-yellow-500 to-amber-500',
    A: 'from-purple-400 via-purple-500 to-violet-500',
    B: 'from-blue-400 via-blue-500 to-indigo-500',
    C: 'from-green-400 via-green-500 to-emerald-500',
    D: 'from-orange-400 via-orange-500 to-amber-500',
    E: 'from-gray-400 via-gray-500 to-gray-600',
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative p-[2px] rounded-xl bg-gradient-to-br ${gradients[rank] || gradients.E}`}
    >
      <div className="bg-white rounded-[10px] px-3 py-2 text-center min-w-[64px]">
        <div className="text-lg font-bold text-gray-900 leading-none">{rank}</div>
        <div className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">{score}分</div>
      </div>
    </motion.div>
  );
};
