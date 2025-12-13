/**
 * SportBot Agent Posts API
 * 
 * Generates AIXBT-style sports intelligence posts.
 * Safe, observational, analytical content - never betting advice.
 * 
 * POST /api/agent/generate - Generate a new agent post
 * GET /api/agent/feed - Get recent agent posts
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  POST_CATEGORIES, 
  buildAgentPostPrompt, 
  sanitizeAgentPost,
  type PostCategory 
} from '@/lib/config/sportBotAgent';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// TYPES
// ============================================

interface GeneratePostRequest {
  category: PostCategory;
  matchContext: {
    homeTeam: string;
    awayTeam: string;
    league: string;
    sport: string;
    kickoff?: string;
    odds?: {
      home?: number;
      draw?: number;
      away?: number;
    };
  };
  additionalContext?: string;
  trigger?: string;
}

interface AgentPost {
  id: string;
  category: PostCategory;
  categoryName: string;
  categoryIcon: string;
  content: string;
  matchRef: string;
  sport: string;
  league: string;
  timestamp: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

// ============================================
// POST - Generate Agent Post
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePostRequest = await request.json();
    const { category, matchContext, additionalContext, trigger } = body;

    // Validate category
    if (!POST_CATEGORIES[category]) {
      return NextResponse.json(
        { error: 'Invalid category', validCategories: Object.keys(POST_CATEGORIES) },
        { status: 400 }
      );
    }

    // Build context string
    const contextString = `
Match: ${matchContext.homeTeam} vs ${matchContext.awayTeam}
League: ${matchContext.league}
Sport: ${matchContext.sport}
${matchContext.kickoff ? `Kickoff: ${matchContext.kickoff}` : ''}
${matchContext.odds ? `Odds: Home ${matchContext.odds.home} | Draw ${matchContext.odds.draw} | Away ${matchContext.odds.away}` : ''}
${trigger ? `Trigger: ${trigger}` : ''}
    `.trim();

    // Build prompt
    const prompt = buildAgentPostPrompt(category, contextString, additionalContext);

    // Generate post via OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.8, // Slightly creative for personality
    });

    const generatedContent = completion.choices[0]?.message?.content?.trim() || '';

    // Safety check
    const safetyResult = sanitizeAgentPost(generatedContent);
    
    if (!safetyResult.safe) {
      console.warn('Agent post flagged for prohibited terms:', safetyResult.flaggedTerms);
      return NextResponse.json(
        { error: 'Generated content failed safety check', flaggedTerms: safetyResult.flaggedTerms },
        { status: 422 }
      );
    }

    // Build response
    const categoryConfig = POST_CATEGORIES[category];
    const post: AgentPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category,
      categoryName: categoryConfig.name,
      categoryIcon: categoryConfig.icon,
      content: safetyResult.post,
      matchRef: `${matchContext.homeTeam} vs ${matchContext.awayTeam}`,
      sport: matchContext.sport,
      league: matchContext.league,
      timestamp: new Date().toISOString(),
      confidence: determineConfidence(category, additionalContext),
    };

    return NextResponse.json({ success: true, post });

  } catch (error) {
    console.error('Agent post generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate agent post' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get Feed Posts (Mock for now)
// ============================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport');
  const limit = parseInt(searchParams.get('limit') || '10');

  // In production, this would fetch from database
  // For now, return example posts to show the feed
  const examplePosts: AgentPost[] = [
    {
      id: 'post_example_1',
      category: 'MARKET_MOVEMENT',
      categoryName: 'Market Movement',
      categoryIcon: '📊',
      content: 'Sharp movement detected on the early Premier League fixture. Market uncertainty elevated after late team news.',
      matchRef: 'Chelsea vs Everton',
      sport: 'Soccer',
      league: 'Premier League',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      confidence: 'MEDIUM',
    },
    {
      id: 'post_example_2',
      category: 'MOMENTUM_SHIFT',
      categoryName: 'Momentum & Form',
      categoryIcon: '📈',
      content: 'Three consecutive wins have flipped sentiment. The question is whether the underlying metrics support the hype. Spoiler: barely.',
      matchRef: 'Brentford vs Newcastle',
      sport: 'Soccer',
      league: 'Premier League',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      confidence: 'HIGH',
    },
    {
      id: 'post_example_3',
      category: 'MATCH_COMPLEXITY',
      categoryName: 'Match Complexity',
      categoryIcon: '🎯',
      content: 'High-complexity alert. Both sides showing inconsistent form, similar power ratings, and a history of chaotic encounters. Predictability? Not today.',
      matchRef: 'Crystal Palace vs Brighton',
      sport: 'Soccer',
      league: 'Premier League',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      confidence: 'LOW',
    },
    {
      id: 'post_example_4',
      category: 'LINEUP_INTEL',
      categoryName: 'Lineup Intelligence',
      categoryIcon: '📋',
      content: 'Key midfielder confirmed out. Model volatility adjusted upward. Classic mid-week rotation chaos.',
      matchRef: 'Man City vs Man United',
      sport: 'Soccer',
      league: 'Premier League',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      confidence: 'HIGH',
    },
    {
      id: 'post_example_5',
      category: 'AI_INSIGHT',
      categoryName: 'AI Insight',
      categoryIcon: '🧠',
      content: 'Interesting pattern: late-season fixtures in this matchup have historically produced 40% more goals than the league average. Make of that what you will.',
      matchRef: 'Liverpool vs Tottenham',
      sport: 'Soccer',
      league: 'Premier League',
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      confidence: 'MEDIUM',
    },
  ];

  // Filter by sport if provided
  const filteredPosts = sport 
    ? examplePosts.filter(p => p.sport.toLowerCase() === sport.toLowerCase())
    : examplePosts;

  return NextResponse.json({
    success: true,
    posts: filteredPosts.slice(0, limit),
    meta: {
      total: filteredPosts.length,
      limit,
      sport: sport || 'all',
    },
  });
}

// ============================================
// HELPERS
// ============================================

function determineConfidence(category: PostCategory, context?: string): 'LOW' | 'MEDIUM' | 'HIGH' {
  // Higher confidence for certain categories
  const highConfidenceCategories: PostCategory[] = ['LINEUP_INTEL', 'POST_MATCH'];
  const lowConfidenceCategories: PostCategory[] = ['MATCH_COMPLEXITY', 'VOLATILITY_ALERT'];
  
  if (highConfidenceCategories.includes(category)) return 'HIGH';
  if (lowConfidenceCategories.includes(category)) return 'LOW';
  
  // Check context for uncertainty signals
  if (context?.toLowerCase().includes('uncertain') || context?.toLowerCase().includes('volatile')) {
    return 'LOW';
  }
  
  return 'MEDIUM';
}
