/**
 * Team Comparison Radar Component
 * 
 * Visual radar/spider chart comparing key stats between teams:
 * - Win Rate
 * - Scoring (Points/Goals per game)
 * - Defense (Points/Goals allowed)
 * - Home/Away Record
 * - Form (Recent results)
 * 
 * Uses SVG for the radar visualization with animated fills.
 */

'use client';

import { AnalyzeResponse, TeamStats } from '@/types';
import { useMemo } from 'react';

interface TeamComparisonRadarProps {
  result: AnalyzeResponse;
}

interface RadarStat {
  label: string;
  shortLabel: string;
  homeValue: number;
  awayValue: number;
  homeDisplay: string;
  awayDisplay: string;
  maxValue: number;
}

// Sport-specific stat configurations
const STAT_CONFIGS: Record<string, {
  stats: string[];
  labels: Record<string, string>;
  shortLabels: Record<string, string>;
}> = {
  soccer: {
    stats: ['winRate', 'goalsFor', 'goalsAgainst', 'cleanSheets', 'form'],
    labels: { winRate: 'Win Rate', goalsFor: 'Goals Scored', goalsAgainst: 'Goals Conceded', cleanSheets: 'Clean Sheets', form: 'Recent Form' },
    shortLabels: { winRate: 'WIN', goalsFor: 'GF', goalsAgainst: 'GA', cleanSheets: 'CS', form: 'FORM' },
  },
  basketball: {
    stats: ['winRate', 'pointsFor', 'pointsAgainst', 'homeRecord', 'form'],
    labels: { winRate: 'Win Rate', pointsFor: 'PPG', pointsAgainst: 'Opp PPG', homeRecord: 'Home Record', form: 'Recent Form' },
    shortLabels: { winRate: 'WIN%', pointsFor: 'PPG', pointsAgainst: 'DEF', homeRecord: 'HOME', form: 'FORM' },
  },
  nfl: {
    stats: ['winRate', 'pointsFor', 'pointsAgainst', 'homeRecord', 'form'],
    labels: { winRate: 'Win Rate', pointsFor: 'PPG', pointsAgainst: 'Opp PPG', homeRecord: 'Home Record', form: 'Recent Form' },
    shortLabels: { winRate: 'WIN%', pointsFor: 'OFF', pointsAgainst: 'DEF', homeRecord: 'HOME', form: 'FORM' },
  },
  hockey: {
    stats: ['winRate', 'goalsFor', 'goalsAgainst', 'homeRecord', 'form'],
    labels: { winRate: 'Win Rate', goalsFor: 'Goals For', goalsAgainst: 'Goals Against', homeRecord: 'Home Record', form: 'Recent Form' },
    shortLabels: { winRate: 'WIN%', goalsFor: 'GF', goalsAgainst: 'GA', homeRecord: 'HOME', form: 'FORM' },
  },
};

function getStatConfig(sport: string) {
  const normalized = sport.toLowerCase();
  if (normalized.includes('soccer') || normalized.includes('football')) return STAT_CONFIGS.soccer;
  if (normalized.includes('nba') || normalized.includes('basketball')) return STAT_CONFIGS.basketball;
  if (normalized.includes('nfl') || normalized.includes('american')) return STAT_CONFIGS.nfl;
  if (normalized.includes('hockey') || normalized.includes('nhl')) return STAT_CONFIGS.hockey;
  return STAT_CONFIGS.basketball; // Default
}

// Calculate polygon points for radar chart
function calculateRadarPoints(
  values: number[], // Normalized 0-1 values
  centerX: number,
  centerY: number,
  radius: number
): string {
  const numPoints = values.length;
  const angleStep = (2 * Math.PI) / numPoints;
  const startAngle = -Math.PI / 2; // Start from top

  return values
    .map((value, i) => {
      const angle = startAngle + i * angleStep;
      const r = radius * Math.max(0.1, value); // Min 10% radius
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');
}

// Generate background grid lines
function generateGridLines(
  centerX: number,
  centerY: number,
  radius: number,
  numPoints: number,
  levels: number = 4
): JSX.Element[] {
  const elements: JSX.Element[] = [];
  const angleStep = (2 * Math.PI) / numPoints;
  const startAngle = -Math.PI / 2;

  // Concentric polygons
  for (let level = 1; level <= levels; level++) {
    const r = (radius * level) / levels;
    const points = Array.from({ length: numPoints }, (_, i) => {
      const angle = startAngle + i * angleStep;
      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
    }).join(' ');
    
    elements.push(
      <polygon
        key={`grid-${level}`}
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-divider"
        opacity={0.3}
      />
    );
  }

  // Radial lines
  for (let i = 0; i < numPoints; i++) {
    const angle = startAngle + i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    elements.push(
      <line
        key={`line-${i}`}
        x1={centerX}
        y1={centerY}
        x2={x}
        y2={y}
        stroke="currentColor"
        strokeWidth="1"
        className="text-divider"
        opacity={0.2}
      />
    );
  }

  return elements;
}

export default function TeamComparisonRadar({ result }: TeamComparisonRadarProps) {
  const { matchInfo, momentumAndForm, probabilities } = result;
  const { homeStats, awayStats, homeMomentumScore, awayMomentumScore } = momentumAndForm;

  // Get sport-specific configuration
  const statConfig = getStatConfig(matchInfo.sport);

  // Build radar stats from available data
  const radarStats = useMemo((): RadarStat[] => {
    const stats: RadarStat[] = [];

    // Win Rate (from stats or probabilities as fallback)
    const homeWinPct = (homeStats as any)?.winPercentage || 
                       ((homeStats?.wins ?? 0) / Math.max(1, (homeStats?.wins ?? 0) + (homeStats?.losses ?? 0))) * 100 ||
                       (probabilities.homeWin ?? 50);
    const awayWinPct = (awayStats as any)?.winPercentage ||
                       ((awayStats?.wins ?? 0) / Math.max(1, (awayStats?.wins ?? 0) + (awayStats?.losses ?? 0))) * 100 ||
                       (probabilities.awayWin ?? 50);
    
    stats.push({
      label: statConfig.labels.winRate,
      shortLabel: statConfig.shortLabels.winRate,
      homeValue: homeWinPct,
      awayValue: awayWinPct,
      homeDisplay: `${Math.round(homeWinPct)}%`,
      awayDisplay: `${Math.round(awayWinPct)}%`,
      maxValue: 100,
    });

    // Scoring (PPG or Goals)
    const isBasketball = matchInfo.sport.toLowerCase().includes('basketball') || 
                         matchInfo.sport.toLowerCase().includes('nba');
    const homeScoring = (homeStats as any)?.pointsPerGame || homeStats?.avgGoalsScored || homeStats?.goalsScored || 0;
    const awayScoring = (awayStats as any)?.pointsPerGame || awayStats?.avgGoalsScored || awayStats?.goalsScored || 0;
    const maxScoring = isBasketball ? 130 : 3.5; // NBA ~130 PPG max, Soccer ~3.5 GPG

    stats.push({
      label: statConfig.labels.pointsFor || statConfig.labels.goalsFor,
      shortLabel: statConfig.shortLabels.pointsFor || statConfig.shortLabels.goalsFor,
      homeValue: homeScoring,
      awayValue: awayScoring,
      homeDisplay: isBasketball ? `${homeScoring.toFixed(1)}` : `${homeScoring.toFixed(2)}`,
      awayDisplay: isBasketball ? `${awayScoring.toFixed(1)}` : `${awayScoring.toFixed(2)}`,
      maxValue: maxScoring,
    });

    // Defense (lower is better, so we invert for visualization)
    const homeDefense = (homeStats as any)?.pointsAllowedPerGame || homeStats?.avgGoalsConceded || homeStats?.goalsConceded || 0;
    const awayDefense = (awayStats as any)?.pointsAllowedPerGame || awayStats?.avgGoalsConceded || awayStats?.goalsConceded || 0;
    const maxDefense = isBasketball ? 130 : 3.5;
    
    // Invert: lower defense = better = higher on chart
    stats.push({
      label: statConfig.labels.pointsAgainst || statConfig.labels.goalsAgainst,
      shortLabel: statConfig.shortLabels.pointsAgainst || statConfig.shortLabels.goalsAgainst,
      homeValue: maxDefense - homeDefense, // Inverted
      awayValue: maxDefense - awayDefense, // Inverted
      homeDisplay: isBasketball ? `${homeDefense.toFixed(1)}` : `${homeDefense.toFixed(2)}`,
      awayDisplay: isBasketball ? `${awayDefense.toFixed(1)}` : `${awayDefense.toFixed(2)}`,
      maxValue: maxDefense,
    });

    // Form/Momentum
    stats.push({
      label: 'Form',
      shortLabel: 'FORM',
      homeValue: homeMomentumScore ?? 5,
      awayValue: awayMomentumScore ?? 5,
      homeDisplay: `${homeMomentumScore ?? '?'}/10`,
      awayDisplay: `${awayMomentumScore ?? '?'}/10`,
      maxValue: 10,
    });

    // Home Record advantage (placeholder based on general home advantage)
    const homeAdvantage = probabilities.homeWin ? (probabilities.homeWin > 50 ? 70 : 50) : 55;
    const awayAdvantage = probabilities.awayWin ? (probabilities.awayWin > 50 ? 70 : 50) : 45;
    
    stats.push({
      label: 'Venue Factor',
      shortLabel: 'VENUE',
      homeValue: homeAdvantage,
      awayValue: awayAdvantage,
      homeDisplay: 'Home',
      awayDisplay: 'Away',
      maxValue: 100,
    });

    return stats;
  }, [homeStats, awayStats, probabilities, homeMomentumScore, awayMomentumScore, matchInfo.sport, statConfig]);

  // Normalize values for radar chart (0-1 scale)
  const homeNormalized = radarStats.map(s => Math.min(1, s.homeValue / s.maxValue));
  const awayNormalized = radarStats.map(s => Math.min(1, s.awayValue / s.maxValue));

  // SVG dimensions
  const size = 220;
  const center = size / 2;
  const radius = 80;

  // Calculate who's winning in more categories
  const homeWinning = radarStats.filter((s, i) => homeNormalized[i] > awayNormalized[i]).length;
  const awayWinning = radarStats.length - homeWinning;

  return (
    <div className="bg-bg-card rounded-2xl border border-divider shadow-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-sm">📊</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Team Comparison</h3>
            <p className="text-[10px] text-text-muted">Key performance metrics</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Home
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger"></span>
            Away
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center mb-4">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full max-w-[220px] h-auto"
        >
          {/* Background grid */}
          {generateGridLines(center, center, radius, radarStats.length)}

          {/* Home team polygon */}
          <polygon
            points={calculateRadarPoints(homeNormalized, center, center, radius)}
            fill="rgba(99, 102, 241, 0.2)"
            stroke="rgb(99, 102, 241)"
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* Away team polygon */}
          <polygon
            points={calculateRadarPoints(awayNormalized, center, center, radius)}
            fill="rgba(239, 68, 68, 0.15)"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* Center point */}
          <circle cx={center} cy={center} r="3" fill="currentColor" className="text-text-muted" />

          {/* Stat labels */}
          {radarStats.map((stat, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / radarStats.length;
            const labelRadius = radius + 25;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            
            return (
              <text
                key={stat.shortLabel}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[9px] font-semibold fill-text-muted"
              >
                {stat.shortLabel}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Stats Breakdown */}
      <div className="space-y-2">
        {radarStats.map((stat, i) => {
          const homeWins = homeNormalized[i] > awayNormalized[i];
          const isDraw = Math.abs(homeNormalized[i] - awayNormalized[i]) < 0.05;
          
          return (
            <div key={stat.label} className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className={`font-medium ${homeWins && !isDraw ? 'text-primary' : 'text-text-secondary'}`}>
                {stat.homeDisplay}
              </span>
              <span className="text-text-muted flex-1 text-center mx-2">{stat.label}</span>
              <span className={`font-medium ${!homeWins && !isDraw ? 'text-danger' : 'text-text-secondary'}`}>
                {stat.awayDisplay}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-divider">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="text-text-muted">Statistical Edge</span>
          <span className={`font-bold ${homeWinning > awayWinning ? 'text-primary' : homeWinning < awayWinning ? 'text-danger' : 'text-accent'}`}>
            {homeWinning > awayWinning 
              ? `${matchInfo.homeTeam} leads ${homeWinning}/${radarStats.length} metrics`
              : homeWinning < awayWinning
                ? `${matchInfo.awayTeam} leads ${awayWinning}/${radarStats.length} metrics`
                : 'Evenly matched'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
