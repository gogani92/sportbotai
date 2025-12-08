/**
 * API Route: /api/events/[sport]
 * 
 * Dohvata listu događaja za specifični sport.
 * Ovaj endpoint je BESPLATAN i ne troši API kvotu.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/odds-api';

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

    const { data: events, requestsRemaining } = await getEvents(apiKey, sport);

    // Sortiraj po vremenu početka
    const sortedEvents = events.sort(
      (a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
    );

    return NextResponse.json({
      events: sortedEvents,
      requestsRemaining,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
