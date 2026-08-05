'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/auth-context';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const getHref = (path: string) => (isAuthenticated ? path : '/auth');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/88 backdrop-blur-2xl border-t border-white/60 w-full px-4 py-2 shadow-2xl md:hidden">
      <div className="flex items-center justify-between max-w-md mx-auto px-2">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
            pathname === '/' ? 'text-[#C62828] font-extrabold' : 'text-[#414643] hover:text-[#2B2B2B]'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${pathname === '/' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Discover */}
        <Link
          href={getHref('/discover')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
            pathname === '/discover' ? 'text-[#C62828] font-extrabold' : 'text-[#414643] hover:text-[#2B2B2B]'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${pathname === '/discover' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          <span className="text-[10px] tracking-tight">Discover</span>
        </Link>

        {/* Floating Center Action Button (+) from Reference Image 1 */}
        <Link
          href={getHref('/discover')}
          className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#C62828] to-[#F57C00] text-white flex items-center justify-center shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[3px]" />
        </Link>

        {/* Messages */}
        <Link
          href={getHref('/messages')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
            pathname?.startsWith('/messages') ? 'text-[#C62828] font-extrabold' : 'text-[#414643] hover:text-[#2B2B2B]'
          }`}
        >
          <MessageSquare className={`w-5 h-5 mb-0.5 ${pathname?.startsWith('/messages') ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          <span className="text-[10px] tracking-tight">Messages</span>
        </Link>

        {/* Profile */}
        <Link
          href={getHref('/profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
            pathname?.startsWith('/profile') ? 'text-[#C62828] font-extrabold' : 'text-[#414643] hover:text-[#2B2B2B]'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 ${pathname?.startsWith('/profile') ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
          <span className="text-[10px] tracking-tight">Profile</span>
        </Link>
      </div>
    </nav>
  );
};
