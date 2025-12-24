import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get ALL match previews (not just recent)
  const posts = await prisma.blogPost.findMany({
    where: {
      postType: 'MATCH_PREVIEW'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      content: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log(`Total match previews: ${posts.length}\n`);
  console.log('Looking for posts with STRIPPED content (missing CTAs)...\n');
  
  const stripped: typeof posts = [];
  
  for (const post of posts) {
    // Check for typical CTA patterns that should be in blog posts
    const hasGradient = /linear-gradient/i.test(post.content);
    const hasRegisterLink = /\/register/i.test(post.content);
    const hasPricingLink = /\/pricing/i.test(post.content);
    const hasTrySportBot = /try sportbot/i.test(post.content);
    const hasGetStarted = /get started/i.test(post.content);
    const hasStartFree = /start free/i.test(post.content);
    
    const ctaScore = [hasGradient, hasRegisterLink, hasPricingLink, hasTrySportBot, hasGetStarted, hasStartFree]
      .filter(Boolean).length;
    
    // If no CTAs at all, this might be stripped
    if (ctaScore === 0) {
      stripped.push(post);
      console.log(`❌ NO CTAs: ${post.slug}`);
      console.log(`   Created: ${post.createdAt.toISOString().split('T')[0]}`);
      console.log(`   Content length: ${post.content.length} chars`);
      console.log(`   ID: ${post.id}`);
      console.log('');
    }
  }
  
  console.log('=====================================');
  console.log(`Posts with NO CTAs: ${stripped.length}`);
  console.log(`Posts with CTAs: ${posts.length - stripped.length}`);
  
  if (stripped.length > 0) {
    console.log('\nIDs to delete:');
    stripped.forEach(p => console.log(`  ${p.id}`));
  }
  
  await prisma.$disconnect();
}

main();
