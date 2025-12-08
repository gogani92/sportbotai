/**
 * Momentum & Form Section Component
 * 
 * Displays analysis.momentumAndForm with home/away momentum scores,
 * trends (with arrow icons), and key form factors.
 */

'use client';

import { MomentumAndForm, Trend } from '@/types';

interface MomentumFormSectionProps {
  momentumAndForm: MomentumAndForm;
  homeTeam: string;
  awayTeam: string;
}

const trendConfig: Record<Trend, { label: string; icon: string; color: string; bgColor: string }> = {
  RISING: { label: 'Rising', icon: '↗', color: 'text-green-600', bgColor: 'bg-green-100' },
  FALLING: { label: 'Falling', icon: '↘', color: 'text-red-600', bgColor: 'bg-red-100' },
  STABLE: { label: 'Stable', icon: '→', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  UNKNOWN: { label: 'Unknown', icon: '?', color: 'text-gray-400', bgColor: 'bg-gray-50' },
};

interface MomentumMeterProps {
  score: number | null;
  trend: Trend;
  teamName: string;
  isHome: boolean;
}

function MomentumMeter({ score, trend, teamName, isHome }: MomentumMeterProps) {
  const trendInfo = trendConfig[trend];
  const displayScore = score !== null ? score : 0;
  const percentage = (displayScore / 10) * 100;

  // Color gradient based on score
  const getScoreColor = (s: number | null) => {
    if (s === null) return 'text-gray-400';
    if (s >= 7) return 'text-green-600';
    if (s >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBarColor = (s: number | null) => {
    if (s === null) return 'bg-gray-300';
    if (s >= 7) return 'bg-green-500';
    if (s >= 5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={`p-4 rounded-lg ${isHome ? 'bg-emerald-50 border border-emerald-200' : 'bg-blue-50 border border-blue-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-gray-500">{isHome ? 'Home' : 'Away'}</p>
          <p className="font-semibold text-gray-800">{teamName}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendInfo.color} ${trendInfo.bgColor}`}>
          <span className="text-lg">{trendInfo.icon}</span>
          {trendInfo.label}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex items-end justify-between">
          <span className="text-sm text-gray-500">Momentum Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score !== null ? `${score}/10` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: score !== null ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export default function MomentumFormSection({ momentumAndForm, homeTeam, awayTeam }: MomentumFormSectionProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Momentum & Form
      </h3>

      {/* Two-column momentum display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MomentumMeter
          score={momentumAndForm.homeMomentumScore}
          trend={momentumAndForm.homeTrend}
          teamName={homeTeam}
          isHome={true}
        />
        <MomentumMeter
          score={momentumAndForm.awayMomentumScore}
          trend={momentumAndForm.awayTrend}
          teamName={awayTeam}
          isHome={false}
        />
      </div>

      {/* Key Form Factors */}
      {momentumAndForm.keyFormFactors && momentumAndForm.keyFormFactors.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Key Form Factors
          </h4>
          <ul className="space-y-2">
            {momentumAndForm.keyFormFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
