/**
 * Check a blog post by slug
 * Usage: npx tsx scripts/check-post.ts <slug>
 */

import { prisma } from '../src/lib/prisma';

async function main() {
  const slug = process.argv[2];
  
  if (!slug) {
    console.log('Usage: npx tsx scripts/check-post.ts <slug>');
    console.log('Example: npx tsx scripts/check-post.ts arsenal-vs-chelsea-preview-2025');
    process.exit(1);
  }
  
  const post = await prisma.blogPost.findFirst({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      homeTeam: true,
      awayTeam: true,
      league: true,
      sport: true,
      category: true,
      newsTitle: true,
      newsContent: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    }
  });
  
  if (!post) {
    console.log(`❌ Post not found: ${slug}`);
    process.exit(1);
  }
  
  console.log('📝 Post found:\n');
  console.log('Title:', post.title);
  console.log('Slug:', post.slug);
  console.log('Teams:', post.homeTeam, 'vs', post.awayTeam);
  console.log('League:', post.league);
  console.log('Sport:', post.sport);
  console.log('Category:', post.category);
  console.log('Created:', post.createdAt);
  console.log('Updated:', post.updatedAt);
  console.log('Published:', post.publishedAt);
  console.log('---');
  console.log('newsTitle:', post.newsTitle || '(null)');
  console.log('newsContent length:', post.newsContent?.length || 0);
  console.log('content length:', post.content?.length || 0);
  console.log('---');
  
  if (post.newsContent) {
    console.log('\n📰 newsContent preview (first 800 chars):\n');
    console.log(post.newsContent.substring(0, 800));
    console.log('\n...');
  } else {
    console.log('\n⚠️ newsContent is NULL - this post will show empty on /news/');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
