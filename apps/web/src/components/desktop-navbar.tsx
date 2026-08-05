'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Users, MessageSquare, User, Flame, LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { Avatar } from '@hotspots/ui-web';

export const DesktopNavbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/connections', label: 'Connections', icon: Users },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
    ...(isAuthenticated ? [{ href: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <header className="hidden md:flex sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#EAE3C3]/80 px-6 py-3 items-center justify-between shadow-xs w-full">
      {/* Left: Branding */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C62828] to-[#F57C00] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
          <Flame className="w-5.5 h-5.5 fill-white" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-[#2B2B2B] block leading-none">
            HOTSPOTS
          </span>
          <span className="text-[9px] text-[#619B8A] font-extrabold tracking-wider uppercase">
            Campus Matchmaking
          </span>
        </div>
      </Link>

      {/* Center: Horizontal Navigation Links */}
      <nav className="flex items-center gap-1.5 bg-[#FFF3C4]/50 border border-[#EAE3C3]/80 p-1.5 rounded-2xl backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const targetHref = !isAuthenticated && item.href !== '/' ? '/auth' : item.href;

          return (
            <Link
              key={item.href}
              href={targetHref}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-[#C62828] to-[#F57C00] text-white shadow-md'
                  : 'text-[#414643] hover:bg-white/80 hover:text-[#2B2B2B]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right: User Profile & Auth Controls */}
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 p-1.5 pr-3 bg-white/80 hover:bg-[#FFF3C4]/60 rounded-full border border-[#EAE3C3] transition-colors shadow-2xs"
            >
              <Avatar src={user.avatar_url} name={user.display_name} size="sm" />
              <div className="text-left leading-tight">
                <span className="font-bold text-xs text-[#2B2B2B] block truncate max-w-[120px]">
                  {user.display_name}
                </span>
                <span className="text-[10px] text-[#619B8A] block truncate max-w-[120px]">
                  {user.campus_name || user.department}
                </span>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2.5 rounded-full border border-red-200/80 bg-red-50/50 hover:bg-red-100/80 text-red-700 font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link href="/auth">
            <button className="px-4 py-2 rounded-xl bg-[#C62828] text-white font-bold text-xs shadow-sm hover:bg-[#A91F1F] transition-colors">
              Sign In / Register
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};
