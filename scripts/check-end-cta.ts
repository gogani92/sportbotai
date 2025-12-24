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

  // Find the Ready for Deeper Analysis box
  const idx = post.content.indexOf('Ready for Deeper Analysis');
  if (idx > -1) {
    // Go back to find the div
    const start = Math.max(0, idx - 300);
    const end = Math.min(post.content.length, idx + 600);
    console.log('=== Context around "Ready for Deeper Analysis" ===\n');
    console.log(post.content.slice(start, end));
  } else {
    console.log('Text not found');
  }

  await prisma.$disconnect();
}

main();
