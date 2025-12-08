/**
 * Value Analysis Card Component
 * 
 * Displays analysis.valueAnalysis with implied probabilities,
 * value flags, best value side, and expandable detailed comment.
 */

'use client';

import { useState } from 'react';
import { ValueAnalysis, ValueFlag, BestValueSide } from '@/types';

interface ValueAnalysisCardProps {
  valueAnalysis: ValueAnalysis;
}

const valueFlagConfig: Record<ValueFlag, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
  NONE: { label: 'No Value', bgColor: 'bg-gray-100', textColor: 'text-gray-600', borderColor: 'border-gray-200' },
  LOW: { label: 'Low Value', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
  MEDIUM: { label: 'Medium Value', bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200' },
  HIGH: { label: 'High Value', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700', borderColor: 'border-emerald-300' },
};

const bestValueSideConfig: Record<BestValueSide, { label: string; color: string }> = {
  HOME: { label: 'Home Win', color: 'text-emerald-600' },
  DRAW: { label: 'Draw', color: 'text-slate-600' },
  AWAY: { label: 'Away Win', color: 'text-blue-600' },
  NONE: { label: 'No Clear Value', color: 'text-gray-500' },
};

interface ValueFlagBadgeProps {
  label: string;
  impliedProb: number | null;
  flag: ValueFlag;
}

function ValueFlagBadge({ label, impliedProb, flag }: ValueFlagBadgeProps) {
  const config = valueFlagConfig[flag];
  
  return (
    <div className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800">
        {impliedProb !== null ? `${impliedProb.toFixed(1)}%` : 'N/A'}
      </p>
      <span className={`inline-block mt-1 text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}

export default function ValueAnalysisCard({ valueAnalysis }: ValueAnalysisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const bestValueConfig = bestValueSideConfig[valueAnalysis.bestValueSide];

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Value Analysis
      </h3>

      {/* Implied Probabilities with Value Flags */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ValueFlagBadge
          label="Home Win"
          impliedProb={valueAnalysis.impliedProbabilities.homeWin}
          flag={valueAnalysis.valueFlags.homeWin}
        />
        <ValueFlagBadge
          label="Draw"
          impliedProb={valueAnalysis.impliedProbabilities.draw}
          flag={valueAnalysis.valueFlags.draw}
        />
        <ValueFlagBadge
          label="Away Win"
          impliedProb={valueAnalysis.impliedProbabilities.awayWin}
          flag={valueAnalysis.valueFlags.awayWin}
        />
      </div>

      {/* Best Value Side */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Best Value Side:</span>
          <span className={`font-bold ${bestValueConfig.color}`}>
            {valueAnalysis.bestValueSide !== 'NONE' ? (
              <>
                <span className="text-lg mr-1">
                  {valueAnalysis.bestValueSide === 'HOME' ? '🏠' : 
                   valueAnalysis.bestValueSide === 'AWAY' ? '✈️' : '🤝'}
                </span>
                {bestValueConfig.label}
              </>
            ) : (
              bestValueConfig.label
            )}
          </span>
        </div>
      </div>

      {/* Short Comment (always visible) */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {valueAnalysis.valueCommentShort}
        </p>
      </div>

      {/* Expandable Detailed Comment */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="font-medium">
            {isExpanded ? 'Hide detailed analysis' : 'Show detailed analysis'}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm leading-relaxed">
              {valueAnalysis.valueCommentDetailed}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
