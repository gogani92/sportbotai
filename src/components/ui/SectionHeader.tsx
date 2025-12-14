/**
 * Section Header Component
 * 
 * Clean section headers for organizing content.
 * Sports-AI.dev inspired minimal headers.
 */

'use client';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'accent' | 'blue' | 'orange' | 'purple' | 'red';
  rightContent?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'accent',
  rightContent,
  className = '',
}: SectionHeaderProps) {
  const badgeColors = {
    accent: 'bg-accent/20 text-accent',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-3">
        {badge && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </div>
  );
}

/**
 * Section Divider
 */
export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 ${className}`} />
  );
}

/**
 * Page Title
 */
interface PageTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, badge, className = '' }: PageTitleProps) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      {badge && (
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/20 text-accent mb-4">
          {badge}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * Mini Header
 */
interface MiniHeaderProps {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function MiniHeader({ icon, title, action, className = '' }: MiniHeaderProps) {
  return (
    <div className={`flex items-center justify-between py-2 ${className}`}>
      <div className="flex items-center gap-2 text-gray-400">
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      {action}
    </div>
  );
}
