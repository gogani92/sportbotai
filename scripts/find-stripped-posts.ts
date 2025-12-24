import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get recent match previews
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
      content: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('Checking content for CTA patterns...\n');
  
  // Typical patterns that should be in blog match previews
  const expectedPatterns = [
    { name: 'Gradient background', regex: /linear-gradient/i },
    { name: 'Green CTA button (#10b981)', regex: /#10b981/i },
    { name: 'Register/Pricing link', regex: /\/(register|pricing)/i },
    { name: 'Try SportBot', regex: /try sportbot/i },
    { name: 'Start Free', regex: /start free/i },
    { name: 'Get Started', regex: /get started/i },
  ];
  
  const suspicious: typeof posts = [];
  const normal: typeof posts = [];
  
  for (const post of posts) {
    const matches = expectedPatterns.filter(p => p.regex.test(post.content));
    
    // If post is missing most typical patterns, it might be stripped
    if (matches.length < 2) {
      suspicious.push(post);
      console.log(`⚠️  SUSPICIOUS: ${post.slug}`);
      console.log(`   Created: ${post.createdAt.toISOString().split('T')[0]}`);
      console.log(`   Missing patterns - only found: ${matches.map(m => m.name).join(', ') || 'NONE'}`);
      console.log(`   Content length: ${post.content.length} chars`);
      console.log('');
    } else {
      normal.push(post);
    }
  }
  
  console.log('=====================================');
  console.log(`✅ Normal posts: ${normal.length}`);
  console.log(`⚠️  Suspicious posts: ${suspicious.length}`);
  
  if (suspicious.length > 0) {
    console.log('\nSuspicious post IDs (for deletion):');
    suspicious.forEach(p => console.log(`  ${p.id} - ${p.slug}`));
  }
  
  await prisma.$disconnect();
}

main();
