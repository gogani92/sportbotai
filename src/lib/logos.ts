/**
 * Team & League Logo Utilities
 * 
 * Provides logo URLs for teams and leagues using multiple sources:
 * 1. ESPN public CDN (most reliable for major leagues)
 * 2. API-Football/API-Sports (if configured)
 * 3. Generated fallback avatars
 * 
 * Usage:
 * - getTeamLogo(teamName, sport, league) -> URL
 * - getLeagueLogo(leagueName, sport) -> URL
 */

// ============================================
// LOGO SOURCES & MAPPINGS
// ============================================

/**
 * ESPN Team ID mappings for major sports
 * ESPN URLs: https://a.espncdn.com/i/teamlogos/{sport}/500/{id}.png
 */
const ESPN_TEAM_IDS: Record<string, Record<string, string>> = {
  // NFL Teams
  nfl: {
    'Arizona Cardinals': 'ari',
    'Atlanta Falcons': 'atl',
    'Baltimore Ravens': 'bal',
    'Buffalo Bills': 'buf',
    'Carolina Panthers': 'car',
    'Chicago Bears': 'chi',
    'Cincinnati Bengals': 'cin',
    'Cleveland Browns': 'cle',
    'Dallas Cowboys': 'dal',
    'Denver Broncos': 'den',
    'Detroit Lions': 'det',
    'Green Bay Packers': 'gb',
    'Houston Texans': 'hou',
    'Indianapolis Colts': 'ind',
    'Jacksonville Jaguars': 'jax',
    'Kansas City Chiefs': 'kc',
    'Las Vegas Raiders': 'lv',
    'Los Angeles Chargers': 'lac',
    'Los Angeles Rams': 'lar',
    'Miami Dolphins': 'mia',
    'Minnesota Vikings': 'min',
    'New England Patriots': 'ne',
    'New Orleans Saints': 'no',
    'New York Giants': 'nyg',
    'New York Jets': 'nyj',
    'Philadelphia Eagles': 'phi',
    'Pittsburgh Steelers': 'pit',
    'San Francisco 49ers': 'sf',
    'Seattle Seahawks': 'sea',
    'Tampa Bay Buccaneers': 'tb',
    'Tennessee Titans': 'ten',
    'Washington Commanders': 'wsh',
  },
  // NBA Teams
  nba: {
    'Atlanta Hawks': 'atl',
    'Boston Celtics': 'bos',
    'Brooklyn Nets': 'bkn',
    'Charlotte Hornets': 'cha',
    'Chicago Bulls': 'chi',
    'Cleveland Cavaliers': 'cle',
    'Dallas Mavericks': 'dal',
    'Denver Nuggets': 'den',
    'Detroit Pistons': 'det',
    'Golden State Warriors': 'gs',
    'Houston Rockets': 'hou',
    'Indiana Pacers': 'ind',
    'LA Clippers': 'lac',
    'Los Angeles Clippers': 'lac',
    'Los Angeles Lakers': 'lal',
    'LA Lakers': 'lal',
    'Memphis Grizzlies': 'mem',
    'Miami Heat': 'mia',
    'Milwaukee Bucks': 'mil',
    'Minnesota Timberwolves': 'min',
    'New Orleans Pelicans': 'no',
    'New York Knicks': 'ny',
    'Oklahoma City Thunder': 'okc',
    'Orlando Magic': 'orl',
    'Philadelphia 76ers': 'phi',
    'Phoenix Suns': 'phx',
    'Portland Trail Blazers': 'por',
    'Sacramento Kings': 'sac',
    'San Antonio Spurs': 'sa',
    'Toronto Raptors': 'tor',
    'Utah Jazz': 'uta',
    'Washington Wizards': 'wsh',
  },
  // NHL Teams
  nhl: {
    'Anaheim Ducks': 'ana',
    'Arizona Coyotes': 'ari',
    'Boston Bruins': 'bos',
    'Buffalo Sabres': 'buf',
    'Calgary Flames': 'cgy',
    'Carolina Hurricanes': 'car',
    'Chicago Blackhawks': 'chi',
    'Colorado Avalanche': 'col',
    'Columbus Blue Jackets': 'cbj',
    'Dallas Stars': 'dal',
    'Detroit Red Wings': 'det',
    'Edmonton Oilers': 'edm',
    'Florida Panthers': 'fla',
    'Los Angeles Kings': 'la',
    'Minnesota Wild': 'min',
    'Montreal Canadiens': 'mtl',
    'Nashville Predators': 'nsh',
    'New Jersey Devils': 'nj',
    'New York Islanders': 'nyi',
    'New York Rangers': 'nyr',
    'Ottawa Senators': 'ott',
    'Philadelphia Flyers': 'phi',
    'Pittsburgh Penguins': 'pit',
    'San Jose Sharks': 'sj',
    'Seattle Kraken': 'sea',
    'St. Louis Blues': 'stl',
    'Tampa Bay Lightning': 'tb',
    'Toronto Maple Leafs': 'tor',
    'Vancouver Canucks': 'van',
    'Vegas Golden Knights': 'vgk',
    'Washington Capitals': 'wsh',
    'Winnipeg Jets': 'wpg',
  },
};

/**
 * Major soccer league team ID mappings (using API-Football IDs)
 * These can be used with: https://media.api-sports.io/football/teams/{id}.png
 */
const SOCCER_TEAM_IDS: Record<string, number> = {
  // Premier League
  'Arsenal': 42,
  'Aston Villa': 66,
  'Bournemouth': 35,
  'Brentford': 55,
  'Brighton': 51,
  'Brighton & Hove Albion': 51,
  'Chelsea': 49,
  'Crystal Palace': 52,
  'Everton': 45,
  'Fulham': 36,
  'Ipswich': 57,
  'Ipswich Town': 57,
  'Leicester': 46,
  'Leicester City': 46,
  'Liverpool': 40,
  'Manchester City': 50,
  'Man City': 50,
  'Manchester United': 33,
  'Man United': 33,
  'Newcastle': 34,
  'Newcastle United': 34,
  'Nottingham Forest': 65,
  "Nott'm Forest": 65,
  'Southampton': 41,
  'Tottenham': 47,
  'Tottenham Hotspur': 47,
  'West Ham': 48,
  'West Ham United': 48,
  'Wolves': 39,
  'Wolverhampton': 39,
  // La Liga
  'Real Madrid': 541,
  'Barcelona': 529,
  'Atletico Madrid': 530,
  'Sevilla': 536,
  'Real Sociedad': 548,
  'Real Betis': 543,
  'Villarreal': 533,
  'Athletic Bilbao': 531,
  'Valencia': 532,
  // Serie A
  'Juventus': 496,
  'Inter': 505,
  'Inter Milan': 505,
  'AC Milan': 489,
  'Milan': 489,
  'Napoli': 492,
  'Roma': 497,
  'AS Roma': 497,
  'Lazio': 487,
  'Atalanta': 499,
  'Fiorentina': 502,
  // Bundesliga
  'Bayern Munich': 157,
  'Bayern': 157,
  'Borussia Dortmund': 165,
  'Dortmund': 165,
  'RB Leipzig': 173,
  'Bayer Leverkusen': 168,
  'Leverkusen': 168,
  'Eintracht Frankfurt': 169,
  'Frankfurt': 169,
  'Wolfsburg': 161,
  // Ligue 1
  'Paris Saint-Germain': 85,
  'PSG': 85,
  'Marseille': 81,
  'Lyon': 80,
  'Monaco': 91,
  'Lille': 79,
};

/**
 * League logo mappings
 */
const LEAGUE_LOGOS: Record<string, string> = {
  // US Sports
  'NFL': 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
  'NBA': 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
  'NHL': 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
  'MLB': 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
  'MLS': 'https://a.espncdn.com/i/teamlogos/leagues/500/mls.png',
  // Soccer
  'Premier League': 'https://media.api-sports.io/football/leagues/39.png',
  'EPL': 'https://media.api-sports.io/football/leagues/39.png',
  'English Premier League': 'https://media.api-sports.io/football/leagues/39.png',
  'La Liga': 'https://media.api-sports.io/football/leagues/140.png',
  'Serie A': 'https://media.api-sports.io/football/leagues/135.png',
  'Bundesliga': 'https://media.api-sports.io/football/leagues/78.png',
  'Ligue 1': 'https://media.api-sports.io/football/leagues/61.png',
  'Champions League': 'https://media.api-sports.io/football/leagues/2.png',
  'UEFA Champions League': 'https://media.api-sports.io/football/leagues/2.png',
  'Europa League': 'https://media.api-sports.io/football/leagues/3.png',
  'UEFA Europa League': 'https://media.api-sports.io/football/leagues/3.png',
  // MMA
  'UFC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UFC_Logo.svg/200px-UFC_Logo.svg.png',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Normalize sport name to lowercase key
 */
function normalizeSport(sport: string): string {
  const sportLower = sport.toLowerCase();
  if (sportLower.includes('football') || sportLower.includes('soccer')) return 'soccer';
  if (sportLower.includes('basketball') || sportLower === 'nba') return 'nba';
  if (sportLower.includes('hockey') || sportLower === 'nhl') return 'nhl';
  if (sportLower.includes('american') || sportLower === 'nfl') return 'nfl';
  if (sportLower.includes('mma') || sportLower.includes('ufc')) return 'mma';
  return sportLower;
}

/**
 * Generate a consistent color from team name
 */
function getTeamColor(teamName: string): string {
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 45%)`;
}

/**
 * Get team initials (up to 3 chars)
 */
function getTeamInitials(teamName: string): string {
  const words = teamName.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }
  return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
}

/**
 * Generate SVG data URL for fallback avatar
 */
function generateFallbackLogo(name: string, type: 'team' | 'league' = 'team'): string {
  const initials = getTeamInitials(name);
  const color = getTeamColor(name);
  const bgColor = type === 'league' ? '#1a1a2e' : color;
  const textColor = type === 'league' ? color : '#ffffff';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="12" fill="${bgColor}"/>
      <text x="50" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="700" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Get team logo URL
 * 
 * @param teamName - Full team name (e.g., "Los Angeles Lakers")
 * @param sport - Sport type (e.g., "nba", "soccer", "nfl")
 * @param league - Optional league name for more specific matching
 * @returns Logo URL (ESPN, API-Sports, or fallback SVG)
 */
export function getTeamLogo(teamName: string, sport: string, league?: string): string {
  const normalizedSport = normalizeSport(sport);
  
  // Try ESPN for US sports
  if (['nba', 'nfl', 'nhl'].includes(normalizedSport)) {
    const espnIds = ESPN_TEAM_IDS[normalizedSport];
    if (espnIds) {
      // Try exact match first
      if (espnIds[teamName]) {
        return `https://a.espncdn.com/i/teamlogos/${normalizedSport}/500/${espnIds[teamName]}.png`;
      }
      // Try partial match
      const teamKey = Object.keys(espnIds).find(key => 
        key.toLowerCase().includes(teamName.toLowerCase()) ||
        teamName.toLowerCase().includes(key.toLowerCase())
      );
      if (teamKey) {
        return `https://a.espncdn.com/i/teamlogos/${normalizedSport}/500/${espnIds[teamKey]}.png`;
      }
    }
  }
  
  // Try API-Sports for soccer
  if (normalizedSport === 'soccer') {
    // Try exact match
    if (SOCCER_TEAM_IDS[teamName]) {
      return `https://media.api-sports.io/football/teams/${SOCCER_TEAM_IDS[teamName]}.png`;
    }
    // Try partial match
    const teamKey = Object.keys(SOCCER_TEAM_IDS).find(key => 
      key.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(key.toLowerCase())
    );
    if (teamKey) {
      return `https://media.api-sports.io/football/teams/${SOCCER_TEAM_IDS[teamKey]}.png`;
    }
  }
  
  // Fallback to generated avatar
  return generateFallbackLogo(teamName, 'team');
}

/**
 * Get league logo URL
 * 
 * @param leagueName - League name (e.g., "Premier League", "NBA")
 * @param sport - Sport type for better matching
 * @returns Logo URL or fallback SVG
 */
export function getLeagueLogo(leagueName: string, sport?: string): string {
  // Try exact match
  if (LEAGUE_LOGOS[leagueName]) {
    return LEAGUE_LOGOS[leagueName];
  }
  
  // Try partial match
  const leagueKey = Object.keys(LEAGUE_LOGOS).find(key => 
    key.toLowerCase().includes(leagueName.toLowerCase()) ||
    leagueName.toLowerCase().includes(key.toLowerCase())
  );
  if (leagueKey) {
    return LEAGUE_LOGOS[leagueKey];
  }
  
  // Check sport for default league logo
  const normalizedSport = sport ? normalizeSport(sport) : '';
  if (normalizedSport === 'nba') return LEAGUE_LOGOS['NBA'];
  if (normalizedSport === 'nfl') return LEAGUE_LOGOS['NFL'];
  if (normalizedSport === 'nhl') return LEAGUE_LOGOS['NHL'];
  
  // Fallback
  return generateFallbackLogo(leagueName, 'league');
}

/**
 * Logo component props helper
 * Returns props object ready for Next.js Image or img tag
 */
export function getLogoProps(
  name: string, 
  type: 'team' | 'league',
  sport: string,
  league?: string
): { src: string; alt: string; fallback: string } {
  const src = type === 'team' 
    ? getTeamLogo(name, sport, league)
    : getLeagueLogo(name, sport);
  
  return {
    src,
    alt: `${name} logo`,
    fallback: generateFallbackLogo(name, type),
  };
}
