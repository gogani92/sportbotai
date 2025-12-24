import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { title: true, slug: true, featuredImage: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('=== BLOG POST FEATURED IMAGES ===\n');
  
  posts.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Slug: ${p.slug}`);
    console.log(`Image: ${p.featuredImage ? p.featuredImage.substring(0, 150) + '...' : 'NULL'}`);
    
    // Check image type
    if (p.featuredImage) {
      if (p.featuredImage.startsWith('data:')) {
        console.log('  ⚠️ TYPE: Data URL (base64) - WILL NOT WORK ON TWITTER!');
      } else if (p.featuredImage.startsWith('http')) {
        console.log('  ✅ TYPE: HTTP URL');
      } else {
        console.log('  ❓ TYPE: Unknown');
      }
    }
    console.log('');
  });
  
  await prisma.$disconnect();
}

main();
