/**
 * Risk Analysis Card Component
 * 
 * Displays analysis.riskAnalysis with overall risk level,
 * risk explanation, bankroll impact, and psychology bias.
 */

'use client';

import { RiskAnalysis, RiskLevel } from '@/types';

interface RiskAnalysisCardProps {
  riskAnalysis: RiskAnalysis;
}

const riskLevelConfig: Record<RiskLevel, { 
  label: string; 
  bgColor: string; 
  textColor: string; 
  borderColor: string;
  iconBg: string;
  icon: string;
}> = {
  LOW: { 
    label: 'Low Risk', 
    bgColor: 'bg-green-50', 
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    icon: '✓'
  },
  MEDIUM: { 
    label: 'Medium Risk', 
    bgColor: 'bg-amber-50', 
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    icon: '⚠'
  },
  HIGH: { 
    label: 'High Risk', 
    bgColor: 'bg-red-50', 
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
    icon: '⚡'
  },
};

export default function RiskAnalysisCard({ riskAnalysis }: RiskAnalysisCardProps) {
  const config = riskLevelConfig[riskAnalysis.overallRiskLevel];

  return (
    <div className={`card border-2 ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-start gap-4">
        {/* Risk Level Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center`}>
          <span className="text-2xl">{config.icon}</span>
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Risk Assessment
            </h3>
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${config.textColor} ${config.iconBg}`}>
              {config.label}
            </span>
          </div>

          {/* Risk Explanation */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Risk Explanation</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {riskAnalysis.riskExplanation}
            </p>
          </div>

          {/* Bankroll Impact */}
          <div className="mb-4 p-3 bg-white/70 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Bankroll Impact
            </h4>
            <p className="text-gray-600 text-sm">
              {riskAnalysis.bankrollImpact}
            </p>
          </div>

          {/* Psychology Bias */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Psychology Alert: {riskAnalysis.psychologyBias.name}
            </h4>
            <p className="text-purple-700 text-sm">
              {riskAnalysis.psychologyBias.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
