import React from 'react';
import { Rank } from '../stores/useStore';

export const getRankColor = (rank: Rank) => {
  return '#FFFFFF'; // All white text on dark background
};

export const getRankBg = (rank: Rank) => {
  return '#111827'; // All dark background for badges
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-gray-400';
    case 'trained': return 'bg-success';
    case 'upgradable': return 'bg-warning';
    default: return 'bg-gray-400';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new': return '新建';
    case 'trained': return '已训练';
    case 'upgradable': return '可升级';
    default: return status;
  }
};

export const getStars = (rank: Rank) => {
  switch (rank) {
    case 'S': return '★★★★★';
    case 'A': return '★★★★';
    case 'B': return '★★★';
    case 'C': return '★★';
    case 'D': return '★';
    default: return '';
  }
};
