/**
 * Generate match previews for upcoming matches
 * Usage: npx tsx scripts/generate-previews.ts [maxPosts]
 */

// Load env FIRST before any imports
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import modules that use env vars
async function main() {
  const { generatePreviewsForUpcomingMatches } = await import('../src/lib/blog/match-generator');
  
  const limit = parseInt(process.argv[2] || '10', 10);
  const sportKey = process.argv[3] || undefined; // Optional: specific sport
  
  console.log(`🚀 Starting match preview generation (limit: ${limit} posts, sport: ${sportKey || 'all'})...\n`);
  
  // generatePreviewsForUpcomingMatches(sportKey?: string, limit: number = 10)
  const result = await generatePreviewsForUpcomingMatches(sportKey, limit);
  
  console.log('\n📊 Result:');
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
