/**
 * API Route: /api/suggested-prompts
 * 
 * Returns dynamic suggested prompts for AI Desk:
 * - 1 prompt based on today's actual match
 * - Remaining prompts rotate based on trending topics
 * 
 * Cached for 1 hour to reduce API calls.
 */

import { NextRequest, NextResponse } from 'next/server';
import { theOddsClient } from '@/lib/theOdds';
import { getPerplexityClient } from '@/lib/perplexity';

// ============================================
// CACHE
// ============================================

interface CachedPrompts {
  prompts: string[];
  timestamp: number;
}

let promptsCache: CachedPrompts | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ============================================
// STATIC FALLBACK PROMPTS (rotating pool)
// ============================================

const STATIC_PROMPTS = {
  // General knowledge (always relevant)
  general: [
    "Who is the starting goalkeeper for Real Madrid?",
    "What's the latest injury news for Arsenal?",
    "When do Liverpool play next in the Premier League?",
    "Who's top of the Serie A table?",
    "How many goals has Haaland scored this season?",
    "Compare Messi and Ronaldo's stats this season",
    "What are the odds for the Lakers game tonight?",
  ],
  // Seasonal/timely (December/January)
  seasonal: [
    "Any transfer rumors for the January window?",
    "What's happening in the Boxing Day fixtures?",
    "Who leads the MVP race in the NBA?",
    "Which teams are in the Champions League knockouts?",
    "Who's on a hot streak in the NHL right now?",
    "What's the latest on the NFL playoff picture?",
  ],
  // Breaking news style
  news: [
    "Any major injuries reported today?",
    "What matches are happening this weekend?",
    "Latest manager news in the Premier League",
    "Who scored hat-tricks this week?",
    "Any red cards or controversies recently?",
  ],
};

// ============================================
// HELPERS
// ============================================

/**
 * Get a random match from today's fixtures
 */
async function getTodaysMatchPrompt(): Promise<string | null> {
  try {
    if (!theOddsClient.isConfigured()) {
      console.log('[Suggested Prompts] Odds API not configured');
      return null;
    }

    // Priority sports to check for today's matches
    const prioritySports = [
      'soccer_epl',
      'soccer_spain_la_liga', 
      'soccer_germany_bundesliga',
      'soccer_italy_serie_a',
      'basketball_nba',
      'americanfootball_nfl',
      'icehockey_nhl',
      'soccer_uefa_champs_league',
    ];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check each sport for today's events
    for (const sportKey of prioritySports) {
      try {
        const { data: events } = await theOddsClient.getEvents(sportKey);
        
        // Filter to today's matches only
        const todaysMatches = events.filter(event => {
          const matchDate = new Date(event.commence_time);
          return matchDate >= today && matchDate < tomorrow;
        });

        if (todaysMatches.length > 0) {
          // Pick a random match from today
          const randomMatch = todaysMatches[Math.floor(Math.random() * todaysMatches.length)];
          const prompt = `Analyze ${randomMatch.home_team} vs ${randomMatch.away_team}`;
          console.log(`[Suggested Prompts] Today's match: ${prompt}`);
          return prompt;
        }
      } catch (err) {
        console.error(`[Suggested Prompts] Error fetching ${sportKey}:`, err);
        continue;
      }
    }

    console.log('[Suggested Prompts] No matches found for today');
    return null;
  } catch (error) {
    console.error('[Suggested Prompts] Error getting today\'s match:', error);
    return null;
  }
}

/**
 * Get trending sports topics from Perplexity
 */
async function getTrendingTopics(): Promise<string[]> {
  try {
    const perplexity = getPerplexityClient();
    
    if (!perplexity.isConfigured()) {
      console.log('[Suggested Prompts] Perplexity not configured, using static prompts');
      return [];
    }

    const today = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const result = await perplexity.search(
      `What are the top 5 trending sports stories today ${today}? Focus on: injuries, transfers, big matches, player performances. List just the topics briefly.`,
      { recency: 'day', maxTokens: 500 }
    );

    if (!result.success || !result.content) {
      return [];
    }

    // Parse the response into question prompts
    const topics = result.content
      .split('\n')
      .filter(line => line.trim().length > 10)
      .slice(0, 5)
      .map(topic => {
        // Convert topic to a question
        const cleaned = topic.replace(/^\d+\.\s*/, '').replace(/[-*•]\s*/, '').trim();
        
        // If it mentions a player injury
        if (/injur|out|miss/i.test(cleaned)) {
          const playerMatch = cleaned.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);
          if (playerMatch) {
            return `What's the latest on ${playerMatch[1]}'s injury?`;
          }
        }
        
        // If it mentions a match/game
        if (/vs\.?|versus|against|beat|defeated/i.test(cleaned)) {
          return `Tell me about ${cleaned}`;
        }
        
        // If it mentions a transfer
        if (/transfer|sign|deal|move/i.test(cleaned)) {
          return `Latest news on ${cleaned}`;
        }
        
        // Generic question
        return `What's happening with ${cleaned}?`;
      });

    console.log('[Suggested Prompts] Trending topics:', topics);
    return topics;
  } catch (error) {
    console.error('[Suggested Prompts] Error getting trending topics:', error);
    return [];
  }
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Build the final prompts list
 */
async function buildPrompts(): Promise<string[]> {
  const prompts: string[] = [];

  // 1. Get today's match (will be first prompt)
  const todaysMatch = await getTodaysMatchPrompt();
  if (todaysMatch) {
    prompts.push(todaysMatch);
  }

  // 2. Try to get trending topics
  const trending = await getTrendingTopics();
  
  // 3. Add trending topics (up to 3)
  const usableTrending = trending.slice(0, 3);
  prompts.push(...usableTrending);

  // 4. Fill remaining with rotating static prompts
  const neededCount = 10 - prompts.length;
  
  // Mix from different categories
  const allStatic = [
    ...shuffleArray(STATIC_PROMPTS.general).slice(0, 3),
    ...shuffleArray(STATIC_PROMPTS.seasonal).slice(0, 2),
    ...shuffleArray(STATIC_PROMPTS.news).slice(0, 2),
  ];
  
  const shuffledStatic = shuffleArray(allStatic);
  
  // Add unique static prompts
  for (const prompt of shuffledStatic) {
    if (prompts.length >= 10) break;
    if (!prompts.includes(prompt)) {
      prompts.push(prompt);
    }
  }

  // If still need more, add any remaining general prompts
  if (prompts.length < 10) {
    for (const prompt of STATIC_PROMPTS.general) {
      if (prompts.length >= 10) break;
      if (!prompts.includes(prompt)) {
        prompts.push(prompt);
      }
    }
  }

  return prompts.slice(0, 10);
}

// ============================================
// GET HANDLER
// ============================================

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (promptsCache && (now - promptsCache.timestamp) < CACHE_TTL) {
      console.log('[Suggested Prompts] Returning cached prompts');
      return NextResponse.json({
        prompts: promptsCache.prompts,
        cached: true,
        cacheAge: Math.round((now - promptsCache.timestamp) / 1000),
      });
    }

    // Build fresh prompts
    console.log('[Suggested Prompts] Building fresh prompts...');
    const prompts = await buildPrompts();

    // Update cache
    promptsCache = {
      prompts,
      timestamp: now,
    };

    return NextResponse.json({
      prompts,
      cached: false,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Suggested Prompts] Error:', error);
    
    // Return static fallback on error
    const fallback = shuffleArray([
      "Analyze Real Madrid vs Barcelona",
      ...STATIC_PROMPTS.general.slice(0, 5),
      ...STATIC_PROMPTS.seasonal.slice(0, 4),
    ]).slice(0, 10);

    return NextResponse.json({
      prompts: fallback,
      cached: false,
      fallback: true,
    });
  }
}
