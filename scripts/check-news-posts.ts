import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Posts WITH newsContent
  const withNews = await prisma.blogPost.findMany({
    where: { newsContent: { not: null } },
    select: { slug: true, createdAt: true, title: true },
    orderBy: { createdAt: 'desc' }
  });

  console.log('\n=== Posts WITH newsContent ===');
  if (withNews.length === 0) {
    console.log('None found');
  } else {
    withNews.forEach(p => {
      console.log(`${p.createdAt.toISOString().split('T')[0]} - ${p.slug}`);
    });
  }

  // Most recent posts (to see what's fresh)
  const recent = await prisma.blogPost.findMany({
    where: { 
      category: 'match-preview',
      newsContent: null 
    },
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log('\n=== Most recent match previews WITHOUT newsContent ===');
  recent.forEach(p => {
    console.log(`${p.createdAt.toISOString().split('T')[0]} - ${p.slug}`);
  });

  await prisma.$disconnect();
}

main();
