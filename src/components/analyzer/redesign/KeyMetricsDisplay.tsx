/**
 * Key Metrics Grid Component
 * 
 * Apple-style metrics display with clean cards.
 * Shows the 4 most important numbers at a glance.
 */

'use client';

import { AnalyzeResponse, RiskLevel, ValueFlag, DataQuality } from '@/types';

interface KeyMetricsDisplayProps {
  result: AnalyzeResponse;
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
  icon?: React.ReactNode;
}

function MetricCard({ label, value, sublabel, color = 'text-white', icon }: MetricCardProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className={`text-xl sm:text-2xl font-semibold ${color} tracking-tight`}>{value}</p>
      {sublabel && (
        <p className="text-xs text-white/40 mt-1">{sublabel}</p>
      )}
    </div>
  );
}

// Calculate confidence score
function calculateConfidence(result: AnalyzeResponse): number {
  let score = 50;
  
  if (result.matchInfo.dataQuality === 'HIGH') score += 15;
  else if (result.matchInfo.dataQuality === 'LOW') score -= 15;
  
  const probs = result.probabilities;
  const maxProb = Math.max(probs.homeWin ?? 0, probs.awayWin ?? 0, probs.draw ?? 0);
  if (maxProb >= 60) score += 10;
  else if (maxProb <= 40) score -= 5;
  
  const h2h = result.momentumAndForm.h2hSummary;
  if (h2h && h2h.totalMatches >= 3) score += 5;
  
  const formSource = result.momentumAndForm.formDataSource;
  if (formSource === 'API_FOOTBALL' || formSource === 'API_SPORTS') score += 10;
  
  return Math.max(20, Math.min(95, score));
}

export default function KeyMetricsDisplay({ result }: KeyMetricsDisplayProps) {
  const { riskAnalysis, valueAnalysis, upsetPotential } = result;
  
  const confidence = calculateConfidence(result);
  
  // Risk display
  const riskLabels: Record<RiskLevel, { text: string; color: string }> = {
    LOW: { text: 'Low', color: 'text-emerald-400' },
    MEDIUM: { text: 'Medium', color: 'text-amber-400' },
    HIGH: { text: 'High', color: 'text-rose-400' },
  };
  const risk = riskLabels[riskAnalysis.overallRiskLevel];
  
  // Value display
  const valueFlagValues = Object.values(valueAnalysis.valueFlags);
  const hasValue = valueFlagValues.includes('HIGH') || valueFlagValues.includes('MEDIUM');
  
  // Confidence color
  const confidenceColor = confidence >= 70 ? 'text-emerald-400' : 
                          confidence >= 50 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <MetricCard
        label="AI Confidence"
        value={`${confidence}%`}
        sublabel="Analysis reliability"
        color={confidenceColor}
        icon={
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      />
      
      <MetricCard
        label="Risk Level"
        value={risk.text}
        sublabel={riskAnalysis.riskExplanation?.slice(0, 50) || 'Analysis risk'}
        color={risk.color}
        icon={
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
      
      <MetricCard
        label="Value Signal"
        value={hasValue ? 'Found' : 'None'}
        sublabel={hasValue ? 'Odds discrepancy detected' : 'Odds reflect probability'}
        color={hasValue ? 'text-emerald-400' : 'text-white/50'}
        icon={
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <MetricCard
        label="Upset Chance"
        value={`${upsetPotential.upsetProbability.toFixed(0)}%`}
        sublabel={upsetPotential.upsetProbability > 30 ? 'Notable upset potential' : 'Low upset risk'}
        color={upsetPotential.upsetProbability > 30 ? 'text-amber-400' : 'text-white/50'}
        icon={
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
    </div>
  );
}
