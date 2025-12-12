/**
 * Analyzer Page (/analyzer)
 * 
 * Main page for AI-powered multi-sport match analysis.
 * Clean 3-step flow: Select Sport → Select League → Select Match
 * 
 * Uses Apple-style premium redesign for results display.
 */

'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MatchSelector } from '@/components/match-selector';
import { UsageCounter } from '@/components/analyzer';
import { AnalysisResultsRedesign } from '@/components/analyzer/redesign';
import UsageLimitBanner from '@/components/UsageLimitBanner';
import OnboardingOverlay from '@/components/OnboardingOverlay';
import { AnalysisResultSkeleton } from '@/components/ui';
import { AnalyzeResponse } from '@/types';

type ViewState = 'form' | 'loading' | 'results' | 'error';

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 30,
  PREMIUM: -1,
};

export default function AnalyzerPage() {
  const { data: session } = useSession();
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [viewState, setViewState] = useState<ViewState>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResult = useCallback((analysisResult: AnalyzeResponse) => {
    setResult(analysisResult);
    if (analysisResult.success) {
      setViewState('results');
      setErrorMessage(null);
    } else {
      setViewState('error');
      setErrorMessage(analysisResult.error || 'Unknown error occurred');
    }
  }, []);

  const handleLoading = useCallback((isLoading: boolean) => {
    if (isLoading) {
      setViewState('loading');
      setErrorMessage(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setViewState('form');
    setErrorMessage(null);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header Section */}
      <section className="bg-bg-card border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Match Analyzer</h1>
              <p className="text-text-secondary text-sm">
                AI-powered probability analysis, value detection, and risk assessment
              </p>
            </div>
            
            {/* Quick Stats */}
            {viewState === 'form' && (
              <div className="flex items-center gap-4 text-sm">
                <UsageCounter />
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span>Live data</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Limit Banner for users running low */}
        {viewState === 'form' && session?.user && (() => {
          const plan = session.user.plan || 'FREE';
          const limit = PLAN_LIMITS[plan] ?? 3;
          const used = session.user.analysisCount || 0;
          const remaining = limit === -1 ? Infinity : Math.max(0, limit - used);
          
          // Show banner when at limit or 1 left (for free users)
          if (plan === 'FREE' && remaining <= 1) {
            return (
              <div className="mb-6">
                <UsageLimitBanner 
                  remaining={remaining} 
                  limit={limit} 
                  variant="full" 
                />
              </div>
            );
          }
          return null;
        })()}

        {/* Match Selection View */}
        {(viewState === 'form' || viewState === 'loading') && (
          <div className="bg-bg-card rounded-2xl border border-divider shadow-card p-6 md:p-8">
            {viewState === 'loading' ? (
              /* Premium Loading Skeleton */
              <AnalysisResultSkeleton />
            ) : (
              /* Match Selector */
              <MatchSelector onResult={handleResult} onLoading={handleLoading} />
            )}
          </div>
        )}

        {/* Error View */}
        {viewState === 'error' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-bg-card rounded-2xl border border-danger/30 p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-danger/15 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                <p className="text-text-secondary mb-6 max-w-md">
                  {errorMessage || 'An unexpected error occurred while analyzing the match.'}
                </p>
                <button onClick={handleReset} className="btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {viewState === 'results' && result && (
          <div>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-white/50 hover:text-white font-medium transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Analyze Another Match
              </button>
            </div>

            {/* Analysis Results - Premium Redesign */}
            <AnalysisResultsRedesign result={result} />
          </div>
        )}
      </section>

      {/* First-Time User Onboarding */}
      <OnboardingOverlay />
    </div>
  );
}
