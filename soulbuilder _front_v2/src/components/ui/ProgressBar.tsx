import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label, showValue = false }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
          {label && <span className="text-gray-700">{label}</span>}
          {showValue && <span className="text-gray-500">{value}/{max}</span>}
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
