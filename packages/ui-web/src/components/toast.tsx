'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast('success', msg),
    error: (msg: string) => addToast('error', msg),
    info: (msg: string) => addToast('info', msg),
    warning: (msg: string) => addToast('warning', msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Floating Glassmorphism Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((t) => {
          let bg = 'bg-white/90 text-[#2B2B2B] border-emerald-500/40';
          let icon = <Check className="w-4 h-4 text-emerald-600 shrink-0" />;

          if (t.type === 'error') {
            bg = 'bg-white/90 text-[#2B2B2B] border-red-500/40';
            icon = <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />;
          } else if (t.type === 'warning') {
            bg = 'bg-white/90 text-[#2B2B2B] border-amber-500/40';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
          } else if (t.type === 'info') {
            bg = 'bg-white/90 text-[#2B2B2B] border-blue-500/40';
            icon = <Info className="w-4 h-4 text-blue-600 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200 text-xs font-semibold',
                bg
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {icon}
                <span className="truncate">{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};
