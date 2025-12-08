/**
 * Probabilities Panel Component
 * 
 * Displays analysis.probabilities as visual percentages.
 * Shows homeWin, draw, awayWin, over, under.
 */

'use client';

import { Probabilities } from '@/types';

interface ProbabilitiesPanelProps {
  probabilities: Probabilities;
  homeTeam: string;
  awayTeam: string;
}

interface ProbabilityBarProps {
  label: string;
  value: number | null;
  color: string;
  sublabel?: string;
}

function ProbabilityBar({ label, value, color, sublabel }: ProbabilityBarProps) {
  const displayValue = value !== null ? value : null;
  const barWidth = displayValue !== null ? Math.min(displayValue, 100) : 0;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {sublabel && <span className="text-xs text-gray-500 ml-1">({sublabel})</span>}
        </div>
        <span className={`text-lg font-bold ${displayValue !== null ? color : 'text-gray-400'}`}>
          {displayValue !== null ? `${displayValue}%` : 'N/A'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        {displayValue !== null && (
          <div
            className={`h-full rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
            style={{ width: `${barWidth}%` }}
          />
        )}
      </div>
    </div>
  );
}

export default function ProbabilitiesPanel({ probabilities, homeTeam, awayTeam }: ProbabilitiesPanelProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Probability Estimates
      </h3>

      {/* Main 1X2 Probabilities */}
      <div className="space-y-4">
        <ProbabilityBar
          label={homeTeam}
          sublabel="Home Win"
          value={probabilities.homeWin}
          color="text-emerald-600"
        />
        <ProbabilityBar
          label="Draw"
          sublabel="X"
          value={probabilities.draw}
          color="text-slate-500"
        />
        <ProbabilityBar
          label={awayTeam}
          sublabel="Away Win"
          value={probabilities.awayWin}
          color="text-blue-600"
        />
      </div>

      {/* Over/Under Section */}
      {(probabilities.over !== null || probabilities.under !== null) && (
        <>
          <div className="border-t border-gray-200 my-6" />
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Over/Under Goals</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Over 2.5</p>
              <p className={`text-2xl font-bold ${probabilities.over !== null ? 'text-orange-600' : 'text-gray-400'}`}>
                {probabilities.over !== null ? `${probabilities.over}%` : 'N/A'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Under 2.5</p>
              <p className={`text-2xl font-bold ${probabilities.under !== null ? 'text-purple-600' : 'text-gray-400'}`}>
                {probabilities.under !== null ? `${probabilities.under}%` : 'N/A'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Visual Summary - Three Columns */}
      <div className="border-t border-gray-200 mt-6 pt-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-xs text-emerald-600 font-medium">1</p>
            <p className="text-xl font-bold text-emerald-700">
              {probabilities.homeWin !== null ? `${probabilities.homeWin}%` : '-'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium">X</p>
            <p className="text-xl font-bold text-slate-700">
              {probabilities.draw !== null ? `${probabilities.draw}%` : '-'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">2</p>
            <p className="text-xl font-bold text-blue-700">
              {probabilities.awayWin !== null ? `${probabilities.awayWin}%` : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
