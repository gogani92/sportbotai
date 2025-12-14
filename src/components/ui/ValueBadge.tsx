/**
 * Value Badge Component
 * 
 * Displays value percentage with visual styling.
 * Inspired by sports-ai.dev value bet indicators.
 */

'use client';

interface ValueBadgeProps {
  value: number; // Percentage like 8.86 for +8.86%
  size?: 'sm' | 'md' | 'lg';
  showPlus?: boolean;
  className?: string;
}

export default function ValueBadge({ 
  value, 
  size = 'md', 
  showPlus = true,
  className = '' 
}: ValueBadgeProps) {
  // Determine color based on value
  const getColorClasses = () => {
    if (value >= 10) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (value >= 5) return 'bg-green-500/15 text-green-400 border-green-500/25';
    if (value >= 2) return 'bg-lime-500/15 text-lime-400 border-lime-500/25';
    if (value > 0) return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25';
    return 'bg-gray-500/15 text-gray-400 border-gray-500/25';
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  };

  const prefix = showPlus && value > 0 ? '+' : '';

  return (
    <span 
      className={`
        inline-flex items-center font-semibold tabular-nums rounded-md border
        ${getColorClasses()} 
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      {prefix}{value.toFixed(2)}%
    </span>
  );
}

/**
 * Live Indicator Badge
 * Shows real-time / live status
 */
interface LiveBadgeProps {
  isLive?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function LiveBadge({ isLive = true, size = 'md', className = '' }: LiveBadgeProps) {
  if (!isLive) return null;
  
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1',
    md: 'text-[10px] px-2 py-0.5 gap-1.5',
  };
  
  return (
    <span className={`inline-flex items-center font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 rounded ${sizeClasses[size]} ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
      </span>
      Live
    </span>
  );
}

/**
 * Stats Badge
 * For displaying stats like ROI, Win Rate, etc.
 */
interface StatBadgeProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatBadge({ label, value, trend, size = 'md', className = '' }: StatBadgeProps) {
  const sizeConfig = {
    sm: { container: 'px-2 py-1', label: 'text-[9px]', value: 'text-xs' },
    md: { container: 'px-3 py-1.5', label: 'text-[10px]', value: 'text-sm' },
    lg: { container: 'px-4 py-2', label: 'text-xs', value: 'text-base' },
  };
  
  const config = sizeConfig[size];
  
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '';
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : '';

  return (
    <div className={`inline-flex flex-col items-center bg-white/5 border border-white/10 rounded-lg ${config.container} ${className}`}>
      <span className={`${config.label} text-gray-500 uppercase tracking-wider`}>{label}</span>
      <span className={`${config.value} font-bold text-white flex items-center gap-1`}>
        {value}
        {trendIcon && <span className={trendColor}>{trendIcon}</span>}
      </span>
    </div>
  );
}

/**
 * Confidence Badge
 * Shows AI confidence level
 */
interface ConfidenceBadgeProps {
  level: 'low' | 'medium' | 'high' | 'very-high';
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ConfidenceBadge({ level, showIcon = true, size = 'md', className = '' }: ConfidenceBadgeProps) {
  const config = {
    'low': { bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/25', label: 'Low', icon: '○' },
    'medium': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/25', label: 'Medium', icon: '◐' },
    'high': { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/25', label: 'High', icon: '◑' },
    'very-high': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Very High', icon: '●' },
  };
  
  const c = config[level];
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded border ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]} ${className}`}>
      {showIcon && <span>{c.icon}</span>}
      {c.label}
    </span>
  );
}

/**
 * Hot/Trending Badge
 */
interface HotBadgeProps {
  score?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function HotBadge({ score, size = 'md', className = '' }: HotBadgeProps) {
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
  };
  
  // Color intensity based on score
  const intensity = score && score >= 9 ? 'from-orange-500 to-red-500' : 'from-orange-400 to-red-400';

  return (
    <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wide bg-gradient-to-r ${intensity} text-white rounded-full shadow-lg shadow-orange-500/20 ${sizeClasses[size]} ${className}`}>
      🔥 HOT
    </span>
  );
}
