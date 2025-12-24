import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all match previews from last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const posts = await prisma.blogPost.findMany({
    where: {
      postType: 'MATCH_PREVIEW',
      createdAt: { gte: weekAgo }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      homeTeam: true,
      awayTeam: true,
      matchDate: true,
      createdAt: true,
      content: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  // Group by home+away team to find duplicates
  const matchGroups = new Map<string, typeof posts>();
  
  for (const post of posts) {
    const key = `${post.homeTeam || ''}-${post.awayTeam || ''}`.toLowerCase();
    if (!matchGroups.has(key)) {
      matchGroups.set(key, []);
    }
    matchGroups.get(key)!.push(post);
  }
  
  console.log('Looking for duplicate match previews...\n');
  
  let duplicateCount = 0;
  const toDelete: string[] = [];
  
  matchGroups.forEach((group, key) => {
    if (group.length > 1) {
      duplicateCount++;
      console.log(`⚠️  DUPLICATE: ${key}`);
      
      for (const post of group) {
        const hasFullCTAs = /linear-gradient/i.test(post.content) && /(register|pricing)/i.test(post.content);
        const status = hasFullCTAs ? '✅ FULL CTAs' : '❌ STRIPPED';
        
        console.log(`   ${status} | ${post.createdAt.toISOString().split('T')[0]} | ${post.slug}`);
        console.log(`            ID: ${post.id}`);
        
        // Mark stripped versions for deletion
        if (!hasFullCTAs) {
          toDelete.push(post.id);
        }
      }
      console.log('');
    }
  });
  
  console.log('=====================================');
  console.log(`Total duplicate matches: ${duplicateCount}`);
  console.log(`Posts to delete (stripped): ${toDelete.length}`);
  
  if (toDelete.length > 0) {
    console.log('\nIDs to delete:');
    toDelete.forEach(id => console.log(`  ${id}`));
  }
  
  await prisma.$disconnect();
}

main();
