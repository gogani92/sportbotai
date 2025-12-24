import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const isDryRun = !process.argv.includes('--fix');
  
  console.log(isDryRun ? '🔍 DRY RUN - Finding posts with wrong CTA styling...\n' : '🔧 FIXING posts with wrong CTA styling...\n');

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
    // Check for wrong end CTA (dark background instead of gradient)
    const wrongPattern = /<div style="background: #1e293b; border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;">\s*<h3[^>]*>Ready for Deeper Analysis\?<\/h3>/;
    
    if (wrongPattern.test(post.content)) {
      console.log(`❌ Wrong CTA style: ${post.slug}`);
      
      if (!isDryRun) {
        // Fix the content
        let fixedContent = post.content;
        
        // Replace wrong end CTA background with correct gradient
        fixedContent = fixedContent.replace(
          /<div style="background: #1e293b; border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;">\s*<h3([^>]*)>Ready for Deeper Analysis\?<\/h3>/g,
          '<div style="background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;"><h3$1>Ready for Deeper Analysis?</h3>'
        );
        
        // Also fix the button if it's white on dark (needs to stay white on gradient)
        // The button is correct (white with green text on gradient), but we need to check
        
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
  console.log(`Posts with wrong CTA: ${fixedCount}`);
  
  if (isDryRun && fixedCount > 0) {
    console.log(`\nRun with --fix to apply fixes:`);
    console.log(`npx ts-node scripts/fix-cta-style.ts --fix`);
  }

  await prisma.$disconnect();
}

main();
