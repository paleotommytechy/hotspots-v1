'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserProfile } from '@hotspots/types';
import { DataService, supabase } from '@hotspots/database';
import { useToast } from '@hotspots/ui-web';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'hotspots_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore and sync Supabase session
  useEffect(() => {
    let mounted = true;

    async function syncSession() {
      try {
        const cur = await DataService.getCurrentProfile();
        if (mounted) {
          setUser(cur);
        }
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    syncSession();

    let subscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await DataService.getCurrentProfile();
          if (mounted) setUser(profile);
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setIsLoading(false);
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      const cur = await DataService.signInWithSupabase(email, password);

      if (!cur) {
        throw new Error('User profile not found.');
      }

      setUser(cur);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, 'active');
      }
      toast.success(`Welcome back, ${cur.display_name}! Sign in successful.`);
      router.push('/discover');
    } catch (e: any) {
      toast.error(e?.message || 'Authentication failed. Please check your credentials.');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await DataService.signInWithGoogle();
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, 'google');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Google Sign In failed. Please try again.');
      setIsLoading(false);
    }
  };

  const signup = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Please provide email and password.');
      }
      const cur = await DataService.signUpWithSupabase(email, password);

      if (!cur) {
        throw new Error('Failed to initialize user profile.');
      }

      setUser(cur);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, 'active');
      }
      toast.success(`Account created! Welcome to Hotspots, ${cur.display_name}.`);
      router.push('/onboarding');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create account. Please try again.');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await DataService.signOut();
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      toast.info('You have been signed out.');
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const updated = await DataService.getCurrentProfile();
      setUser(updated);
    } catch (e) {
      console.warn('Error refreshing profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
