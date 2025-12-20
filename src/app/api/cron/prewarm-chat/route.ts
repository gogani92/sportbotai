/**
 * Pre-warm Popular Queries Cron Job
 * 
 * Runs every hour to cache responses for trending/popular queries.
 * This improves response time for common questions.
 * 
 * Vercel Cron: Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/prewarm-chat",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cacheSet, CACHE_KEYS, hashChatQuery, getChatTTL } from '@/lib/cache';
import OpenAI from 'openai';
import { getPerplexityClient } from '@/lib/perplexity';
import { buildSystemPrompt, detectChatMode } from '@/lib/sportbot-brain';

// Verify cron secret
const CRON_SECRET = process.env.CRON_SECRET;

// Popular static queries that are always useful to pre-warm
const STATIC_POPULAR_QUERIES = [
  // Football
  'Premier League standings',
  'La Liga top scorers',
  'Champions League fixtures this week',
  'What are the Premier League games this weekend?',
  
  // Basketball
  'NBA standings today',
  'Who is leading the NBA in scoring?',
  'When do the Lakers play next?',
  'NBA games tonight',
  
  // General
  'What matches are on today?',
  'Top football news today',
  'Any big transfer rumors?',
];

// Query categories for TTL
type QueryCategory = 'STANDINGS' | 'FIXTURE' | 'STATS' | 'GENERAL';

function detectQueryCategory(message: string): QueryCategory {
  const msg = message.toLowerCase();
  if (/standings|table|position/i.test(msg)) return 'STANDINGS';
  if (/when|next|fixture|games? (this|today|tonight)/i.test(msg)) return 'FIXTURE';
  if (/top scorer|leading|stats/i.test(msg)) return 'STATS';
  return 'GENERAL';
}

interface CachedChatResponse {
  response: string;
  citations: string[];
  usedRealTimeSearch: boolean;
  brainMode: string;
  cachedAt: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  // Verify authorization - allow Vercel cron OR manual Bearer token
  const authHeader = request.headers.get('authorization');
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const isAuthorized = authHeader === `Bearer ${CRON_SECRET}`;
  
  if (CRON_SECRET && !isVercelCron && !isAuthorized) {
    console.log('[Cron] Unauthorized pre-warm attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[Cron] Starting chat pre-warm...');
  
  try {
    const results = {
      staticQueries: 0,
      trendingQueries: 0,
      errors: 0,
    };

    // Get trending topics from the last 24 hours
    const trendingTopics = await prisma.trendingTopic.findMany({
      where: {
        last24hCount: { gte: 3 }, // At least 3 queries in 24h
      },
      orderBy: { last24hCount: 'desc' },
      take: 10,
    });

    // Combine static queries with trending topics
    const queriesToWarm = [
      ...STATIC_POPULAR_QUERIES,
      ...trendingTopics.map(t => t.topic),
    ].slice(0, 15); // Limit to 15 total

    console.log(`[Cron] Pre-warming ${queriesToWarm.length} queries`);

    // Get perplexity client
    const perplexity = getPerplexityClient();

    for (const query of queriesToWarm) {
      try {
        const queryHash = hashChatQuery(query);
        const cacheKey = CACHE_KEYS.chat(queryHash);
        const queryCategory = detectQueryCategory(query);
        
        // Search with Perplexity for real-time data
        let context = '';
        let citations: string[] = [];
        
        if (perplexity.isConfigured()) {
          const searchResult = await perplexity.search(query, {
            recency: 'day',
            model: 'sonar',
            maxTokens: 800,
          });
          
          if (searchResult.success && searchResult.content) {
            context = searchResult.content;
            citations = searchResult.citations || [];
          }
        }

        // Generate response with OpenAI
        const brainMode = detectChatMode(query);
        const systemPrompt = buildSystemPrompt(brainMode, {
          hasRealTimeData: !!context,
        });

        const userContent = context 
          ? `USER QUESTION: ${query}\n\nREAL-TIME DATA:\n${context}\n\nUse the real-time data to answer. Be sharp and specific.`
          : query;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          max_tokens: 600,
          temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content || '';

        if (response.length > 50) {
          // Cache the response
          const cacheTTL = getChatTTL(queryCategory);
          await cacheSet<CachedChatResponse>(cacheKey, {
            response,
            citations,
            usedRealTimeSearch: !!context,
            brainMode,
            cachedAt: Date.now(),
          }, cacheTTL);

          if (STATIC_POPULAR_QUERIES.includes(query)) {
            results.staticQueries++;
          } else {
            results.trendingQueries++;
          }

          console.log(`[Cron] ✓ Pre-warmed: "${query.slice(0, 40)}..."`);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (err) {
        console.error(`[Cron] ✗ Failed to warm: "${query.slice(0, 40)}..."`, err);
        results.errors++;
      }
    }

    console.log(`[Cron] Pre-warm complete:`, results);

    return NextResponse.json({
      success: true,
      message: 'Chat cache pre-warmed',
      results,
    });

  } catch (error) {
    console.error('[Cron] Pre-warm error:', error);
    return NextResponse.json(
      { error: 'Failed to pre-warm cache', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
