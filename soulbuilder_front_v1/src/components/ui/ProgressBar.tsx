import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label, showValue = false }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getColor = () => {
    if (percentage >= 80) return 'bg-matrix-green';
    if (percentage >= 60) return 'bg-success';
    return 'bg-warning';
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
          {label && <span>{label}</span>}
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
