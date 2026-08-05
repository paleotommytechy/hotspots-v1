'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck } from 'lucide-react';
import { DataService } from '@hotspots/database';

export interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const isLive = DataService.isLiveMode();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#EAE3C3]/80 px-4 py-3 flex items-center justify-between shadow-xs md:hidden">
      <Link href="/" className="flex items-center gap-1.5 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C62828] to-[#F57C00] flex items-center justify-center text-white shadow-sm">
          <Flame className="w-5 h-5 fill-white" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-[#2B2B2B]">
          HOTSPOTS
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {title && <span className="text-xs font-semibold text-[#414643] bg-gray-100 px-2.5 py-1 rounded-full">{title}</span>}
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          <ShieldCheck className="w-3 h-3" />
          {isLive ? 'Supabase Live' : 'Demo Mode'}
        </span>
      </div>
    </header>
  );
};
