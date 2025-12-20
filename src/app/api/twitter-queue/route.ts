/**
 * Twitter Queue API for Make.com Integration
 * 
 * GET /api/twitter-queue - Get unpublished agent posts ready for Twitter
 * POST /api/twitter-queue - Mark posts as published
 * 
 * Make.com workflow:
 * 1. HTTP Request GET /api/twitter-queue?limit=5&apiKey=xxx
 * 2. Iterator - Loop through posts
 * 3. Twitter - Post tweet
 * 4. HTTP Request POST /api/twitter-queue with { postId, tweetId }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple API key for Make.com (set in .env.local)
const MAKE_API_KEY = process.env.MAKE_WEBHOOK_SECRET || process.env.MAKE_API_KEY;

/**
 * Verify Make.com API key
 */
function verifyApiKey(request: NextRequest): boolean {
  if (!MAKE_API_KEY) {
    console.warn('[Twitter Queue] No API key configured - allowing all requests');
    return true;
  }
  
  const apiKey = request.headers.get('x-api-key') || 
                 new URL(request.url).searchParams.get('apiKey');
  
  return apiKey === MAKE_API_KEY;
}

/**
 * Format post for Twitter (280 char limit)
 */
function formatForTwitter(post: {
  content: string;
  matchRef: string | null;
  sport: string | null;
  league: string | null;
  confidence: number | null;
}): string {
  let tweet = post.content;
  
  // Strip any markdown
  tweet = tweet
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
    .replace(/(?<!_)_([^_]+)_(?!_)/g, '$1')
    .trim();
  
  // Add hashtags based on sport
  const sportHashtags: Record<string, string> = {
    'soccer': '#Football',
    'basketball': '#NBA',
    'americanfootball': '#NFL',
    'icehockey': '#NHL',
    'mma': '#UFC',
  };
  
  const sport = post.sport?.toLowerCase() || '';
  let hashtag = '#SportBotAI';
  
  for (const [key, tag] of Object.entries(sportHashtags)) {
    if (sport.includes(key)) {
      hashtag = `${tag} ${hashtag}`;
      break;
    }
  }
  
  // Truncate if needed (leave room for hashtags)
  const maxContentLength = 280 - hashtag.length - 2; // 2 for \n\n
  if (tweet.length > maxContentLength) {
    tweet = tweet.substring(0, maxContentLength - 3) + '...';
  }
  
  return `${tweet}\n\n${hashtag}`;
}

/**
 * GET /api/twitter-queue
 * 
 * Returns unpublished agent posts formatted for Twitter
 * 
 * Query params:
 * - limit: Max posts to return (default: 5)
 * - apiKey: Make.com API key
 */
export async function GET(request: NextRequest) {
  // Verify API key
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  
  try {
    // Get unpublished posts
    const posts = await prisma.agentPost.findMany({
      where: {
        postedToX: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    
    // Format for Twitter
    const twitterPosts = posts.map(post => ({
      id: post.id,
      tweet: formatForTwitter(post),
      original: {
        content: post.content,
        matchRef: post.matchRef,
        sport: post.sport,
        league: post.league,
        category: post.category,
        confidence: post.confidence,
        createdAt: post.createdAt.toISOString(),
      },
      meta: {
        charCount: formatForTwitter(post).length,
        hasRealTimeData: post.realTimeData,
        citations: post.citations,
      },
    }));
    
    return NextResponse.json({
      success: true,
      count: twitterPosts.length,
      posts: twitterPosts,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[Twitter Queue] Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Database error', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/twitter-queue
 * 
 * Mark a post as published to Twitter
 * 
 * Body:
 * - postId: ID of the agent post
 * - tweetId: Twitter post ID (optional)
 */
export async function POST(request: NextRequest) {
  // Verify API key
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const { postId, tweetId } = body;
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Missing postId' },
        { status: 400 }
      );
    }
    
    // Mark as posted
    const updated = await prisma.agentPost.update({
      where: { id: postId },
      data: {
        postedToX: true,
        xPostId: tweetId || null,
      },
    });
    
    return NextResponse.json({
      success: true,
      postId: updated.id,
      tweetId: tweetId || null,
      message: 'Post marked as published',
    });
    
  } catch (error) {
    console.error('[Twitter Queue] Error updating post:', error);
    return NextResponse.json(
      { error: 'Update failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/twitter-queue
 * 
 * Reset all posts to unpublished (for testing)
 * Only works if MAKE_API_KEY matches
 */
export async function DELETE(request: NextRequest) {
  // Verify API key
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { searchParams } = new URL(request.url);
  const confirm = searchParams.get('confirm');
  
  if (confirm !== 'yes') {
    return NextResponse.json(
      { error: 'Add ?confirm=yes to reset' },
      { status: 400 }
    );
  }
  
  try {
    const result = await prisma.agentPost.updateMany({
      where: { postedToX: true },
      data: {
        postedToX: false,
        xPostId: null,
      },
    });
    
    return NextResponse.json({
      success: true,
      resetCount: result.count,
      message: 'All posts reset to unpublished',
    });
    
  } catch (error) {
    console.error('[Twitter Queue] Reset error:', error);
    return NextResponse.json(
      { error: 'Reset failed' },
      { status: 500 }
    );
  }
}
