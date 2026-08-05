'use client';

import * as React from 'react';
import { cn } from '../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'warm';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-98 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary: 'bg-[#C62828] text-white hover:bg-[#A91F1F] shadow-sm',
      secondary: 'bg-[#F57C00] text-white hover:bg-[#E06C00] shadow-sm',
      warm: 'bg-[#FFC857] text-[#2B2B2B] hover:bg-[#F6B915] font-semibold',
      outline: 'border border-[#EAE3C3] bg-white text-[#2B2B2B] hover:bg-[#FFF3C4]',
      ghost: 'bg-transparent text-[#2B2B2B] hover:bg-black/5',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-6 py-3.5 text-base rounded-2xl font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
