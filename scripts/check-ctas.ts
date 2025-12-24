import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.blogPost.findUnique({
    where: { slug: 'kansas-city-chiefs-vs-denver-broncos-prediction-2025' },
    select: { content: true }
  });

  if (!post) {
    console.log('Post not found');
    return;
  }

  // Find all CTA-like divs
  const ctaDivs = post.content.match(/<div[^>]*(?:gradient|background)[^>]*>[\s\S]*?(?:<\/div>){1,3}/gi) || [];
  
  console.log('=== CTA DIVS FOUND ===\n');
  
  ctaDivs.forEach((div, i) => {
    console.log(`--- CTA ${i + 1} ---`);
    console.log(div.slice(0, 500));
    console.log('\n');
  });

  // Also check for "More Matches" which is from news template
  if (post.content.includes('More Matches to Follow')) {
    console.log('⚠️  FOUND "More Matches to Follow" - this is from NEWS template!');
  }
  
  if (post.content.includes('Browse All Matches')) {
    console.log('⚠️  FOUND "Browse All Matches" - this is from NEWS template!');
  }

  if (post.content.includes('AI-Powered Analysis for Every Match')) {
    console.log('⚠️  FOUND promo text from NEWS template!');
  }

  await prisma.$disconnect();
}

main();
