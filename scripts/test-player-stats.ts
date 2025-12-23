/**
 * Test script for player stats via DataLayer
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDataLayer } from '../src/lib/data-layer';

console.log('API Key loaded:', !!process.env.API_FOOTBALL_KEY);

async function testPlayerStats() {
  const dl = getDataLayer({ enableCaching: false, logRequests: true });
  
  console.log('\n=== Testing DataLayer Player Stats ===\n');
  
  // Search for Embiid
  console.log('1. Searching for "embiid"...');
  const search = await dl.searchPlayer('basketball', 'embiid');
  
  if (!search.success || !search.data || search.data.length === 0) {
    console.log('❌ Player search failed:', search.error);
    return;
  }
  
  const player = search.data[0];
  console.log(`✅ Found: ${player.name} (ID: ${player.id}) on ${player.teamName}`);
  
  // Get stats
  console.log('\n2. Getting player stats for 2025-26...');
  const stats = await dl.getPlayerStats('basketball', player.id);
  
  if (!stats.success || !stats.data) {
    console.log('❌ Stats fetch failed:', stats.error);
    return;
  }
  
  const s = stats.data;
  console.log('\n=== EMBIID 2025-26 STATS ===');
  console.log(`Season: ${s.season}`);
  console.log(`Games Played: ${s.games.played}`);
  console.log(`Minutes Per Game: ${s.games.minutes}`);
  console.log(`\nScoring:`);
  console.log(`  PPG: ${s.scoring.points}`);
  console.log(`  APG: ${s.scoring.assists}`);
  console.log(`  FG%: ${s.scoring.fieldGoals?.percentage}%`);
  console.log(`  3P%: ${s.scoring.threePointers?.percentage}%`);
  console.log(`  FT%: ${s.scoring.freeThrows?.percentage}%`);
  console.log(`\nDefense:`);
  console.log(`  RPG: ${s.defense?.rebounds}`);
  console.log(`  SPG: ${s.defense?.steals}`);
  console.log(`  BPG: ${s.defense?.blocks}`);
}

testPlayerStats().catch(console.error);
