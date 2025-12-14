/**
 * Stats Card Component
 * 
 * Clean, professional stats display card.
 * Perfect for dashboards and data visualization.
 */

'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  className = '',
}: StatsCardProps) {
  const variantStyles = {
    default: {
      border: 'border-white/10',
      iconBg: 'bg-white/5',
      iconText: 'text-gray-400',
    },
    accent: {
      border: 'border-accent/20',
      iconBg: 'bg-accent/10',
      iconText: 'text-accent',
    },
    success: {
      border: 'border-green-500/20',
      iconBg: 'bg-green-500/10',
      iconText: 'text-green-400',
    },
    warning: {
      border: 'border-yellow-500/20',
      iconBg: 'bg-yellow-500/10',
      iconText: 'text-yellow-400',
    },
    danger: {
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/10',
      iconText: 'text-red-400',
    },
  };

  const sizeStyles = {
    sm: {
      padding: 'p-3',
      title: 'text-xs',
      value: 'text-xl',
      subtitle: 'text-[10px]',
      iconSize: 'w-8 h-8',
    },
    md: {
      padding: 'p-4',
      title: 'text-sm',
      value: 'text-2xl',
      subtitle: 'text-xs',
      iconSize: 'w-10 h-10',
    },
    lg: {
      padding: 'p-5',
      title: 'text-base',
      value: 'text-3xl',
      subtitle: 'text-sm',
      iconSize: 'w-12 h-12',
    },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const trendColor = trend?.direction === 'up' ? 'text-green-400' : trend?.direction === 'down' ? 'text-red-400' : 'text-gray-400';
  const trendIcon = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';

  return (
    <div className={`bg-bg-card rounded-xl border ${v.border} ${s.padding} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${s.title} text-gray-400 font-medium mb-1`}>{title}</p>
          <p className={`${s.value} font-bold text-white tabular-nums`}>{value}</p>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {subtitle && <span className={`${s.subtitle} text-gray-500`}>{subtitle}</span>}
              {trend && (
                <span className={`${s.subtitle} ${trendColor} font-medium flex items-center gap-0.5`}>
                  {trendIcon} {trend.value > 0 ? '+' : ''}{trend.value}%
                  {trend.label && <span className="text-gray-500 ml-1">{trend.label}</span>}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={`${s.iconSize} ${v.iconBg} rounded-lg flex items-center justify-center ${v.iconText}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Stats Row - Horizontal stats display
 */
interface StatsRowProps {
  stats: Array<{
    label: string;
    value: string | number;
    highlight?: boolean;
  }>;
  className?: string;
}

export function StatsRow({ stats, className = '' }: StatsRowProps) {
  return (
    <div className={`flex items-center divide-x divide-white/10 ${className}`}>
      {stats.map((stat, i) => (
        <div key={i} className="px-4 first:pl-0 last:pr-0 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">{stat.label}</p>
          <p className={`text-lg font-bold tabular-nums ${stat.highlight ? 'text-accent' : 'text-white'}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Mini Stats Grid
 */
interface MiniStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    color?: 'default' | 'green' | 'red' | 'yellow' | 'blue';
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MiniStats({ stats, columns = 3, className = '' }: MiniStatsProps) {
  const colorMap = {
    default: 'text-white',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
  };
  
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 ${className}`}>
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
          <p className={`text-lg font-bold tabular-nums ${colorMap[stat.color || 'default']}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Progress Stats Card
 */
interface ProgressStatsCardProps {
  title: string;
  current: number;
  max: number;
  unit?: string;
  showPercentage?: boolean;
  color?: 'accent' | 'blue' | 'green' | 'yellow';
  className?: string;
}

export function ProgressStatsCard({
  title,
  current,
  max,
  unit = '',
  showPercentage = true,
  color = 'accent',
  className = '',
}: ProgressStatsCardProps) {
  const percentage = Math.round((current / max) * 100);
  
  const colorMap = {
    accent: 'bg-accent',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className={`bg-bg-card rounded-xl border border-white/10 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        {showPercentage && (
          <span className="text-xs text-gray-500">{percentage}%</span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-3">
        {current.toLocaleString()}{unit && <span className="text-gray-400 text-lg ml-1">{unit}</span>}
        <span className="text-gray-600 text-base font-normal"> / {max.toLocaleString()}{unit}</span>
      </p>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorMap[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
