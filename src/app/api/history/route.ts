/**
 * API Route: /api/history
 * 
 * GET - Retrieve user's analysis history
 * Requires authentication
 * 
 * FREE users: Only see analyses from last 24 hours
 * PRO/PREMIUM users: Full history access
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = token.id as string;
    const userPlan = (token.plan as string) || 'FREE';

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sport = searchParams.get('sport');

    // Build where clause
    const where: any = { userId };
    if (sport) {
      where.sport = sport;
    }

    // FREE users: Only see analyses from last 24 hours
    const isFreeUser = userPlan === 'FREE';
    if (isFreeUser) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      where.createdAt = { gte: twentyFourHoursAgo };
    }

    // Fetch analyses
    const [analyses, total, totalAll] = await Promise.all([
      prisma.analysis.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          sport: true,
          league: true,
          homeTeam: true,
          awayTeam: true,
          matchDate: true,
          homeWinProb: true,
          drawProb: true,
          awayWinProb: true,
          riskLevel: true,
          bestValueSide: true,
          userPick: true,
          userStake: true,
          createdAt: true,
        },
      }),
      prisma.analysis.count({ where }),
      // For free users, also get total count (to show how many are hidden)
      isFreeUser 
        ? prisma.analysis.count({ where: { userId } })
        : Promise.resolve(0),
    ]);

    // Try to fetch prediction outcomes for these analyses to show accuracy
    const analysesWithOutcomes = await Promise.all(
      analyses.map(async (analysis) => {
        // Build matchName pattern to find matching prediction
        const matchRef = `${analysis.homeTeam} vs ${analysis.awayTeam}`;
        
        try {
          const prediction = await prisma.prediction.findFirst({
            where: {
              OR: [
                { matchName: { contains: analysis.homeTeam } },
                { matchName: { contains: analysis.awayTeam } },
              ],
              kickoff: analysis.matchDate ? {
                gte: new Date(new Date(analysis.matchDate).getTime() - 24 * 60 * 60 * 1000),
                lte: new Date(new Date(analysis.matchDate).getTime() + 24 * 60 * 60 * 1000),
              } : undefined,
            },
            select: {
              outcome: true,
              actualResult: true,
              actualScore: true,
              prediction: true,
            },
          });
          
          return {
            ...analysis,
            predictionOutcome: prediction ? {
              wasAccurate: prediction.outcome === 'HIT',
              actualResult: prediction.actualResult,
              actualScore: prediction.actualScore,
              predictedScenario: prediction.prediction,
            } : null,
          };
        } catch {
          return { ...analysis, predictionOutcome: null };
        }
      })
    );

    return NextResponse.json({
      analyses: analysesWithOutcomes,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      // Include info about restricted access for free users
      accessInfo: {
        plan: userPlan,
        restricted: isFreeUser,
        visibleCount: total,
        totalCount: isFreeUser ? totalAll : total,
        hiddenCount: isFreeUser ? totalAll - total : 0,
        message: isFreeUser && totalAll > total 
          ? `Showing analyses from last 24 hours. Upgrade to Pro to see all ${totalAll} analyses.`
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
