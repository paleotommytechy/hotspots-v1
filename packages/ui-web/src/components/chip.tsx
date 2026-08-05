import * as React from 'react';
import { cn } from '../utils';

export interface ChipProps {
  label: string;
  variant?: 'interest' | 'skill' | 'goal' | 'neutral' | 'active';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'interest',
  selected = false,
  onClick,
  className,
  icon,
}) => {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border';

  const variants = {
    interest: selected
      ? 'bg-[#619B8A] text-white border-[#619B8A]'
      : 'bg-[#619B8A]/10 text-[#203C3B] border-[#619B8A]/30 hover:bg-[#619B8A]/20',
    skill: selected
      ? 'bg-[#F57C00] text-white border-[#F57C00]'
      : 'bg-[#F57C00]/10 text-[#E06C00] border-[#F57C00]/30 hover:bg-[#F57C00]/20',
    goal: selected
      ? 'bg-[#C62828] text-white border-[#C62828]'
      : 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/30 hover:bg-[#C62828]/20',
    neutral: 'bg-black/5 text-[#414643] border-black/10',
    active: 'bg-[#FFC857] text-[#2B2B2B] border-[#FFC857] font-semibold',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(base, variants[variant], onClick && 'cursor-pointer active:scale-95', className)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
