/**
 * Feature Card Component
 * 
 * Clean feature showcase cards for landing pages.
 * Hover effects and icon support.
 */

'use client';

import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  badge?: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  highlight = false,
  badge,
  className = '',
}: FeatureCardProps) {
  return (
    <div
      className={`
        relative group p-6 rounded-xl
        bg-bg-card border border-white/10
        hover:border-white/20 hover:bg-bg-elevated
        transition-all duration-300
        ${highlight ? 'ring-1 ring-accent/50' : ''}
        ${className}
      `}
    >
      {badge && (
        <span className="absolute -top-2 -right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-accent text-black">
          {badge}
        </span>
      )}
      
      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-4
        ${highlight 
          ? 'bg-accent/20 text-accent' 
          : 'bg-white/5 text-gray-400 group-hover:text-accent group-hover:bg-accent/10'}
        transition-colors duration-300
      `}>
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * Mini Feature Item (for lists)
 */
interface MiniFeatureProps {
  icon: ReactNode;
  text: string;
  className?: string;
}

export function MiniFeature({ icon, text, className = '' }: MiniFeatureProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
        {icon}
      </div>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}

/**
 * Feature Grid
 */
interface FeatureGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({ children, columns = 3, className = '' }: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Large Feature Card with image support
 */
interface LargeFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function LargeFeatureCard({
  icon,
  title,
  description,
  features,
  ctaText,
  ctaHref,
  className = '',
}: LargeFeatureCardProps) {
  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/10 ${className}`}>
      <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      {ctaText && ctaHref && (
        <a
          href={ctaHref}
          className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent-light transition-colors"
        >
          {ctaText}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}

/**
 * Comparison Card (Feature vs Competitors)
 */
interface ComparisonCardProps {
  title: string;
  ourFeatures: { text: string; available: boolean }[];
  className?: string;
}

export function ComparisonCard({ title, ourFeatures, className = '' }: ComparisonCardProps) {
  return (
    <div className={`p-6 rounded-xl bg-bg-card border border-white/10 ${className}`}>
      <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-3">
        {ourFeatures.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            {feature.available ? (
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <span className={feature.available ? 'text-gray-300' : 'text-gray-500'}>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
