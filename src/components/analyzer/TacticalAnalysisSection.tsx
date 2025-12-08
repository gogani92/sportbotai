/**
 * Tactical Analysis Section Component
 * 
 * Displays analysis.tacticalAnalysis with styles summary,
 * match narrative, key match factors, and expert conclusion.
 */

'use client';

import { TacticalAnalysis } from '@/types';

interface TacticalAnalysisSectionProps {
  tacticalAnalysis: TacticalAnalysis;
}

export default function TacticalAnalysisSection({ tacticalAnalysis }: TacticalAnalysisSectionProps) {
  const { stylesSummary, matchNarrative, keyMatchFactors, expertConclusionOneLiner } = tacticalAnalysis;

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Tactical Analysis
      </h3>

      {/* Styles Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          Playing Styles
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {stylesSummary}
        </p>
      </div>

      {/* Match Narrative */}
      <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Match Narrative
        </h4>
        <p className="text-gray-700 text-sm leading-relaxed">
          {matchNarrative}
        </p>
      </div>

      {/* Key Match Factors */}
      {keyMatchFactors && keyMatchFactors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Key Match Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {keyMatchFactors.map((factor, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Conclusion */}
      <div className="border-t border-gray-200 pt-4">
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <div>
              <p className="text-xs text-primary-600 font-semibold mb-1">Expert Conclusion</p>
              <p className="text-primary-800 font-medium italic text-lg leading-relaxed">
                &ldquo;{expertConclusionOneLiner}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
