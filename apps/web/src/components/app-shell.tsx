'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DesktopNavbar } from './desktop-navbar';
import { TopBar } from './top-bar';
import { BottomNav } from './bottom-nav';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  return (
    <div className={`app-container flex flex-col min-h-screen ${isAuthPage ? '!pb-0' : ''}`}>
      {!isAuthPage && <DesktopNavbar />}
      {!isAuthPage && <TopBar />}
      <main className={`flex-1 overflow-x-hidden ${isAuthPage ? 'p-0 flex items-center justify-center' : 'p-4 md:p-6 lg:p-8'}`}>
        {children}
      </main>
      {!isAuthPage && <BottomNav />}
    </div>
  );
};
