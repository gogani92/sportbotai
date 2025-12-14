/**
 * Chat Feedback API
 * 
 * Allows users to rate AI responses (thumbs up/down)
 * for continuous improvement of the chat system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashChatQuery } from '@/lib/cache';

interface FeedbackRequest {
  messageId: string;
  query: string;
  response: string;
  rating: number; // 1 = thumbs down, 5 = thumbs up
  feedback?: string;
  sport?: string;
  category?: string;
  brainMode?: string;
  usedRealTimeSearch?: boolean;
  fromCache?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();
    const { 
      messageId, 
      query, 
      response, 
      rating, 
      feedback,
      sport,
      category,
      brainMode,
      usedRealTimeSearch,
      fromCache,
    } = body;

    // Validate required fields
    if (!messageId || !query || !response || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: messageId, query, response, rating' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating !== 1 && rating !== 5) {
      return NextResponse.json(
        { error: 'Rating must be 1 (thumbs down) or 5 (thumbs up)' },
        { status: 400 }
      );
    }

    // Get session (optional - anonymous feedback allowed)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userPlan = session?.user?.plan;

    // Generate query hash for grouping similar queries
    const queryHash = hashChatQuery(query);

    // Save feedback to database
    const savedFeedback = await prisma.chatFeedback.create({
      data: {
        messageId,
        queryHash,
        query: query.slice(0, 2000), // Limit length
        response: response.slice(0, 5000), // Limit length
        rating,
        feedback: feedback?.slice(0, 1000),
        sport,
        category,
        brainMode,
        usedRealTimeSearch: usedRealTimeSearch || false,
        fromCache: fromCache || false,
        userId,
        userPlan: userPlan || null,
      },
    });

    console.log(`[Feedback] Saved: ${rating === 5 ? '👍' : '👎'} for "${query.slice(0, 50)}..."`);

    return NextResponse.json({
      success: true,
      id: savedFeedback.id,
      message: rating === 5 ? 'Thanks for the positive feedback!' : 'Thanks for your feedback, we\'ll improve!',
    });

  } catch (error) {
    console.error('[Feedback] Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

// GET - Admin endpoint to view feedback stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (you might want to add an admin field to User model)
    if (!session?.user?.email?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get feedback stats
    const [totalFeedback, positiveCount, negativeCount, recentFeedback] = await Promise.all([
      prisma.chatFeedback.count(),
      prisma.chatFeedback.count({ where: { rating: 5 } }),
      prisma.chatFeedback.count({ where: { rating: 1 } }),
      prisma.chatFeedback.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          query: true,
          rating: true,
          feedback: true,
          category: true,
          sport: true,
          usedRealTimeSearch: true,
          fromCache: true,
          createdAt: true,
        },
      }),
    ]);

    // Get category breakdown
    const categoryStats = await prisma.chatFeedback.groupBy({
      by: ['category'],
      _count: { id: true },
      _avg: { rating: true },
    });

    return NextResponse.json({
      success: true,
      stats: {
        total: totalFeedback,
        positive: positiveCount,
        negative: negativeCount,
        positiveRate: totalFeedback > 0 ? ((positiveCount / totalFeedback) * 100).toFixed(1) : 0,
      },
      categoryStats,
      recentFeedback,
    });

  } catch (error) {
    console.error('[Feedback] Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback stats' },
      { status: 500 }
    );
  }
}
