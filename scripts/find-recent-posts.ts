import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find posts created in last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const recentPosts = await prisma.blogPost.findMany({
    where: {
      createdAt: { gte: weekAgo },
      postType: 'MATCH_PREVIEW'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      postType: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('Match previews created in last 7 days:');
  console.log('=======================================\n');
  
  recentPosts.forEach((p, i) => {
    const date = p.createdAt.toISOString().split('T')[0];
    const time = p.createdAt.toISOString().split('T')[1].slice(0, 5);
    console.log(`${i + 1}. [${date} ${time}]`);
    console.log(`   Title: ${p.title}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   ID: ${p.id}`);
    console.log('');
  });
  
  console.log(`Total: ${recentPosts.length} match previews`);
  await prisma.$disconnect();
}

main();
