import * as React from 'react';
import { cn } from '../utils';

export type InterestCategory =
  | 'gaming'
  | 'music'
  | 'arts'
  | 'crafts'
  | 'outdoors'
  | 'sports'
  | 'food'
  | 'fandom'
  | 'technology'
  | 'collecting'
  | 'lifestyle'
  | 'science'
  | 'reading'
  | 'design'
  | 'business'
  | 'general';

export interface ChipProps {
  label: string;
  variant?: 'interest' | 'skill' | 'goal' | 'neutral' | 'active';
  category?: InterestCategory | string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const CATEGORY_STYLES: Record<string, { unselected: string; selected: string }> = {
  gaming: {
    unselected: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100/80',
    selected: 'bg-indigo-600 text-white border-indigo-600 shadow-xs',
  },
  music: {
    unselected: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100/80',
    selected: 'bg-rose-600 text-white border-rose-600 shadow-xs',
  },
  arts: {
    unselected: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100/80',
    selected: 'bg-amber-600 text-white border-amber-600 shadow-xs',
  },
  crafts: {
    unselected: 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100/80',
    selected: 'bg-orange-600 text-white border-orange-600 shadow-xs',
  },
  outdoors: {
    unselected: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/80',
    selected: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
  },
  sports: {
    unselected: 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100/80',
    selected: 'bg-teal-600 text-white border-teal-600 shadow-xs',
  },
  food: {
    unselected: 'bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100/80',
    selected: 'bg-yellow-600 text-white border-yellow-600 shadow-xs',
  },
  fandom: {
    unselected: 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100/80',
    selected: 'bg-purple-600 text-white border-purple-600 shadow-xs',
  },
  reading: {
    unselected: 'bg-violet-50 text-violet-900 border-violet-200 hover:bg-violet-100/80',
    selected: 'bg-violet-600 text-white border-violet-600 shadow-xs',
  },
  collecting: {
    unselected: 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100/80',
    selected: 'bg-amber-700 text-white border-amber-700 shadow-xs',
  },
  technology: {
    unselected: 'bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100/80',
    selected: 'bg-cyan-700 text-white border-cyan-700 shadow-xs',
  },
  science: {
    unselected: 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100/80',
    selected: 'bg-sky-600 text-white border-sky-600 shadow-xs',
  },
};

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'interest',
  category,
  selected = false,
  onClick,
  className,
  icon,
}) => {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 border';

  let styleClasses = '';

  if (category && CATEGORY_STYLES[category]) {
    const catStyle = CATEGORY_STYLES[category];
    styleClasses = selected ? catStyle.selected : catStyle.unselected;
  } else {
    const variants = {
      interest: selected
        ? 'bg-[#619B8A] text-white border-[#619B8A] shadow-xs'
        : 'bg-[#619B8A]/10 text-[#203C3B] border-[#619B8A]/30 hover:bg-[#619B8A]/20',
      skill: selected
        ? 'bg-[#F57C00] text-white border-[#F57C00] shadow-xs'
        : 'bg-[#F57C00]/10 text-[#E06C00] border-[#F57C00]/30 hover:bg-[#F57C00]/20',
      goal: selected
        ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
        : 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/30 hover:bg-[#C62828]/20',
      neutral: 'bg-black/5 text-[#414643] border-black/10',
      active: 'bg-[#FFC857] text-[#2B2B2B] border-[#FFC857] font-bold shadow-xs',
    };
    styleClasses = variants[variant];
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(base, styleClasses, onClick && 'cursor-pointer active:scale-95 hover:shadow-2xs', className)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
