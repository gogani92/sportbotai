/**
 * Responsible Gambling Section Component
 * 
 * Displays analysis.responsibleGambling with core note and
 * tailored note. Links to /responsible-gambling page.
 */

'use client';

import Link from 'next/link';
import { ResponsibleGambling } from '@/types';

interface ResponsibleGamblingSectionProps {
  responsibleGambling: ResponsibleGambling;
}

export default function ResponsibleGamblingSection({ responsibleGambling }: ResponsibleGamblingSectionProps) {
  const { coreNote, tailoredNote } = responsibleGambling;

  return (
    <div className="card bg-amber-50 border-2 border-amber-300">
      <div className="flex items-start gap-4">
        {/* Warning Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            Important Notice
          </h3>

          {/* Core Note */}
          <div className="mb-4 p-3 bg-white/70 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm leading-relaxed font-medium">
              {coreNote}
            </p>
          </div>

          {/* Tailored Note */}
          {tailoredNote && (
            <div className="mb-4 p-3 bg-amber-100/50 rounded-lg border border-amber-200">
              <h4 className="text-xs font-semibold text-amber-700 mb-1">Match-Specific Warning</h4>
              <p className="text-amber-700 text-sm leading-relaxed">
                {tailoredNote}
              </p>
            </div>
          )}

          {/* Help Resources */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/responsible-gambling"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Responsible Gambling Resources
            </Link>
            
            <a
              href="https://www.begambleaware.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-amber-700 text-sm font-medium rounded-lg border border-amber-300 hover:bg-amber-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              BeGambleAware.org
            </a>
          </div>

          {/* Age Restriction */}
          <div className="mt-4 pt-3 border-t border-amber-200">
            <p className="text-xs text-amber-700 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded">
                18+
              </span>
              Gambling is for adults only. Never bet more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
