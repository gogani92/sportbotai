import { config } from 'dotenv';
config({ path: '.env.local' });

import { prisma } from '../src/lib/prisma';

async function main() {
  // Query same as news page
  const news = await prisma.blogPost.findMany({
    where: { 
      status: 'PUBLISHED',
      postType: { in: ['MATCH_PREVIEW', 'NEWS'] }
    },
    select: { 
      id: true, 
      slug: true, 
      title: true, 
      newsTitle: true,
      newsContent: true,
      content: true,
      postType: true
    },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  console.log('Recent 30 news/match preview posts (page 1):\n');
  
  const emptyIds: string[] = [];
  
  for (const n of news) {
    // Check if it has real content for display
    const hasNewsContent = n.newsContent && n.newsContent.length > 200;
    const hasContent = n.content && n.content.length > 500;
    const hasTitle = n.newsTitle || n.title;
    
    const isGood = hasNewsContent || hasContent;
    const status = isGood ? '✅' : '❌ EMPTY';
    
    console.log(`${status} | ${n.postType} | ${n.slug}`);
    console.log(`   newsTitle: ${n.newsTitle ? n.newsTitle.substring(0, 50) : 'NULL'}`);
    console.log(`   newsContent: ${n.newsContent?.length || 0} chars, content: ${n.content?.length || 0} chars`);
    
    if (!isGood) {
      emptyIds.push(n.id);
    }
  }

  console.log(`\n\nFound ${emptyIds.length} empty posts to delete.`);
  
  if (emptyIds.length > 0) {
    console.log('\nIDs:', emptyIds.join(', '));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect().then(() => process.exit(0)));
