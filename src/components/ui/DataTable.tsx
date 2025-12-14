/**
 * Data Table Component
 * 
 * Clean, responsive data tables for match stats and predictions.
 * Inspired by sports-ai.dev data visualization.
 */

'use client';

import { ReactNode } from 'react';

/**
 * Base Table
 */
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  compact?: boolean;
  striped?: boolean;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  compact = false,
  striped = false,
  className = '',
}: DataTableProps<T>) {
  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';
  
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (data.length === 0) {
    return (
      <div className={`bg-bg-card rounded-xl border border-white/10 p-8 text-center ${className}`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-bg-card rounded-xl border border-white/10 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    ${cellPadding} ${alignClass[col.align || 'left']}
                    text-[11px] font-semibold text-gray-500 uppercase tracking-wider
                    ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}
                  `}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`
                  border-b border-white/5 last:border-b-0
                  ${onRowClick ? 'cursor-pointer hover:bg-white/[0.03]' : ''}
                  ${striped && index % 2 === 1 ? 'bg-white/[0.01]' : ''}
                  transition-colors
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      ${cellPadding} ${alignClass[col.align || 'left']}
                      text-sm text-gray-300
                      ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}
                    `}
                  >
                    {col.render 
                      ? col.render(item) 
                      : String(item[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Simple Stats Table (2 columns: label & value)
 */
interface StatsTableRow {
  label: string;
  value: string | number | ReactNode;
  highlight?: boolean;
}

interface StatsTableProps {
  rows: StatsTableRow[];
  title?: string;
  compact?: boolean;
  className?: string;
}

export function StatsTable({ rows, title, compact = false, className = '' }: StatsTableProps) {
  const padding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className={`bg-bg-card rounded-xl border border-white/10 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        </div>
      )}
      <table className="w-full">
        <tbody>
          {rows.map((row, i) => (
            <tr 
              key={i}
              className={`
                border-b border-white/5 last:border-b-0
                ${row.highlight ? 'bg-accent/5' : ''}
              `}
            >
              <td className={`${padding} text-sm text-gray-400`}>{row.label}</td>
              <td className={`${padding} text-sm text-right font-medium ${row.highlight ? 'text-accent' : 'text-white'}`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Comparison Table (Home vs Away)
 */
interface ComparisonRow {
  label: string;
  home: string | number;
  away: string | number;
  homeWins?: boolean;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
  homeLabel?: string;
  awayLabel?: string;
  title?: string;
  className?: string;
}

export function ComparisonTable({
  rows,
  homeLabel = 'Home',
  awayLabel = 'Away',
  title,
  className = '',
}: ComparisonTableProps) {
  return (
    <div className={`bg-bg-card rounded-xl border border-white/10 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        </div>
      )}
      
      {/* Header */}
      <div className="grid grid-cols-3 px-4 py-2 border-b border-white/10 bg-white/[0.02]">
        <div className="text-xs font-semibold text-blue-400 text-left">{homeLabel}</div>
        <div className="text-xs font-semibold text-gray-500 text-center">Stat</div>
        <div className="text-xs font-semibold text-emerald-400 text-right">{awayLabel}</div>
      </div>
      
      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-3 items-center px-4 py-3 border-b border-white/5 last:border-b-0"
        >
          <div className={`text-sm font-medium text-left ${row.homeWins === true ? 'text-blue-400' : row.homeWins === false ? 'text-gray-500' : 'text-white'}`}>
            {row.home}
          </div>
          <div className="text-xs text-gray-500 text-center">{row.label}</div>
          <div className={`text-sm font-medium text-right ${row.homeWins === false ? 'text-emerald-400' : row.homeWins === true ? 'text-gray-500' : 'text-white'}`}>
            {row.away}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Mini Stats List (vertical)
 */
interface MiniStatItem {
  icon?: ReactNode;
  label: string;
  value: string | number;
  color?: 'default' | 'accent' | 'blue' | 'red' | 'orange';
}

interface MiniStatsListProps {
  items: MiniStatItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export function MiniStatsList({ items, columns = 2, className = '' }: MiniStatsListProps) {
  const colorClass = {
    default: 'text-white',
    accent: 'text-accent',
    blue: 'text-blue-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 ${className}`}>
      {items.map((item, i) => (
        <div 
          key={i}
          className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5"
        >
          {item.icon && (
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
              {item.icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 truncate">{item.label}</p>
            <p className={`text-lg font-bold ${colorClass[item.color || 'default']}`}>{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
