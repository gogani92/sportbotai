'use client';

/**
 * Activity Tracker
 * 
 * Silently tracks user activity by calling /api/activity periodically.
 * Updates lastActiveAt in the database.
 */

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const ACTIVITY_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function ActivityTracker() {
  const { data: session } = useSession();
  const lastPing = useRef<number>(0);

  useEffect(() => {
    if (!session?.user) return;

    const trackActivity = async () => {
      const now = Date.now();
      
      // Only ping every 5 minutes max
      if (now - lastPing.current < ACTIVITY_INTERVAL) return;
      
      lastPing.current = now;
      
      try {
        await fetch('/api/activity', { method: 'POST' });
      } catch {
        // Silently fail
      }
    };

    // Track on mount
    trackActivity();

    // Track on user interaction
    const events = ['click', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      trackActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Also track periodically
    const interval = setInterval(trackActivity, ACTIVITY_INTERVAL);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [session]);

  return null; // Invisible component
}
