'use client';

import * as React from 'react';
import { cn } from '../utils';

export interface BadgeProps {
  percentage: number;
  showLabel?: boolean;
  className?: string;
}

export const MatchBadge: React.FC<BadgeProps> = ({ percentage, showLabel = true, className }) => {
  let bg = 'bg-[#2E7D32] text-white'; // High match
  if (percentage < 70 && percentage >= 50) {
    bg = 'bg-[#F57C00] text-white'; // Medium match
  } else if (percentage < 50) {
    bg = 'bg-[#447270] text-white'; // Low/Moderate match
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs shadow-sm',
        bg,
        className
      )}
    >
      <span>{percentage}%</span>
      {showLabel && <span className="opacity-90 font-normal">Match</span>}
    </div>
  );
};
