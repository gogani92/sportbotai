/**
 * Live Scores API - Multi-Sport Support
 * 
 * Fetches live match scores from API-Sports family:
 * - API-Football (Soccer)
 * - API-Basketball (NBA, EuroLeague, etc.)
 * 
 * Supports querying specific matches or all live matches.
 * 
 * Endpoints:
 * - GET /api/live-scores - All live soccer matches
 * - GET /api/live-scores?sport=basketball - All live basketball matches
 * - GET /api/live-scores?sport=nba - All live NBA games
 * - GET /api/live-scores?teams=Knicks,Spurs&sport=nba - Specific NBA game
 * - GET /api/live-scores?teams=Liverpool,Manchester - Specific soccer match
 */

import { NextRequest, NextResponse } from 'next/server';

// API endpoints for different sports
const API_BASES = {
  soccer: 'https://v3.football.api-sports.io',
  basketball: 'https://v1.basketball.api-sports.io',
};

const API_KEY = process.env.API_FOOTBALL_KEY; // Same key works for all API-Sports

// NBA League IDs in Basketball API (includes NBA Cup, In-Season Tournament)
const NBA_LEAGUE_IDS = [12, 404, 422]; // 12=NBA, 404=In-Season Tournament, 422=NBA Cup

// Cache for live scores (short TTL - 30 seconds)
const liveCache = new Map<string, { data: any; timestamp: number }>();
const LIVE_CACHE_TTL = 30 * 1000; // 30 seconds

export type SportType = 'soccer' | 'basketball' | 'nba';

export interface LiveMatch {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: {
    short: string; // 1H, HT, 2H, FT, Q1, Q2, Q3, Q4, etc.
    long: string;  // First Half, Halftime, Quarter 1, etc.
    elapsed: number | null; // Minutes played
  };
  league: string;
  leagueLogo: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  sport: SportType;
  events: Array<{
    time: number;
    type: 'Goal' | 'Card' | 'Subst' | 'Var' | 'Score';
    team: 'home' | 'away';
    player: string;
    detail: string;
  }>;
  venue: string;
  startTime: string;
  // Basketball-specific
  quarter?: number;
  quarterScores?: {
    home: number[];
    away: number[];
  };
}

function getCached<T>(key: string): T | null {
  const cached = liveCache.get(key);
  if (cached && Date.now() - cached.timestamp < LIVE_CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any): void {
  liveCache.set(key, { data, timestamp: Date.now() });
}

// =============================================
// BASKETBALL / NBA LIVE SCORES
// =============================================

/**
 * Fetch all currently live basketball games (or NBA specifically)
 * For NBA, we fetch today's games and filter for live status since live=all doesn't work
 */
async function fetchLiveBasketball(nbaOnly: boolean = false): Promise<LiveMatch[]> {
  const cacheKey = nbaOnly ? 'live-nba' : 'live-basketball';
  const cached = getCached<LiveMatch[]>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    console.error('[Live-Scores] API_FOOTBALL_KEY not configured');
    return [];
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    // Fetch today's games and filter for live ones
    const url = `${API_BASES.basketball}/games?date=${today}`;

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v1.basketball.api-sports.io',
      },
    });

    if (!response.ok) {
      console.error('[Live-Scores] Basketball API error:', response.status);
      return [];
    }

    const data = await response.json();
    let games = data.response || [];
    
    // Filter for live games (Q1, Q2, Q3, Q4, OT, HT, BT)
    const liveStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'HT', 'BT'];
    games = games.filter((g: any) => liveStatuses.includes(g.status.short));
    
    // If NBA only, filter by NBA league IDs
    if (nbaOnly) {
      games = games.filter((g: any) => NBA_LEAGUE_IDS.includes(g.league.id));
    }

    const liveMatches: LiveMatch[] = games.map((game: any) => ({
      fixtureId: game.id,
      homeTeam: game.teams.home.name,
      awayTeam: game.teams.away.name,
      homeScore: game.scores.home.total ?? 0,
      awayScore: game.scores.away.total ?? 0,
      status: {
        short: game.status.short,
        long: game.status.long,
        elapsed: game.status.timer ? parseInt(game.status.timer) : null,
      },
      league: game.league.name,
      leagueLogo: game.league.logo,
      homeTeamLogo: game.teams.home.logo,
      awayTeamLogo: game.teams.away.logo,
      sport: NBA_LEAGUE_IDS.includes(game.league.id) ? 'nba' : 'basketball',
      events: [],
      venue: game.venue || '',
      startTime: game.date,
      quarter: game.status.short === 'Q1' ? 1 
             : game.status.short === 'Q2' ? 2 
             : game.status.short === 'Q3' ? 3 
             : game.status.short === 'Q4' ? 4 
             : game.status.short === 'OT' ? 5 
             : undefined,
      quarterScores: {
        home: [
          game.scores.home.quarter_1 ?? 0,
          game.scores.home.quarter_2 ?? 0,
          game.scores.home.quarter_3 ?? 0,
          game.scores.home.quarter_4 ?? 0,
        ],
        away: [
          game.scores.away.quarter_1 ?? 0,
          game.scores.away.quarter_2 ?? 0,
          game.scores.away.quarter_3 ?? 0,
          game.scores.away.quarter_4 ?? 0,
        ],
      },
    }));

    setCache(cacheKey, liveMatches);
    return liveMatches;
  } catch (error) {
    console.error('[Live-Scores] Basketball fetch error:', error);
    return [];
  }
}

/**
 * Fetch today's NBA games
 */
async function fetchTodaysBasketball(nbaOnly: boolean = false): Promise<LiveMatch[]> {
  const cacheKey = nbaOnly ? 'basketball-today-nba' : 'basketball-today';
  const cached = getCached<LiveMatch[]>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) return [];

  try {
    const today = new Date().toISOString().split('T')[0];
    // Fetch all games for today
    const url = `${API_BASES.basketball}/games?date=${today}`;

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v1.basketball.api-sports.io',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    let games = data.response || [];
    
    // If NBA only, filter by NBA league IDs
    if (nbaOnly) {
      games = games.filter((g: any) => NBA_LEAGUE_IDS.includes(g.league.id));
    }

    const matches: LiveMatch[] = games.map((game: any) => ({
      fixtureId: game.id,
      homeTeam: game.teams.home.name,
      awayTeam: game.teams.away.name,
      homeScore: game.scores.home.total ?? 0,
      awayScore: game.scores.away.total ?? 0,
      status: {
        short: game.status.short,
        long: game.status.long,
        elapsed: game.status.timer ? parseInt(game.status.timer) : null,
      },
      league: game.league.name,
      leagueLogo: game.league.logo,
      homeTeamLogo: game.teams.home.logo,
      awayTeamLogo: game.teams.away.logo,
      sport: NBA_LEAGUE_IDS.includes(game.league.id) ? 'nba' : 'basketball',
      events: [],
      venue: game.venue || '',
      startTime: game.date,
      quarterScores: {
        home: [
          game.scores.home.quarter_1 ?? 0,
          game.scores.home.quarter_2 ?? 0,
          game.scores.home.quarter_3 ?? 0,
          game.scores.home.quarter_4 ?? 0,
        ],
        away: [
          game.scores.away.quarter_1 ?? 0,
          game.scores.away.quarter_2 ?? 0,
          game.scores.away.quarter_3 ?? 0,
          game.scores.away.quarter_4 ?? 0,
        ],
      },
    }));

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error('[Live-Scores] Error fetching today basketball:', error);
    return [];
  }
}

// =============================================
// SOCCER LIVE SCORES
// =============================================

/**
 * Fetch all currently live matches
 */
async function fetchLiveMatches(): Promise<LiveMatch[]> {
  const cacheKey = 'live-all-soccer';
  const cached = getCached<LiveMatch[]>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    console.error('[Live-Scores] API_FOOTBALL_KEY not configured');
    return [];
  }

  try {
    const response = await fetch(`${API_BASES.soccer}/fixtures?live=all`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });

    if (!response.ok) {
      console.error('[Live-Scores] API error:', response.status);
      return [];
    }

    const data = await response.json();
    const fixtures = data.response || [];

    const liveMatches: LiveMatch[] = fixtures.map((fixture: any) => ({
      fixtureId: fixture.fixture.id,
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      homeScore: fixture.goals.home ?? 0,
      awayScore: fixture.goals.away ?? 0,
      status: {
        short: fixture.fixture.status.short,
        long: fixture.fixture.status.long,
        elapsed: fixture.fixture.status.elapsed,
      },
      league: fixture.league.name,
      leagueLogo: fixture.league.logo,
      homeTeamLogo: fixture.teams.home.logo,
      awayTeamLogo: fixture.teams.away.logo,
      sport: 'soccer' as SportType,
      events: (fixture.events || []).slice(-5).map((e: any) => ({
        time: e.time.elapsed,
        type: e.type,
        team: e.team.id === fixture.teams.home.id ? 'home' : 'away',
        player: e.player.name,
        detail: e.detail,
      })),
      venue: fixture.fixture.venue?.name || '',
      startTime: fixture.fixture.date,
    }));

    setCache(cacheKey, liveMatches);
    return liveMatches;
  } catch (error) {
    console.error('[Live-Scores] Fetch error:', error);
    return [];
  }
}

/**
 * Fetch live score for a specific match by team names
 */
async function fetchMatchByTeams(homeTeam: string, awayTeam: string): Promise<LiveMatch | null> {
  const allLive = await fetchLiveMatches();
  
  // Normalize team names for matching
  const normalizeTeam = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const homeNorm = normalizeTeam(homeTeam);
  const awayNorm = normalizeTeam(awayTeam);

  // Find matching fixture
  const match = allLive.find(m => {
    const matchHomeNorm = normalizeTeam(m.homeTeam);
    const matchAwayNorm = normalizeTeam(m.awayTeam);
    
    return (
      (matchHomeNorm.includes(homeNorm) || homeNorm.includes(matchHomeNorm)) &&
      (matchAwayNorm.includes(awayNorm) || awayNorm.includes(matchAwayNorm))
    );
  });

  return match || null;
}

/**
 * Fetch today's fixtures to check if a match is upcoming/live/finished
 */
async function fetchTodaysFixtures(): Promise<LiveMatch[]> {
  const cacheKey = 'fixtures-today-soccer';
  const cached = getCached<LiveMatch[]>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) return [];

  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${API_BASES.soccer}/fixtures?date=${today}`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    const fixtures = data.response || [];

    const matches: LiveMatch[] = fixtures.map((fixture: any) => ({
      fixtureId: fixture.fixture.id,
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      homeScore: fixture.goals.home ?? 0,
      awayScore: fixture.goals.away ?? 0,
      status: {
        short: fixture.fixture.status.short,
        long: fixture.fixture.status.long,
        elapsed: fixture.fixture.status.elapsed,
      },
      league: fixture.league.name,
      leagueLogo: fixture.league.logo,
      homeTeamLogo: fixture.teams.home.logo,
      awayTeamLogo: fixture.teams.away.logo,
      sport: 'soccer' as SportType,
      events: [],
      venue: fixture.fixture.venue?.name || '',
      startTime: fixture.fixture.date,
    }));

    setCache(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error('[Live-Scores] Error fetching today fixtures:', error);
    return [];
  }
}

/**
 * Get match status for specific teams (works for live, upcoming, and finished)
 * Supports both soccer and basketball
 */
async function getMatchStatus(
  homeTeam: string, 
  awayTeam: string,
  sport: SportType = 'soccer'
): Promise<{
  status: 'live' | 'upcoming' | 'finished' | 'not_found';
  match?: LiveMatch;
}> {
  const normalizeTeam = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const homeNorm = normalizeTeam(homeTeam);
  const awayNorm = normalizeTeam(awayTeam);

  const findMatch = (matches: LiveMatch[]) => {
    return matches.find(m => {
      const matchHomeNorm = normalizeTeam(m.homeTeam);
      const matchAwayNorm = normalizeTeam(m.awayTeam);
      return (
        (matchHomeNorm.includes(homeNorm) || homeNorm.includes(matchHomeNorm)) &&
        (matchAwayNorm.includes(awayNorm) || awayNorm.includes(matchAwayNorm))
      );
    });
  };

  // Basketball flow
  if (sport === 'basketball' || sport === 'nba') {
    const nbaOnly = sport === 'nba';
    const liveGames = await fetchLiveBasketball(nbaOnly);
    const liveMatch = findMatch(liveGames);
    
    if (liveMatch) {
      return { status: 'live', match: liveMatch };
    }

    const todaysGames = await fetchTodaysBasketball(nbaOnly);
    const todayMatch = findMatch(todaysGames);

    if (todayMatch) {
      const finishedStatuses = ['FT', 'AOT', 'POST'];
      const liveStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'];
      
      if (finishedStatuses.includes(todayMatch.status.short)) {
        return { status: 'finished', match: todayMatch };
      }
      if (liveStatuses.includes(todayMatch.status.short)) {
        return { status: 'live', match: todayMatch };
      }
      return { status: 'upcoming', match: todayMatch };
    }

    return { status: 'not_found' };
  }

  // Soccer flow (default)
  const liveMatch = await fetchMatchByTeams(homeTeam, awayTeam);
  if (liveMatch) {
    return { status: 'live', match: liveMatch };
  }

  const todaysFixtures = await fetchTodaysFixtures();
  const todayMatch = findMatch(todaysFixtures);

  if (todayMatch) {
    const finishedStatuses = ['FT', 'AET', 'PEN', 'SUSP', 'INT', 'PST', 'CANC', 'ABD', 'AWD', 'WO'];
    const liveStatuses = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'];
    
    if (finishedStatuses.includes(todayMatch.status.short)) {
      return { status: 'finished', match: todayMatch };
    }
    if (liveStatuses.includes(todayMatch.status.short)) {
      return { status: 'live', match: todayMatch };
    }
    return { status: 'upcoming', match: todayMatch };
  }

  return { status: 'not_found' };
}

/**
 * Normalize sport input to SportType
 */
function normalizeSport(input: string | null): SportType {
  if (!input) return 'soccer';
  const s = input.toLowerCase();
  if (s === 'nba' || s === 'basketball_nba') return 'nba';
  if (s.includes('basketball')) return 'basketball';
  return 'soccer';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teams = searchParams.get('teams');
  const homeTeam = searchParams.get('home');
  const awayTeam = searchParams.get('away');
  const fixtureId = searchParams.get('fixtureId');
  const sportParam = searchParams.get('sport');
  const sport = normalizeSport(sportParam);

  try {
    // Specific match by teams (comma-separated or separate params)
    if (teams) {
      const [home, away] = teams.split(',').map(t => t.trim());
      if (home && away) {
        const result = await getMatchStatus(home, away, sport);
        return NextResponse.json(result);
      }
    }

    if (homeTeam && awayTeam) {
      const result = await getMatchStatus(homeTeam, awayTeam, sport);
      return NextResponse.json(result);
    }

    // All live matches for the sport
    let liveMatches: LiveMatch[];
    
    if (sport === 'nba') {
      liveMatches = await fetchLiveBasketball(true);
    } else if (sport === 'basketball') {
      liveMatches = await fetchLiveBasketball(false);
    } else {
      liveMatches = await fetchLiveMatches();
    }
    
    return NextResponse.json({
      count: liveMatches.length,
      matches: liveMatches,
      sport,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Live-Scores] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live scores' },
      { status: 500 }
    );
  }
}
