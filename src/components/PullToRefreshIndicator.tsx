/**
 * Pull-to-Refresh Indicator Component
 * 
 * Visual indicator that shows during pull-to-refresh gesture.
 */

'use client';

import React from 'react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export default function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShow = pullDistance > 10 || isRefreshing;
  
  if (!shouldShow) return null;
  
  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-200"
      style={{ 
        top: `max(${pullDistance}px, env(safe-area-inset-top, 20px))`,
        opacity: progress,
      }}
    >
      <div className="bg-bg-card border border-divider rounded-full p-3 shadow-xl">
        {isRefreshing ? (
          // Spinning loader
          <svg 
            className="w-6 h-6 text-accent animate-spin" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          // Arrow that rotates as you pull
          <svg 
            className="w-6 h-6 text-accent transition-transform duration-150"
            style={{ transform: `rotate(${progress * 180}deg)` }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        )}
      </div>
    </div>
  );
}
