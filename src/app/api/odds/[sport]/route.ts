/**
 * API Route: /api/odds/[sport]
 * 
 * Dohvata kvote za specifični sport.
 * NAPOMENA: Ovaj endpoint TROŠI API kvotu (1 kredit po regionu/marketu)!
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOdds, calculateAverageOdds, oddsToImpliedProbability, findBestOdds } from '@/lib/odds-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sport: string }> }
) {
  try {
    const { sport } = await params;
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ODDS_API_KEY is not configured' },
        { status: 500 }
      );
    }

    if (!sport) {
      return NextResponse.json(
        { error: 'Sport key is required' },
        { status: 400 }
      );
    }

    // Parsiranje query parametara
    const { searchParams } = new URL(request.url);
    const regions = searchParams.get('regions')?.split(',') || ['eu'];
    const markets = searchParams.get('markets')?.split(',') || ['h2h'];
    const bookmakers = searchParams.get('bookmakers')?.split(',');

    const { data: events, requestsRemaining, requestsUsed } = await getOdds(
      apiKey,
      sport,
      { regions, markets, bookmakers }
    );

    // Obogati podatke sa prosečnim kvotama i implied probability
    const enrichedEvents = events.map(event => {
      const averageOdds = calculateAverageOdds(event);
      const bestHome = findBestOdds(event, 'home');
      const bestAway = findBestOdds(event, 'away');
      const bestDraw = findBestOdds(event, 'draw');

      return {
        ...event,
        analysis: {
          averageOdds,
          impliedProbability: {
            home: oddsToImpliedProbability(averageOdds.home),
            draw: averageOdds.draw ? oddsToImpliedProbability(averageOdds.draw) : null,
            away: oddsToImpliedProbability(averageOdds.away),
          },
          bestOdds: {
            home: bestHome,
            draw: bestDraw,
            away: bestAway,
          },
        },
      };
    });

    // Sortiraj po vremenu početka
    const sortedEvents = enrichedEvents.sort(
      (a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
    );

    return NextResponse.json({
      events: sortedEvents,
      requestsRemaining,
      requestsUsed,
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
