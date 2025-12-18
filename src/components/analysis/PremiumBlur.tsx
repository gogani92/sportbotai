/**
 * Premium Blur Component
 * 
 * Layer 2 of the two-layer blur system.
 * Shows upgrade CTA for non-Pro users matching Market Alerts design.
 * 
 * Design:
 * - Gradient border card
 * - Feature checklist
 * - "Upgrade to Pro" CTA button
 */

'use client';

import Link from 'next/link';

interface PremiumBlurProps {
  /** The content to blur/show */
  children: React.ReactNode;
  /** Whether the user has Pro/Premium access */
  isPro: boolean;
  /** Optional title for the blur overlay */
  title?: string;
  /** Optional description for the blur overlay */
  description?: string;
}

export function PremiumBlur({
  children,
  isPro,
  title = 'Pro Match Analysis',
  description = 'Unlock detailed match insights, game flow predictions, and value detection.',
}: PremiumBlurProps) {
  // If Pro user, just render children normally
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="mt-4">
      {/* Premium Gate Card - matching Market Alerts style */}
      <div className="bg-gradient-to-br from-[#0a0a0b] via-[#0a0a0b] to-violet-500/5 border border-violet-500/30 rounded-2xl p-6 text-center">
        {/* Lock Icon */}
        <div className="text-4xl mb-4">🔒</div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">
          {description}
        </p>
        
        {/* Feature List */}
        <div className="bg-black/30 rounded-xl p-4 mb-5 text-left max-w-xs mx-auto">
          <h4 className="font-semibold text-white mb-3 text-center text-sm">What you get:</h4>
          <ul className="space-y-2 text-zinc-300 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-violet-400">✓</span>
              Match snapshot & key insights
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">✓</span>
              Game flow predictions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">✓</span>
              Value detection & odds analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">✓</span>
              30 analyses per day
            </li>
          </ul>
        </div>
        
        {/* CTA Button */}
        <Link
          href="/pricing"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Upgrade to Pro – €9/mo
        </Link>
      </div>
    </div>
  );
}

export default PremiumBlur;
