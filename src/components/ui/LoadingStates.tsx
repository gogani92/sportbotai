/**
 * Loading States & Skeletons
 * 
 * Premium loading experiences for different components.
 * Apple-style shimmer effects and smooth transitions.
 */

'use client';

import { useEffect, useState } from 'react';

// ============================================
// ANALYSIS RESULT SKELETON
// ============================================
export function AnalysisResultSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* Hero Zone Skeleton */}
      <div className="relative px-4 sm:px-8 pt-8 pb-6">
        {/* League/Date */}
        <div className="flex justify-center mb-2">
          <div className="h-4 w-40 rounded-full skeleton" />
        </div>

        {/* Teams */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
          {/* Home Team */}
          <div className="text-center flex-1 max-w-[140px]">
            <div className="w-16 h-16 rounded-full skeleton mx-auto mb-2" />
            <div className="h-4 w-24 rounded skeleton mx-auto mb-1" />
            <div className="h-3 w-12 rounded skeleton mx-auto" />
          </div>
          
          <div className="h-6 w-8 rounded skeleton" />
          
          {/* Away Team */}
          <div className="text-center flex-1 max-w-[140px]">
            <div className="w-16 h-16 rounded-full skeleton mx-auto mb-2" />
            <div className="h-4 w-24 rounded skeleton mx-auto mb-1" />
            <div className="h-3 w-12 rounded skeleton mx-auto" />
          </div>
        </div>

        {/* Verdict */}
        <div className="text-center mb-6">
          <div className="h-3 w-20 rounded skeleton mx-auto mb-3" />
          <div className="h-12 w-48 rounded-lg skeleton mx-auto mb-3" />
          <div className="h-8 w-32 rounded skeleton mx-auto" />
        </div>

        {/* Probability Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="h-3 rounded-full skeleton mb-2" />
          <div className="flex justify-between">
            <div className="h-3 w-8 rounded skeleton" />
            <div className="h-3 w-8 rounded skeleton" />
            <div className="h-3 w-8 rounded skeleton" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <div className="h-7 w-24 rounded-full skeleton" />
          <div className="h-7 w-24 rounded-full skeleton" />
          <div className="h-7 w-28 rounded-full skeleton" />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <div className="h-10 w-24 rounded-xl skeleton" />
          <div className="h-10 w-24 rounded-xl skeleton" />
          <div className="h-10 w-10 rounded-xl skeleton" />
        </div>
      </div>

      {/* Story Section Skeleton */}
      <div className="px-4 sm:px-8 py-8 border-t border-white/[0.06]">
        <div className="h-3 w-28 rounded skeleton mb-5" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
              <div className="flex-1 pt-1">
                <div className="h-4 rounded skeleton mb-2" />
                <div className="h-4 w-3/4 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MATCH CARD SKELETON
// ============================================
export function MatchCardSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl border border-divider p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 rounded skeleton" />
        <div className="h-3 w-16 rounded skeleton" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-4 w-28 rounded skeleton mb-2" />
          <div className="h-4 w-24 rounded skeleton" />
        </div>
        <div className="w-10 h-10 rounded-full skeleton" />
      </div>
    </div>
  );
}

// ============================================
// TRENDING SECTION SKELETON
// ============================================
export function TrendingSectionSkeleton() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-40 rounded skeleton mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// BUTTON WITH LOADING STATE
// ============================================
interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function LoadingButton({ 
  children, 
  loading, 
  disabled, 
  onClick, 
  className = '',
  variant = 'primary'
}: LoadingButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
}

// ============================================
// PROGRESS INDICATOR
// ============================================
interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
            ${i < currentStep 
              ? 'bg-accent text-black' 
              : i === currentStep 
              ? 'bg-primary text-white ring-2 ring-primary/30 ring-offset-2 ring-offset-bg' 
              : 'bg-white/10 text-white/40'
            }
          `}>
            {i < currentStep ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 transition-all duration-300 ${i < currentStep ? 'bg-accent' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// PULSE DOT (for live indicators)
// ============================================
export function PulseDot({ color = 'accent' }: { color?: 'accent' | 'success' | 'warning' | 'danger' }) {
  const colors = {
    accent: 'bg-accent',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  return (
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[color]}`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[color]}`} />
    </span>
  );
}

// ============================================
// PAGE TRANSITION WRAPPER
// ============================================
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
}

// ============================================
// CONTENT PLACEHOLDER
// ============================================
export function ContentPlaceholder({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white/40">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-sm">{description}</p>
    </div>
  );
}
