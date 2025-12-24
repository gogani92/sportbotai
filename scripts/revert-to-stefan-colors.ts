/**
 * Revert Blog Colors to Stefan's Original
 * 
 * Updates all existing blog posts to use Stefan's original #10b981
 * instead of #2AF6A0
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function revertColors() {
  console.log('🔄 Reverting to Stefan\'s original colors (#10b981)');
  console.log('='.repeat(50));

  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, content: true },
  });

  console.log(`Found ${posts.length} posts\n`);

  let fixed = 0;
  for (const post of posts) {
    const has2AF6A0 = post.content.match(/#2[Aa][Ff]6[Aa]0/g);
    
    if (has2AF6A0) {
      const count = has2AF6A0.length;
      console.log(`📝 ${post.slug} - ${count} occurrences`);
      
      // Replace #2AF6A0 with #10b981
      let newContent = post.content.replace(/#2[Aa][Ff]6[Aa]0/g, '#10b981');
      // Also fix rgba versions: rgba(42, 246, 160 -> rgba(16, 185, 129
      newContent = newContent.replace(/rgba\s*\(\s*42\s*,\s*246\s*,\s*160/g, 'rgba(16, 185, 129');
      
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { content: newContent },
      });
      
      console.log(`   ✅ Fixed!`);
      fixed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Reverted ${fixed} posts to Stefan's original #10b981`);
  
  await prisma.$disconnect();
}

revertColors().catch(console.error);
