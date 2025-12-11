/**
 * Deep Analysis Section
 * 
 * Apple-style expandable sections for detailed data.
 * Clean accordion with smooth animations.
 */

'use client';

import { useState } from 'react';
import { AnalyzeResponse, ValueFlag, RiskLevel } from '@/types';

interface DeepAnalysisSectionProps {
  result: AnalyzeResponse;
}

interface ExpandableSectionProps {
  title: string;
  subtitle?: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function ExpandableSection({ title, subtitle, icon, defaultOpen = false, children }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl bg-[#0c0c0f] border border-white/[0.06] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-medium text-white/80">{title}</h3>
            {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`transition-all duration-300 ease-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-white/[0.04]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Value flag styling
const valueConfig: Record<ValueFlag, { label: string; color: string }> = {
  NONE: { label: 'No Value', color: 'text-white/40' },
  LOW: { label: 'Low', color: 'text-sky-400' },
  MEDIUM: { label: 'Medium', color: 'text-emerald-400' },
  HIGH: { label: 'High', color: 'text-emerald-300' },
};

export default function DeepAnalysisSection({ result }: DeepAnalysisSectionProps) {
  const { matchInfo, valueAnalysis, momentumAndForm, marketStability, tacticalAnalysis, riskAnalysis } = result;

  // H2H Summary
  const h2hSummary = momentumAndForm.h2hSummary;
  const hasH2H = h2hSummary && h2hSummary.totalMatches > 0;

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1 mb-4">
        <div className="w-1 h-4 rounded-full bg-white/20" />
        <span className="text-xs font-medium text-white/30 uppercase tracking-widest">Deep Analysis</span>
      </div>

      {/* Value Analysis */}
      <ExpandableSection 
        title="Value Analysis" 
        subtitle="Odds vs AI probability comparison"
        icon="💰"
      >
        <div className="pt-4 space-y-4">
          {/* Value Flags */}
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(valueAnalysis.valueFlags).map(([market, flag]) => {
              const config = valueConfig[flag];
              return (
                <div key={market} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                    {market.replace('_', ' ')}
                  </p>
                  <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
                </div>
              );
            })}
          </div>
          
          {/* Implied Probabilities */}
          <div className="pt-4 border-t border-white/[0.04]">
            <p className="text-xs text-white/40 mb-3">Bookmaker Implied Probabilities</p>
            <div className="space-y-2">
              {Object.entries(valueAnalysis.impliedProbabilities).map(([outcome, prob]) => (
                <div key={outcome} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{outcome}</span>
                  <span className="text-sm text-white/80 font-medium">{prob !== null ? `${(prob * 100).toFixed(1)}%` : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Head to Head */}
      {hasH2H && (
        <ExpandableSection 
          title="Head to Head" 
          subtitle={`${h2hSummary.totalMatches} previous meetings`}
          icon="⚔️"
        >
          <div className="pt-4 space-y-4">
            {/* Win Distribution */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                <p className="text-2xl font-bold text-blue-400">{h2hSummary.homeWins}</p>
                <p className="text-[10px] text-white/40 mt-1">{matchInfo.homeTeam} Wins</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-center">
                <p className="text-2xl font-bold text-white/60">{h2hSummary.draws}</p>
                <p className="text-[10px] text-white/40 mt-1">Draws</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-center">
                <p className="text-2xl font-bold text-rose-400">{h2hSummary.awayWins}</p>
                <p className="text-[10px] text-white/40 mt-1">{matchInfo.awayTeam} Wins</p>
              </div>
            </div>

            {/* Recent Matches */}
            {momentumAndForm.headToHead && momentumAndForm.headToHead.length > 0 && (
              <div className="pt-4 border-t border-white/[0.04]">
                <p className="text-xs text-white/40 mb-3">Recent Meetings</p>
                <div className="space-y-2">
                  {momentumAndForm.headToHead.slice(0, 5).map((match, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                      <span className="text-xs text-white/40">{match.date}</span>
                      <span className="text-sm text-white/70">{match.homeScore} - {match.awayScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>
      )}

      {/* Market Stability */}
      <ExpandableSection 
        title="Market Analysis" 
        subtitle="Betting market conditions"
        icon="📊"
      >
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(marketStability.markets).map(([market, data]) => {
              const stabilityColors: Record<string, string> = {
                HIGH: 'text-emerald-400',
                MEDIUM: 'text-amber-400',
                LOW: 'text-rose-400',
              };
              return (
                <div key={market} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                    {market.replace('_', ' ').replace('main ', '')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${stabilityColors[data.stability]}`}>
                      {data.stability} Stability
                    </span>
                    <span className="text-xs text-white/40">{data.confidence}★</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ExpandableSection>

      {/* Match Narrative */}
      {tacticalAnalysis.matchNarrative && (
        <ExpandableSection 
          title="Match Story" 
          subtitle="AI-generated preview"
          icon="📖"
        >
          <div className="pt-4">
            <p className="text-sm text-white/60 leading-relaxed">
              {tacticalAnalysis.matchNarrative}
            </p>
          </div>
        </ExpandableSection>
      )}
    </div>
  );
}
