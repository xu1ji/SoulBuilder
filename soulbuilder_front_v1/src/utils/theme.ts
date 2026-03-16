import React from 'react';
import { Rank } from '../stores/useStore';

export const getRankColor = (rank: Rank) => {
  switch (rank) {
    case 'S': return '#FBBF24';
    case 'A': return '#D97706';
    case 'B': return '#4ADE80';
    case 'C': return '#60A5FA';
    case 'D': return '#9CA3AF';
    case 'E': return '#EF4444';
    default: return '#9CA3AF';
  }
};

export const getRankBg = (rank: Rank) => {
  switch (rank) {
    case 'S': return 'rgba(251, 191, 36, 0.2)';
    case 'A': return 'rgba(217, 112, 6, 0.15)';
    case 'B': return 'rgba(74, 222, 128, 0.15)';
    case 'C': return 'rgba(96, 165, 250, 0.15)';
    case 'D': return 'rgba(156, 163, 175, 0.15)';
    case 'E': return 'rgba(239, 68, 68, 0.15)';
    default: return 'rgba(156, 163, 175, 0.15)';
  }
};

export const getStars = (rank: Rank) => {
  switch (rank) {
    case 'S': return '★★★★★✨';
    case 'A': return '★★★★★';
    case 'B': return '★★★★☆';
    case 'C': return '★★★☆☆';
    case 'D': return '★☆☆☆☆';
    case 'E': return '☆☆☆☆☆';
    default: return '☆☆☆☆☆';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new': return '🔴 新建';
    case 'trained': return '🟢 已训练';
    case 'upgradable': return '🟡 可升级';
    default: return status;
  }
};
