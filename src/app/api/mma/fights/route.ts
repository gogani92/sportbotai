/**
 * API Route: /api/mma/fights
 * 
 * Fetches UFC/MMA fight data from API-Sports.
 * Returns real confirmed fights with fighter photos.
 */

import { NextResponse } from 'next/server';

const API_KEY = process.env.API_FOOTBALL_KEY || '';
const MMA_API_URL = 'https://v1.mma.api-sports.io';

interface MMAFighter {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

interface MMAFight {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  slug: string;
  is_main: boolean;
  category: string;
  status: {
    long: string;
    short: string;
  };
  fighters: {
    first: MMAFighter;
    second: MMAFighter;
  };
}

interface NormalizedMMAFight {
  id: string;
  eventName: string;
  date: string;
  category: string;
  isMainCard: boolean;
  status: string;
  fighter1: {
    id: string;
    name: string;
    photo: string;
    isWinner: boolean;
  };
  fighter2: {
    id: string;
    name: string;
    photo: string;
    isWinner: boolean;
  };
}

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API_FOOTBALL_KEY not configured' },
        { status: 500 }
      );
    }

    // Get fights for current and next year to cover upcoming events
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    // Fetch both years in parallel
    const [currentYearResponse, nextYearResponse] = await Promise.all([
      fetch(`${MMA_API_URL}/fights?season=${currentYear}`, {
        headers: { 'x-apisports-key': API_KEY },
        next: { revalidate: 300 },
      }),
      fetch(`${MMA_API_URL}/fights?season=${nextYear}`, {
        headers: { 'x-apisports-key': API_KEY },
        next: { revalidate: 300 },
      }),
    ]);

    if (!currentYearResponse.ok && !nextYearResponse.ok) {
      return NextResponse.json(
        { error: `API error: ${currentYearResponse.status}` },
        { status: currentYearResponse.status }
      );
    }

    const currentYearData = currentYearResponse.ok ? await currentYearResponse.json() : { response: [] };
    const nextYearData = nextYearResponse.ok ? await nextYearResponse.json() : { response: [] };
    
    // Combine fights from both years
    const allFights: MMAFight[] = [
      ...(currentYearData.response || []),
      ...(nextYearData.response || []),
    ];

    // Filter to upcoming fights only (NS = Not Started)
    // Also filter out TBA placeholder fights
    const filteredFights = allFights.filter(f => {
      // Skip TBA placeholder fights
      if (f.fighters.first.name === 'TBA' || f.fighters.second.name === 'TBA' ||
          f.fighters.first.name === 'Opponent TBA' || f.fighters.second.name === 'Opponent TBA') {
        return false;
      }
      // Only show upcoming fights (NS = Not Started), no past fights
      return f.status.short === 'NS';
    });

    // Sort by: date first (soonest first), then main events prioritized
    filteredFights.sort((a, b) => {
      // First sort by date
      const dateDiff = a.timestamp - b.timestamp;
      if (dateDiff !== 0) return dateDiff;
      // Within same event, main card fights come first
      if (a.is_main && !b.is_main) return -1;
      if (!a.is_main && b.is_main) return 1;
      return 0;
    });

    // Normalize the data
    const normalizedFights: NormalizedMMAFight[] = filteredFights.map(fight => ({
      id: String(fight.id),
      eventName: fight.slug,
      date: fight.date,
      category: fight.category,
      isMainCard: fight.is_main,
      status: fight.status.short,
      fighter1: {
        id: String(fight.fighters.first.id),
        name: fight.fighters.first.name,
        photo: fight.fighters.first.logo,
        isWinner: fight.fighters.first.winner,
      },
      fighter2: {
        id: String(fight.fighters.second.id),
        name: fight.fighters.second.name,
        photo: fight.fighters.second.logo,
        isWinner: fight.fighters.second.winner,
      },
    }));

    // Group by event
    const eventGroups = normalizedFights.reduce((acc, fight) => {
      const eventName = fight.eventName;
      if (!acc[eventName]) {
        acc[eventName] = {
          eventName,
          date: fight.date,
          fights: [],
        };
      }
      acc[eventName].fights.push(fight);
      return acc;
    }, {} as Record<string, { eventName: string; date: string; fights: NormalizedMMAFight[] }>);

    return NextResponse.json({
      success: true,
      events: Object.values(eventGroups),
      fights: normalizedFights,
      total: normalizedFights.length,
    });
  } catch (error) {
    console.error('MMA fights API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MMA fights' },
      { status: 500 }
    );
  }
}
