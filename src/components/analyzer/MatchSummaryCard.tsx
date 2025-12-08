/**
 * Match Summary Card Component
 * 
 * Displays match info from analysis.matchInfo and meta.
 * Shows sport, league, date, teams, source type, and data quality badges.
 */

'use client';

import { MatchInfo, AnalysisMeta, DataQuality, SourceType } from '@/types';

interface MatchSummaryCardProps {
  matchInfo: MatchInfo;
  meta: AnalysisMeta;
}

const dataQualityConfig: Record<DataQuality, { label: string; bgColor: string; textColor: string }> = {
  LOW: { label: 'Low Quality', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  MEDIUM: { label: 'Medium Quality', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  HIGH: { label: 'High Quality', bgColor: 'bg-green-100', textColor: 'text-green-700' },
};

const sourceTypeConfig: Record<SourceType, { label: string; bgColor: string; textColor: string; icon: string }> = {
  API: { label: 'Live Data', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700', icon: '📡' },
  MANUAL: { label: 'Manual Entry', bgColor: 'bg-slate-100', textColor: 'text-slate-700', icon: '✏️' },
};

export default function MatchSummaryCard({ matchInfo, meta }: MatchSummaryCardProps) {
  const qualityConfig = dataQualityConfig[matchInfo.dataQuality];
  const sourceConfig = sourceTypeConfig[matchInfo.sourceType];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="card bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sourceConfig.bgColor} ${sourceConfig.textColor}`}>
          <span>{sourceConfig.icon}</span>
          {sourceConfig.label}
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${qualityConfig.bgColor} ${qualityConfig.textColor}`}>
          {qualityConfig.label}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {matchInfo.sport}
        </span>
      </div>

      {/* League name */}
      <p className="text-primary-200 text-sm mb-2">{matchInfo.leagueName}</p>

      {/* Teams */}
      <div className="flex items-center justify-center gap-4 my-6">
        <div className="text-center flex-1">
          <p className="text-2xl md:text-3xl font-bold">{matchInfo.homeTeam}</p>
          <p className="text-xs text-primary-300 mt-1">Home</p>
        </div>
        <div className="text-primary-400 text-2xl font-light">vs</div>
        <div className="text-center flex-1">
          <p className="text-2xl md:text-3xl font-bold">{matchInfo.awayTeam}</p>
          <p className="text-xs text-primary-300 mt-1">Away</p>
        </div>
      </div>

      {/* Match date */}
      <div className="text-center text-primary-200 text-sm">
        <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formatDate(matchInfo.matchDate)}
      </div>

      {/* Low quality warning */}
      {matchInfo.dataQuality === 'LOW' && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-200">
              <strong>Low data quality:</strong> Analysis accuracy may be limited due to insufficient or incomplete data.
            </p>
          </div>
        </div>
      )}

      {/* Meta info */}
      <div className="mt-4 pt-4 border-t border-primary-700/50 flex flex-wrap justify-between text-xs text-primary-400">
        <span>Model v{meta.modelVersion}</span>
        <span>Generated: {new Date(meta.analysisGeneratedAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
