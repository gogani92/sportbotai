/**
 * API Route: /api/sports
 * 
 * Dohvata listu dostupnih sportova iz The Odds API.
 * Ovaj endpoint je BESPLATAN i ne troši API kvotu.
 */

import { NextResponse } from 'next/server';
import { getSports, groupSportsByCategory } from '@/lib/odds-api';

export async function GET() {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ODDS_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { data: sports, requestsRemaining } = await getSports(apiKey);
    
    // Filtriraj samo aktivne sportove i grupiši ih
    const activeSports = sports.filter(s => s.active && !s.has_outrights);
    const grouped = groupSportsByCategory(activeSports);

    return NextResponse.json({
      sports: activeSports,
      grouped,
      requestsRemaining,
    });
  } catch (error) {
    console.error('Error fetching sports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sports' },
      { status: 500 }
    );
  }
}
