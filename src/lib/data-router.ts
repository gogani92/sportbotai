/**
 * Data Source Router
 * 
 * Intelligently routes queries to the best data source:
 * - DataLayer: For structured data (stats, rosters, standings, fixtures)
 * - Perplexity: For real-time/news data (injuries, transfers, breaking news)
 * - GPT Only: For opinions, analysis, predictions (no external data needed)
 * 
 * This ensures accurate data by using authoritative APIs when available,
 * falling back to web search only when necessary.
 */

import { DataLayer } from './data-layer';

export type DataSource = 'datalayer' | 'perplexity' | 'gpt_only' | 'hybrid';

export interface RouteResult {
  source: DataSource;
  data?: string;
  error?: string;
  metadata?: {
    playerId?: string;
    teamId?: string;
    sport?: string;
    fromCache?: boolean;
  };
}

export interface RouteOptions {
  sport?: string;
  league?: string;
  season?: string;
}

// Known player name patterns for NBA
const NBA_PLAYER_PATTERNS: Record<string, { variations: string[]; playerId?: string }> = {
  'joel embiid': { variations: ['embiid', 'joel embiid', 'embiid joel'] },
  'lebron james': { variations: ['lebron', 'lebron james', 'james lebron'] },
  'stephen curry': { variations: ['curry', 'steph curry', 'stephen curry'] },
  'kevin durant': { variations: ['durant', 'kd', 'kevin durant'] },
  'giannis antetokounmpo': { variations: ['giannis', 'antetokounmpo', 'greek freak'] },
  'nikola jokic': { variations: ['jokic', 'nikola jokic', 'joker'] },
  'luka doncic': { variations: ['luka', 'doncic', 'luka doncic'] },
  'jayson tatum': { variations: ['tatum', 'jayson tatum'] },
  'anthony davis': { variations: ['ad', 'anthony davis', 'davis'] },
  'damian lillard': { variations: ['dame', 'lillard', 'damian lillard'] },
};

/**
 * Determine the best data source for a query
 */
export function determineDataSource(
  message: string,
  category: string
): DataSource {
  const lower = message.toLowerCase();
  
  // Categories that should use DataLayer (structured API data)
  const dataLayerCategories = ['STATS', 'ROSTER', 'STANDINGS', 'FIXTURE'];
  
  // Categories that should use Perplexity (real-time web search)
  const perplexityCategories = ['INJURY', 'TRANSFER', 'NEWS', 'MANAGER'];
  
  // Categories that don't need external data
  const gptOnlyCategories = ['OPINION', 'PREDICTION', 'COMPARISON'];
  
  // Hybrid: needs both API data and web search
  const hybridCategories = ['MATCH_PREVIEW', 'PLAYER'];
  
  if (dataLayerCategories.includes(category)) {
    // Check if we have API support for this specific query
    const sport = detectSport(message);
    if (sport && ['basketball', 'hockey', 'american_football', 'football'].includes(sport)) {
      return 'datalayer';
    }
    // Fall back to Perplexity for unsupported sports
    return 'perplexity';
  }
  
  if (perplexityCategories.includes(category)) {
    return 'perplexity';
  }
  
  if (gptOnlyCategories.includes(category)) {
    return 'gpt_only';
  }
  
  if (hybridCategories.includes(category)) {
    return 'hybrid';
  }
  
  // Default: use Perplexity for unknown categories
  return 'perplexity';
}

/**
 * Detect sport from message
 */
function detectSport(message: string): string | undefined {
  const lower = message.toLowerCase();
  
  if (/basketball|nba|euroleague|lakers|celtics|warriors|nets|76ers|sixers|bucks|heat|knicks|bulls|suns|mavericks|nuggets|ppg|rebounds|assists|embiid|lebron|curry|giannis|jokic|dončić|doncic|tatum|durant/i.test(lower)) {
    return 'basketball';
  }
  
  if (/\bnfl\b|chiefs|eagles|cowboys|patriots|bills|dolphins|ravens|49ers|bengals|lions|packers|mahomes|allen|burrow|hurts|herbert|touchdown|quarterback/i.test(lower)) {
    return 'american_football';
  }
  
  if (/\bnhl\b|hockey|rangers|bruins|maple leafs|canadiens|oilers|avalanche|lightning|panthers|penguins|capitals|mcdavid|crosby|ovechkin/i.test(lower)) {
    return 'hockey';
  }
  
  if (/premier league|la liga|serie a|bundesliga|champions league|soccer|manchester|liverpool|arsenal|chelsea|barcelona|real madrid|bayern|psg|haaland|mbappe|salah/i.test(lower)) {
    return 'football';
  }
  
  return undefined;
}

/**
 * Extract player name from message
 */
function extractPlayerName(message: string): string | undefined {
  const lower = message.toLowerCase();
  
  // Check known players
  for (const [name, info] of Object.entries(NBA_PLAYER_PATTERNS)) {
    for (const variation of info.variations) {
      if (lower.includes(variation)) {
        return name;
      }
    }
  }
  
  // Try to extract name pattern
  const nameMatch = message.match(/([A-Z][a-zćčšžđ]+(?:\s+[A-Z][a-zćčšžđ]+)+)/);
  if (nameMatch) {
    return nameMatch[1].toLowerCase();
  }
  
  return undefined;
}

/**
 * Route a stats query to the appropriate data source
 */
export async function routeStatsQuery(
  message: string,
  options: RouteOptions = {}
): Promise<RouteResult> {
  const dataLayer = new DataLayer({ enableCaching: true });
  const sport = options.sport || detectSport(message) || 'basketball';
  const playerName = extractPlayerName(message);
  
  if (!playerName) {
    // No player detected, use Perplexity
    return {
      source: 'perplexity',
      error: 'Could not extract player name from query',
    };
  }
  
  console.log(`[Router] Stats query for "${playerName}" in ${sport}`);
  
  // Only basketball is currently supported for player stats
  if (sport !== 'basketball') {
    return {
      source: 'perplexity',
      metadata: { sport },
    };
  }
  
  try {
    // Search for player first
    const searchResult = await dataLayer.searchPlayer('basketball', playerName);
    
    if (!searchResult.success || !searchResult.data || searchResult.data.length === 0) {
      console.log(`[Router] Player "${playerName}" not found in API, falling back to Perplexity`);
      return {
        source: 'perplexity',
        metadata: { sport },
      };
    }
    
    // Get the first matching player
    const player = searchResult.data[0];
    console.log(`[Router] Found player: ${player.name} (ID: ${player.id})`);
    
    // Get player stats
    const statsResult = await dataLayer.getPlayerStats('basketball', player.id, options.season);
    
    if (!statsResult.success || !statsResult.data) {
      console.log(`[Router] Stats not found for ${player.name}, falling back to Perplexity`);
      return {
        source: 'perplexity',
        metadata: { sport, playerId: player.id },
      };
    }
    
    const stats = statsResult.data;
    
    // Format stats for GPT consumption
    const formattedStats = `
=== PLAYER STATS FROM API (AUTHORITATIVE) ===
Player: ${player.name}
Season: ${stats.season}
Games Played: ${stats.games.played}
Minutes Per Game: ${stats.games.minutes || 'N/A'}

SCORING:
- Points Per Game: ${stats.scoring.points}
- Assists Per Game: ${stats.scoring.assists}
- Field Goal %: ${stats.scoring.fieldGoals?.percentage || 'N/A'}%
- 3-Point %: ${stats.scoring.threePointers?.percentage || 'N/A'}%
- Free Throw %: ${stats.scoring.freeThrows?.percentage || 'N/A'}%

DEFENSE:
- Rebounds Per Game: ${stats.defense?.rebounds || 'N/A'}
- Steals Per Game: ${stats.defense?.steals || 'N/A'}
- Blocks Per Game: ${stats.defense?.blocks || 'N/A'}

⚠️ These stats are from the official API. Use ONLY these numbers in your response.
=== END STATS ===
`.trim();
    
    return {
      source: 'datalayer',
      data: formattedStats,
      metadata: {
        playerId: player.id,
        teamId: stats.teamId,
        sport,
      },
    };
  } catch (error) {
    console.error('[Router] Error fetching from DataLayer:', error);
    return {
      source: 'perplexity',
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: { sport },
    };
  }
}

/**
 * Route any query to the appropriate data source
 */
export async function routeQuery(
  message: string,
  category: string,
  options: RouteOptions = {}
): Promise<RouteResult> {
  const source = determineDataSource(message, category);
  
  console.log(`[Router] Query category: ${category}, source: ${source}`);
  
  switch (source) {
    case 'datalayer':
      if (category === 'STATS') {
        return routeStatsQuery(message, options);
      }
      // TODO: Add other DataLayer routes (roster, standings, etc.)
      return { source: 'perplexity' };
      
    case 'perplexity':
      return { source: 'perplexity' };
      
    case 'gpt_only':
      return { source: 'gpt_only' };
      
    case 'hybrid':
      // For hybrid, try DataLayer first, then supplement with Perplexity
      if (category === 'STATS') {
        const result = await routeStatsQuery(message, options);
        if (result.source === 'datalayer' && result.data) {
          return result;
        }
      }
      return { source: 'perplexity' };
      
    default:
      return { source: 'perplexity' };
  }
}

/**
 * Check if a query should use DataLayer for reliable stats
 */
export function shouldUseDataLayer(message: string, category: string): boolean {
  const source = determineDataSource(message, category);
  return source === 'datalayer' || source === 'hybrid';
}
