import { config } from 'dotenv';
config({ path: '.env.local' });

import { prisma } from '../src/lib/prisma';

async function main() {
  // Get recent match preview posts (what shows on /news) - sorted by PUBLISHEDAT like the page
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      postType: { in: ['MATCH_PREVIEW', 'NEWS'] }
    },
    select: { 
      id: true, 
      slug: true, 
      newsContent: true, 
      content: true, 
      createdAt: true,
      publishedAt: true
    },
    orderBy: { publishedAt: 'desc' },
    take: 30
  });

  console.log('Page 1 of /news (sorted by publishedAt desc):\n');
  
  const toDelete: string[] = [];
  
  for (const post of posts) {
    const newsLen = post.newsContent?.length || 0;
    const contentLen = post.content?.length || 0;
    
    // Check if content is minimal (just has "Match Overview" header but no actual analysis)
    const hasRealContent = contentLen > 2000; // Real posts have 10k+ chars
    
    const status = hasRealContent ? '✅' : '❌';
    console.log(`${status} ${post.slug} | news: ${newsLen} | content: ${contentLen}`);
    
    if (!hasRealContent) {
      toDelete.push(post.id);
    }
  }

  console.log(`\n\nFound ${toDelete.length} posts with minimal content to delete.`);
  
  if (toDelete.length > 0 && process.argv.includes('--delete')) {
    console.log('\nDeleting...');
    const result = await prisma.blogPost.deleteMany({
      where: { id: { in: toDelete } }
    });
    console.log(`✅ Deleted ${result.count} posts`);
  } else if (toDelete.length > 0) {
    console.log('\nRun with --delete to actually delete these posts.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect().then(() => process.exit(0)));
