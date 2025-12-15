/**
 * Registration Blur Component
 * 
 * Layer 1 of the two-layer blur system.
 * Shows a blur overlay for non-authenticated users with a CTA to create a free account.
 * 
 * Design:
 * - Blurred preview of content behind
 * - "Create Free Account" CTA in center
 * - Lock icon and value proposition
 */

'use client';

import Link from 'next/link';

interface RegistrationBlurProps {
  /** The content to blur/show */
  children: React.ReactNode;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Optional title for the blur overlay */
  title?: string;
  /** Optional description for the blur overlay */
  description?: string;
}

export function RegistrationBlur({
  children,
  isAuthenticated,
  title = 'Full Analysis Unlocked',
  description = 'Create a free account to access complete match intelligence, signals, and AI insights.',
}: RegistrationBlurProps) {
  // If authenticated, just render children normally
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="blur-[8px] opacity-40 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay with CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#050506]/60 backdrop-blur-sm rounded-2xl">
        <div className="text-center px-6 py-8 max-w-sm">
          {/* Lock icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <svg 
              className="w-5 h-5 text-emerald-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-2">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            {description}
          </p>
          
          {/* CTA Button */}
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Create Free Account</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          {/* Sign in link */}
          <p className="mt-4 text-xs text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </p>
          
          {/* Bullet points - What they get */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex flex-wrap justify-center gap-3 text-[10px] text-zinc-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Match Signals
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> AI Insights
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Game Flow
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationBlur;
