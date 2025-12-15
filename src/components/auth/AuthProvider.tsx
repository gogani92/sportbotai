'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      // Refetch session every 5 minutes instead of the default (which can cause frequent re-renders)
      refetchInterval={5 * 60}
      // Don't refetch on window focus to prevent UI flicker
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
