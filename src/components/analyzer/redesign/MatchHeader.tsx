/**
 * Match Header Component
 * 
 * Apple-style hero section with elegant match presentation.
 * Features:
 * - Large team names with subtle animations
 * - League badge and countdown
 * - Subtle gradient background with depth
 */

'use client';

import { AnalyzeResponse } from '@/types';

interface MatchHeaderProps {
  matchInfo: AnalyzeResponse['matchInfo'];
}

export default function MatchHeader({ matchInfo }: MatchHeaderProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMs < 0) {
        return date.toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
      }
      
      if (diffHours < 24) {
        return `In ${diffHours}h`;
      }
      if (diffDays === 1) {
        return 'Tomorrow';
      }
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getTimeLabel = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* League & Time */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <span className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-xs font-medium text-white/70 border border-white/10">
            {matchInfo.sport}
          </span>
          <span className="text-white/40">•</span>
          <span className="text-sm text-white/60">{matchInfo.leagueName}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-12">
          {/* Home Team */}
          <div className="flex-1 text-right">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white tracking-tight">
              {matchInfo.homeTeam}
            </h1>
            <p className="text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-widest">Home</p>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white/50 text-sm sm:text-base font-semibold">VS</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white tracking-tight">
              {matchInfo.awayTeam}
            </h1>
            <p className="text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-widest">Away</p>
          </div>
        </div>

        {/* Kickoff Time */}
        <div className="flex items-center justify-center mt-6 sm:mt-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-white/60">{formatDate(matchInfo.matchDate)}</span>
            <span className="text-sm text-white/40">{getTimeLabel(matchInfo.matchDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
