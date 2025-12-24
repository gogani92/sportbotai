import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the specific post
  const post = await prisma.blogPost.findUnique({
    where: { slug: 'kansas-city-chiefs-vs-denver-broncos-prediction-2025' },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      content: true
    }
  });

  // Get an older match preview for comparison
  const olderPost = await prisma.blogPost.findFirst({
    where: {
      postType: 'MATCH_PREVIEW',
      createdAt: { lt: new Date('2025-12-24') } // Before today
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

  console.log('=== SUSPICIOUS POST ===');
  console.log(`Title: ${post?.title}`);
  console.log(`Created: ${post?.createdAt}`);
  console.log(`Content length: ${post?.content?.length} chars`);
  console.log('\nCTA patterns found:');
  
  if (post) {
    // Extract color patterns
    const greenColors = post.content.match(/#10b981|#059669|#34d399|emerald|green/gi) || [];
    const blueColors = post.content.match(/#3b82f6|#2563eb|#60a5fa|blue/gi) || [];
    const gradients = post.content.match(/linear-gradient[^;]+/gi) || [];
    const ctaButtons = post.content.match(/<a[^>]*(?:register|pricing|start|trial)[^>]*>[^<]+<\/a>/gi) || [];
    
    console.log(`  Green colors: ${greenColors.length}`);
    console.log(`  Blue colors: ${blueColors.length}`);
    console.log(`  Gradients: ${gradients.length}`);
    console.log(`  CTA buttons: ${ctaButtons.length}`);
    
    // Show first gradient
    if (gradients[0]) {
      console.log(`  First gradient: ${gradients[0].slice(0, 100)}...`);
    }
  }

  console.log('\n=== OLDER POST (for comparison) ===');
  console.log(`Title: ${olderPost?.title}`);
  console.log(`Created: ${olderPost?.createdAt}`);
  console.log(`Content length: ${olderPost?.content?.length} chars`);
  console.log('\nCTA patterns found:');
  
  if (olderPost) {
    const greenColors = olderPost.content.match(/#10b981|#059669|#34d399|emerald|green/gi) || [];
    const blueColors = olderPost.content.match(/#3b82f6|#2563eb|#60a5fa|blue/gi) || [];
    const gradients = olderPost.content.match(/linear-gradient[^;]+/gi) || [];
    const ctaButtons = olderPost.content.match(/<a[^>]*(?:register|pricing|start|trial)[^>]*>[^<]+<\/a>/gi) || [];
    
    console.log(`  Green colors: ${greenColors.length}`);
    console.log(`  Blue colors: ${blueColors.length}`);
    console.log(`  Gradients: ${gradients.length}`);
    console.log(`  CTA buttons: ${ctaButtons.length}`);
    
    if (gradients[0]) {
      console.log(`  First gradient: ${gradients[0].slice(0, 100)}...`);
    }
  }

  await prisma.$disconnect();
}

main();
