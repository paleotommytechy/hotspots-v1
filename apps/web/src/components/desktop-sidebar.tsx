'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Users, MessageSquare, User, Flame, LogOut, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { Avatar } from '@hotspots/ui-web';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover Passions', icon: Compass },
    { href: '/connections', label: 'Connections', icon: Users },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#EAE3C3]/80 bg-white/80 backdrop-blur-2xl p-5 sticky top-0 h-screen shrink-0 justify-between shadow-xs text-left">
      {/* Top Header & Navigation */}
      <div className="space-y-6">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C62828] to-[#F57C00] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-[#2B2B2B] block leading-none">
              HOTSPOTS
            </span>
            <span className="text-[10px] text-[#619B8A] font-extrabold tracking-wider uppercase mt-1 block">
              Hobby & Passions
            </span>
          </div>
        </Link>

        {/* Status Badge */}
        <div className="px-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-full justify-center bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Inclusive Community</span>
          </span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C62828] to-[#F57C00] text-white shadow-md'
                    : 'text-[#414643] hover:bg-[#FFF3C4]/60 hover:text-[#2B2B2B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile Summary & Logout */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        {isAuthenticated && user ? (
          <>
            <Link
              href="/profile"
              className="p-3 bg-[#FFF3C4]/50 hover:bg-[#FFF3C4]/90 rounded-2xl border border-[#EAE3C3] flex items-center gap-3 transition-colors shadow-xs"
            >
              <Avatar src={user.avatar_url} name={user.display_name} size="md" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-[#2B2B2B] truncate">{user.display_name}</h4>
                <p className="text-[11px] text-[#414643] truncate">{user.department || 'Enthusiast'}</p>
                {user.campus_name && (
                  <div className="flex items-center gap-1 text-[10px] text-[#619B8A] mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{user.campus_name}</span>
                  </div>
                )}
              </div>
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-red-200/80 bg-red-50/50 hover:bg-red-100/80 text-red-700 font-bold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth" className="block w-full">
            <button className="w-full py-2.5 rounded-xl bg-[#C62828] text-white font-bold text-xs shadow-sm hover:bg-[#A91F1F] transition-colors">
              Sign In / Register
            </button>
          </Link>
        )}
      </div>
    </aside>
  );
};
