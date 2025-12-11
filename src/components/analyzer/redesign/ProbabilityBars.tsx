/**
 * Probability Bars Component
 * 
 * Clean, Apple-style horizontal probability visualization.
 * Shows home/draw/away with animated bars, team logos, and clear labels.
 */

'use client';

import { AnalyzeResponse } from '@/types';
import { TeamLogo } from '@/components/ui';

interface ProbabilityBarsProps {
  result: AnalyzeResponse;
}

export default function ProbabilityBars({ result }: ProbabilityBarsProps) {
  const { matchInfo, probabilities } = result;
  const home = probabilities.homeWin ?? 0;
  const draw = probabilities.draw;
  const away = probabilities.awayWin ?? 0;

  // Determine which is highest
  const max = Math.max(home, away, draw ?? 0);

  const bars = [
    { 
      label: matchInfo.homeTeam, 
      value: home, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: home === max ? 'text-blue-400' : 'text-white/60',
      isMax: home === max,
      sublabel: 'Home',
      showLogo: true
    },
    ...(draw !== null ? [{
      label: 'Draw',
      value: draw,
      color: 'from-white/40 to-white/30',
      bgColor: 'bg-white/5',
      textColor: draw === max ? 'text-white' : 'text-white/50',
      isMax: draw === max,
      sublabel: null,
      showLogo: false
    }] : []),
    {
      label: matchInfo.awayTeam,
      value: away,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-500/10',
      textColor: away === max ? 'text-rose-400' : 'text-white/60',
      isMax: away === max,
      sublabel: 'Away',
      showLogo: true
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#111114] border border-white/[0.06]">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-rose-500" />
            <h3 className="text-sm font-medium text-white/70">Win Probability</h3>
          </div>
          <span className="text-xs text-white/40">AI Estimated</span>
        </div>

        {/* Bars */}
        <div className="space-y-4">
          {bars.map((bar, index) => (
            <div key={index} className="group">
              {/* Label Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {bar.showLogo && (
                    <TeamLogo 
                      teamName={bar.label} 
                      sport={matchInfo.sport} 
                      league={matchInfo.leagueName}
                      size="sm"
                    />
                  )}
                  <span className={`text-sm font-medium ${bar.textColor} truncate max-w-[120px] sm:max-w-[180px]`}>
                    {bar.label}
                  </span>
                  {bar.sublabel && (
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">{bar.sublabel}</span>
                  )}
                </div>
                <span className={`text-lg font-semibold tabular-nums ${bar.isMax ? bar.textColor : 'text-white/50'}`}>
                  {bar.value.toFixed(0)}%
                </span>
              </div>
              
              {/* Bar */}
              <div className={`relative h-2 rounded-full ${bar.bgColor} overflow-hidden`}>
                <div 
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.color} transition-all duration-700 ease-out`}
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
