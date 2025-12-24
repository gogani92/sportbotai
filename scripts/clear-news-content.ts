import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.blogPost.updateMany({
    where: { newsContent: { not: null } },
    data: { newsContent: null, newsTitle: null }
  });
  console.log(`Cleared newsContent from ${result.count} posts`);
  await prisma.$disconnect();
}

main();
