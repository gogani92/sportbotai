'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UsageData {
  remaining: number;
  limit: number;
  plan: string;
}

interface UsageContextType {
  usageData: UsageData | null;
  refreshUsage: () => Promise<void>;
  isLoading: boolean;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUsage = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/usage', { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      
      if (data.remaining !== undefined) {
        console.log('[UsageContext] Updated usage:', data);
        setUsageData({
          remaining: data.remaining,
          limit: data.limit,
          plan: data.plan || session.user?.plan || 'FREE',
        });
      }
    } catch (err) {
      console.error('[UsageContext] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Fetch on mount and when session changes
  useEffect(() => {
    if (session) {
      refreshUsage();
    }
  }, [session, refreshUsage]);

  return (
    <UsageContext.Provider value={{ usageData, refreshUsage, isLoading }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
}
