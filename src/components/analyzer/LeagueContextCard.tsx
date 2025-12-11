/**
 * League Context Card Component
 * 
 * Displays league standings context for both teams:
 * - Current position in table
 * - Points/wins behind leader
 * - Zone context (playoff, relegation, promotion)
 * - Conference/division for American sports
 * 
 * Uses data from API-Sports standings integration.
 */

'use client';

import { AnalyzeResponse, TeamStats } from '@/types';

interface LeagueContextCardProps {
  result: AnalyzeResponse;
}

// Zone definitions by sport
interface ZoneConfig {
  playoff: number[];        // Positions that make playoffs
  promotion?: number[];     // Positions that get promoted
  relegation?: number[];    // Positions that get relegated
  playIn?: number[];        // Play-in tournament positions
}

const ZONE_CONFIGS: Record<string, ZoneConfig> = {
  soccer: {
    playoff: [1, 2, 3, 4],      // Champions League spots
    promotion: [1, 2],          // Auto promotion (if 2nd tier)
    relegation: [18, 19, 20],   // Relegation zone
  },
  nba: {
    playoff: [1, 2, 3, 4, 5, 6],
    playIn: [7, 8, 9, 10],
  },
  nfl: {
    playoff: [1, 2, 3, 4, 5, 6, 7],
  },
  hockey: {
    playoff: [1, 2, 3],         // Division leaders
    playIn: [4, 5, 6, 7, 8],    // Wild card contenders
  },
  default: {
    playoff: [1, 2, 3, 4],
  },
};

function getZoneConfig(sport: string): ZoneConfig {
  const normalized = sport.toLowerCase();
  if (normalized.includes('soccer') || normalized.includes('football')) return ZONE_CONFIGS.soccer;
  if (normalized.includes('nba') || normalized.includes('basketball')) return ZONE_CONFIGS.nba;
  if (normalized.includes('nfl') || normalized.includes('american')) return ZONE_CONFIGS.nfl;
  if (normalized.includes('hockey') || normalized.includes('nhl')) return ZONE_CONFIGS.hockey;
  return ZONE_CONFIGS.default;
}

function getPositionZone(position: number | undefined, config: ZoneConfig): {
  zone: 'leader' | 'playoff' | 'playIn' | 'midTable' | 'relegation' | 'unknown';
  label: string;
  color: string;
  bgColor: string;
} {
  if (!position) {
    return { zone: 'unknown', label: 'N/A', color: 'text-text-muted', bgColor: 'bg-bg-tertiary' };
  }

  if (position === 1) {
    return { zone: 'leader', label: 'Leader', color: 'text-warning', bgColor: 'bg-warning/10' };
  }
  if (config.playoff.includes(position)) {
    return { zone: 'playoff', label: 'Playoff Zone', color: 'text-success', bgColor: 'bg-success/10' };
  }
  if (config.playIn?.includes(position)) {
    return { zone: 'playIn', label: 'Play-In', color: 'text-info', bgColor: 'bg-info/10' };
  }
  if (config.relegation?.includes(position)) {
    return { zone: 'relegation', label: 'Relegation', color: 'text-danger', bgColor: 'bg-danger/10' };
  }
  return { zone: 'midTable', label: 'Mid-Table', color: 'text-text-secondary', bgColor: 'bg-bg-tertiary' };
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function LeagueContextCard({ result }: LeagueContextCardProps) {
  const { matchInfo, momentumAndForm } = result;
  const { homeStats, awayStats } = momentumAndForm;

  // Extract standings positions from stats
  // Note: This uses the standingPosition we already fetch from API-Sports
  const homePosition = (homeStats as any)?.standingPosition || (homeStats as any)?.position;
  const awayPosition = (awayStats as any)?.standingPosition || (awayStats as any)?.position;

  const zoneConfig = getZoneConfig(matchInfo.sport);
  const homeZone = getPositionZone(homePosition, zoneConfig);
  const awayZone = getPositionZone(awayPosition, zoneConfig);

  // Calculate position difference
  const positionGap = homePosition && awayPosition ? Math.abs(homePosition - awayPosition) : null;

  // Determine if this is a "big match" based on positions
  const isBigMatch = homePosition && awayPosition && 
    (homePosition <= 4 || awayPosition <= 4) && 
    positionGap !== null && positionGap <= 5;

  // Check if both have data
  const hasData = homePosition || awayPosition;

  if (!hasData) {
    return null; // Don't render if no standings data
  }

  return (
    <div className="bg-bg-card rounded-2xl border border-divider shadow-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-info to-primary rounded-lg flex items-center justify-center">
          <span className="text-sm">🏆</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">League Standings</h3>
          <p className="text-[10px] text-text-muted">{matchInfo.leagueName}</p>
        </div>
        {isBigMatch && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase">
            ⚡ Top 4 Clash
          </span>
        )}
      </div>

      {/* Standings Comparison */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Home Team */}
        <div className={`rounded-xl p-3 sm:p-4 ${homeZone.bgColor} border border-divider/50`}>
          <p className="text-[10px] text-text-muted mb-1 truncate">{matchInfo.homeTeam}</p>
          
          {homePosition ? (
            <>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl sm:text-3xl font-black text-text-primary">
                  {getOrdinalSuffix(homePosition)}
                </span>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${homeZone.bgColor} ${homeZone.color} text-[10px] font-semibold`}>
                {homeZone.zone === 'leader' && '👑'}
                {homeZone.zone === 'playoff' && '✓'}
                {homeZone.zone === 'playIn' && '⚔️'}
                {homeZone.zone === 'relegation' && '⚠️'}
                {homeZone.label}
              </div>
            </>
          ) : (
            <div className="text-text-muted text-sm">No data</div>
          )}
        </div>

        {/* Away Team */}
        <div className={`rounded-xl p-3 sm:p-4 ${awayZone.bgColor} border border-divider/50`}>
          <p className="text-[10px] text-text-muted mb-1 truncate">{matchInfo.awayTeam}</p>
          
          {awayPosition ? (
            <>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl sm:text-3xl font-black text-text-primary">
                  {getOrdinalSuffix(awayPosition)}
                </span>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${awayZone.bgColor} ${awayZone.color} text-[10px] font-semibold`}>
                {awayZone.zone === 'leader' && '👑'}
                {awayZone.zone === 'playoff' && '✓'}
                {awayZone.zone === 'playIn' && '⚔️'}
                {awayZone.zone === 'relegation' && '⚠️'}
                {awayZone.label}
              </div>
            </>
          ) : (
            <div className="text-text-muted text-sm">No data</div>
          )}
        </div>
      </div>

      {/* Position Gap Context */}
      {positionGap !== null && (
        <div className="mt-3 pt-3 border-t border-divider">
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-text-muted">Position Gap</span>
            <span className={`font-semibold ${positionGap <= 2 ? 'text-warning' : positionGap <= 5 ? 'text-accent' : 'text-text-secondary'}`}>
              {positionGap === 0 ? 'Same position' : `${positionGap} place${positionGap > 1 ? 's' : ''} apart`}
            </span>
          </div>
          {positionGap <= 3 && homePosition && awayPosition && (
            <p className="text-[10px] text-text-muted mt-1">
              {homePosition < awayPosition 
                ? `${matchInfo.homeTeam} is higher in the table`
                : homePosition > awayPosition
                  ? `${matchInfo.awayTeam} is higher in the table`
                  : 'Teams are level in the standings'
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
}
