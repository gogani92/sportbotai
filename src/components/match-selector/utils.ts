/**
 * Match Selector Utilities
 * 
 * Helper functions for grouping, filtering, and processing match data.
 */

import { MatchData } from '@/types';
import { SportConfig } from '@/lib/config/sportsConfig';

/**
 * Group matches by their league
 */
export interface LeagueGroup {
  leagueKey: string;
  leagueName: string;
  sportKey: string;
  matches: MatchData[];
}

export function groupMatchesByLeague(matches: MatchData[]): LeagueGroup[] {
  const groups = new Map<string, LeagueGroup>();

  for (const match of matches) {
    const key = match.league || match.sportKey || 'unknown';
    
    if (!groups.has(key)) {
      groups.set(key, {
        leagueKey: key,
        leagueName: match.league || 'Unknown League',
        sportKey: match.sportKey,
        matches: [],
      });
    }
    
    groups.get(key)!.matches.push(match);
  }

  // Sort matches within each group by commence time
  const groupValues = Array.from(groups.values());
  for (const group of groupValues) {
    group.matches.sort((a, b) => 
      new Date(a.commenceTime).getTime() - new Date(b.commenceTime).getTime()
    );
  }

  // Return groups sorted by league name
  return groupValues.sort((a, b) => 
    a.leagueName.localeCompare(b.leagueName)
  );
}

/**
 * Filter matches by search query (team name)
 */
export function filterMatchesBySearch(
  matches: MatchData[], 
  query: string
): MatchData[] {
  if (!query.trim()) return matches;
  
  const lowerQuery = query.toLowerCase().trim();
  
  return matches.filter(match => 
    match.homeTeam.toLowerCase().includes(lowerQuery) ||
    match.awayTeam.toLowerCase().includes(lowerQuery) ||
    match.league.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter league groups by search query
 */
export function filterLeagueGroupsBySearch(
  groups: LeagueGroup[],
  query: string
): LeagueGroup[] {
  if (!query.trim()) return groups;
  
  const lowerQuery = query.toLowerCase().trim();
  
  return groups
    .map(group => ({
      ...group,
      matches: group.matches.filter(match =>
        match.homeTeam.toLowerCase().includes(lowerQuery) ||
        match.awayTeam.toLowerCase().includes(lowerQuery)
      ),
    }))
    .filter(group => group.matches.length > 0);
}

/**
 * Format date for display
 */
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  if (isTomorrow) {
    return `Tomorrow ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format short date (for compact display)
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format time only
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get sport icon by category
 */
export function getSportIcon(category: string): string {
  const icons: Record<string, string> = {
    'Soccer': '⚽',
    'Basketball': '🏀',
    'American Football': '🏈',
    'Tennis': '🎾',
    'Ice Hockey': '🏒',
    'Baseball': '⚾',
    'MMA': '🥊',
    'Boxing': '🥊',
    'Cricket': '🏏',
    'Rugby': '🏉',
    'Golf': '⛳',
  };
  return icons[category] || '🏆';
}

/**
 * Get country flag emoji for a league
 * Uses league name patterns to identify country/region
 */
export function getLeagueCountryFlag(leagueName: string): string | null {
  const name = leagueName.toLowerCase();
  
  // Soccer leagues
  if (name.includes('premier league') || name.includes('epl') || name.includes('fa cup') || name.includes('league cup') || name.includes('championship')) return '🇬🇧';
  if (name.includes('la liga') || name.includes('copa del rey') || name.includes('spanish')) return '🇪🇸';
  if (name.includes('bundesliga') || name.includes('dfb')) return '🇩🇪';
  if (name.includes('serie a') || name.includes('coppa italia') || name.includes('italian')) return '🇮🇹';
  if (name.includes('ligue 1') || name.includes('coupe de france') || name.includes('french')) return '🇫🇷';
  if (name.includes('eredivisie') || name.includes('knvb') || name.includes('dutch')) return '🇳🇱';
  if (name.includes('primeira liga') || name.includes('portuguese')) return '🇵🇹';
  if (name.includes('super lig') || name.includes('turkish')) return '🇹🇷';
  if (name.includes('scottish')) return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
  if (name.includes('mls') || name.includes('major league soccer')) return '🇺🇸';
  if (name.includes('liga mx') || name.includes('mexican')) return '🇲🇽';
  if (name.includes('j1 league') || name.includes('j-league') || name.includes('japanese')) return '🇯🇵';
  if (name.includes('a-league') || name.includes('australian')) return '🇦🇺';
  if (name.includes('brasileiro') || name.includes('brazilian')) return '🇧🇷';
  if (name.includes('argentina') || name.includes('superliga')) return '🇦🇷';
  if (name.includes('champions league') || name.includes('europa league') || name.includes('uefa') || name.includes('euro 20')) return '🇪🇺';
  if (name.includes('world cup') || name.includes('fifa') || name.includes('international')) return '🌍';
  
  // Basketball leagues
  if (name.includes('nba') || name.includes('ncaa') || name.includes('wnba')) return '🇺🇸';
  if (name.includes('euroleague') || name.includes('eurocup')) return '🇪🇺';
  if (name.includes('acb') || name.includes('spanish basketball')) return '🇪🇸';
  if (name.includes('bbl') || name.includes('british basketball')) return '🇬🇧';
  
  // American Football
  if (name.includes('nfl') || name.includes('ncaaf') || name.includes('super bowl') || name.includes('college football')) return '🇺🇸';
  if (name.includes('cfl') || name.includes('canadian football')) return '🇨🇦';
  
  // Ice Hockey
  if (name.includes('nhl')) return '🇺🇸';
  if (name.includes('khl')) return '🇷🇺';
  if (name.includes('shl') || name.includes('swedish hockey')) return '🇸🇪';
  if (name.includes('liiga') || name.includes('finnish')) return '🇫🇮';
  
  // Baseball
  if (name.includes('mlb') || name.includes('major league baseball')) return '🇺🇸';
  if (name.includes('npb') || name.includes('japanese baseball')) return '🇯🇵';
  if (name.includes('kbo') || name.includes('korean baseball')) return '🇰🇷';
  
  // Tennis
  if (name.includes('wimbledon')) return '🇬🇧';
  if (name.includes('french open') || name.includes('roland garros')) return '🇫🇷';
  if (name.includes('us open')) return '🇺🇸';
  if (name.includes('australian open')) return '🇦🇺';
  if (name.includes('atp') || name.includes('wta')) return '🌍';
  
  // MMA
  if (name.includes('ufc') || name.includes('bellator') || name.includes('pfl')) return '🇺🇸';
  if (name.includes('one championship') || name.includes('one fc')) return '🌏';
  
  // Rugby
  if (name.includes('six nations')) return '🇪🇺';
  if (name.includes('rugby world cup')) return '🌍';
  if (name.includes('super rugby')) return '🌏';
  if (name.includes('premiership rugby') || name.includes('english rugby')) return '🇬🇧';
  if (name.includes('top 14') || name.includes('french rugby')) return '🇫🇷';
  
  // Cricket
  if (name.includes('ipl')) return '🇮🇳';
  if (name.includes('bbl') || name.includes('big bash')) return '🇦🇺';
  if (name.includes('psl') || name.includes('pakistan super')) return '🇵🇰';
  if (name.includes('county championship') || name.includes('the hundred')) return '🇬🇧';
  if (name.includes('cricket world cup') || name.includes('icc')) return '🌍';
  
  // Golf
  if (name.includes('pga') || name.includes('masters') || name.includes('us pga')) return '🇺🇸';
  if (name.includes('the open') || name.includes('british open')) return '🇬🇧';
  if (name.includes('ryder cup')) return '🌍';
  if (name.includes('lpga')) return '🇺🇸';
  
  return null;
}

/**
 * Get category display info
 */
export interface CategoryDisplay {
  id: string;
  name: string;
  icon: string;
  shortName: string;
}

export function getCategoryDisplayInfo(category: string): CategoryDisplay {
  const info: Record<string, CategoryDisplay> = {
    'Soccer': { id: 'soccer', name: 'Soccer', icon: '⚽', shortName: 'Soccer' },
    'Basketball': { id: 'basketball', name: 'Basketball', icon: '🏀', shortName: 'Basketball' },
    'American Football': { id: 'american-football', name: 'American Football', icon: '🏈', shortName: 'Football' },
    'Tennis': { id: 'tennis', name: 'Tennis', icon: '🎾', shortName: 'Tennis' },
    'Ice Hockey': { id: 'ice-hockey', name: 'Ice Hockey', icon: '🏒', shortName: 'Hockey' },
    'MMA': { id: 'mma', name: 'MMA', icon: '🥊', shortName: 'MMA' },
  };
  
  return info[category] || { 
    id: category.toLowerCase().replace(/\s+/g, '-'), 
    name: category, 
    icon: '🏆',
    shortName: category,
  };
}
