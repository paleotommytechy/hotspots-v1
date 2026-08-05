'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import { useToast, Skeleton } from '@hotspots/ui-web';
import { Flame } from 'lucide-react';

const PUBLIC_PATHS = ['/', '/auth'];

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  
  const hasWarnedRef = useRef(false);

  const isPublicPath = PUBLIC_PATHS.includes(pathname || '/');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isPublicPath) {
      if (!hasWarnedRef.current) {
        hasWarnedRef.current = true;
        toast.warning('Please sign in to access this page');
      }
      router.replace('/auth');
    } else if (isAuthenticated) {
      const isOnboarded = Boolean(user?.is_onboarded);
      if (!isOnboarded && pathname !== '/onboarding') {
        router.replace('/onboarding');
      } else if (isOnboarded && (pathname === '/auth' || pathname === '/onboarding')) {
        hasWarnedRef.current = false;
        router.replace('/');
      } else {
        hasWarnedRef.current = false;
      }
    } else {
      hasWarnedRef.current = false;
    }
  }, [isAuthenticated, isLoading, isPublicPath, pathname, router, toast, user]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-3 p-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C62828] to-[#F57C00] flex items-center justify-center text-white shadow-lg animate-pulse">
          <Flame className="w-6 h-6 fill-white" />
        </div>
        <p className="text-xs font-bold text-[#619B8A]">Loading Hotspots...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicPath) {
    return null;
  }

  return <>{children}</>;
};
