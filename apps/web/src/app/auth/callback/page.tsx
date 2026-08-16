'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataService, supabase } from '@hotspots/database';
import { useAuth } from '../../../context/auth-context';
import { Flame, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [statusText, setStatusText] = useState('Verifying your session...');

  useEffect(() => {
    let mounted = true;

    async function handleAuthCallback() {
      try {
        if (supabase) {
          // Check if there's a code in search params for PKCE flow
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
              setStatusText('Exchanging authentication token...');
              await supabase.auth.exchangeCodeForSession(code);
            }
          }

          // Get session to ensure auth state is loaded
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setStatusText('Loading your profile...');
            await refreshUser();
            const profile = await DataService.getCurrentProfile();
            if (mounted) {
              if (profile && !profile.is_onboarded) {
                router.replace('/onboarding');
              } else {
                router.replace('/discover');
              }
              return;
            }
          }
        }

        // Fallback or local mode
        await refreshUser();
        if (mounted) {
          router.replace('/discover');
        }
      } catch (err) {
        console.error('Error during auth callback processing:', err);
        if (mounted) {
          router.replace('/auth');
        }
      }
    }

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [router, refreshUser]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFF3C4]/30 p-4 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C62828] to-[#F57C00] flex items-center justify-center text-white shadow-lg animate-pulse">
        <Flame className="w-8 h-8 fill-white" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-extrabold text-[#2B2B2B]">Connecting to Hotspots</h2>
        <div className="flex items-center justify-center gap-2 text-xs text-[#619B8A] font-bold">
          <Loader2 className="w-4 h-4 animate-spin text-[#C62828]" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}
