'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserProfile } from '@hotspots/types';
import { DataService } from '@hotspots/database';
import { useToast } from '@hotspots/ui-web';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'hotspots_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on initial load
  useEffect(() => {
    async function restoreSession() {
      try {
        const cur = await DataService.getCurrentProfile();
        if (cur) {
          setUser(cur);
        } else {
          const storedSession = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
          if (!storedSession) {
            setUser(null);
          }
        }
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      let cur: UserProfile | null = null;
      if (email && password) {
        cur = await DataService.signInWithSupabase(email, password);
      } else {
        cur = await DataService.getCurrentProfile();
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const cur = await DataService.signInWithGoogle();
      if (!cur) throw new Error('Could not retrieve Google profile.');
      setUser(cur);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, 'google');
      }
      toast.success(`Signed in with Google as ${cur.display_name}!`);
      router.push('/discover');
    } catch (e: any) {
      toast.error(e?.message || 'Google Sign In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      let cur: UserProfile | null = null;
      if (email && password) {
        cur = await DataService.signUpWithSupabase(email, password);
      } else {
        cur = await DataService.getCurrentProfile();
      }

      if (!cur) {
        throw new Error('Failed to initialize user profile.');
      }

      setUser(cur);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, 'active');
      }
      toast.success(`Account created successfully! Welcome to Hotspots, ${cur.display_name}.`);
      router.push('/onboarding');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      toast.info('You have been signed out.');
      router.push('/');
    } finally {
      setIsLoading(false);
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
