import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const isDryRun = !process.argv.includes('--fix');
  
  console.log(isDryRun ? '🔍 DRY RUN - Finding posts to fix...\n' : '🔧 FIXING posts...\n');

  // Get all match previews
  const posts = await prisma.blogPost.findMany({
    where: {
      postType: 'MATCH_PREVIEW',
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      slug: true,
      content: true
    }
  });

  console.log(`Found ${posts.length} match previews to check\n`);

  let fixedCount = 0;

  for (const post of posts) {
    let needsFix = false;
    let fixedContent = post.content;
    
    // Fix 1: Replace gradient background with solid green for end CTA
    if (fixedContent.includes('linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)') && 
        fixedContent.includes('Ready for Deeper Analysis')) {
      needsFix = true;
      // Replace gradient with solid green
      fixedContent = fixedContent.replace(
        /background: linear-gradient\(135deg, #10b981 0%, #0ea5e9 100%\);([^>]*>[\s\S]*?Ready for Deeper Analysis)/g,
        'background: #10b981;$1'
      );
    }

    // Fix 2: Also fix the old dark background ones
    if (fixedContent.includes('background: #1e293b;') && 
        fixedContent.includes('Ready for Deeper Analysis')) {
      needsFix = true;
      fixedContent = fixedContent.replace(
        /<div style="background: #1e293b; border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;">([\s\S]*?Ready for Deeper Analysis)/g,
        '<div style="background: #10b981; border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;">$1'
      );
    }

    if (needsFix) {
      console.log(`❌ Needs fix: ${post.slug}`);
      
      if (!isDryRun) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { content: fixedContent }
        });
        console.log(`   ✅ Fixed!`);
      }
      
      fixedCount++;
    }
  }

  console.log(`\n===============================`);
  console.log(`Posts to fix: ${fixedCount}`);
  
  if (isDryRun && fixedCount > 0) {
    console.log(`\nRun with --fix to apply fixes:`);
    console.log(`npx ts-node scripts/fix-cta-solid-green.ts --fix`);
  }

  await prisma.$disconnect();
}

main();
