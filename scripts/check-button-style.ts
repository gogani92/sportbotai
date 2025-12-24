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

  // Find Start Free Trial button and its styling
  const buttonMatch = post.content.match(/<a[^>]*>Start Free Trial<\/a>/gi);
  console.log('=== Start Free Trial button(s) ===\n');
  
  if (buttonMatch) {
    buttonMatch.forEach((btn, i) => {
      console.log(`Button ${i + 1}:`);
      console.log(btn);
      console.log('');
    });
  }

  // Check for the correct solid green style
  const hasSolidGreen = post.content.includes('background: #10b981') || 
                         post.content.includes('background:#10b981') ||
                         post.content.includes('background-color: #10b981');
  
  // Check for outline style (wrong)
  const hasOutlineStyle = post.content.includes('border: 2px solid #10b981') &&
                          post.content.includes('background: transparent');

  console.log('=== Style Check ===');
  console.log(`Has solid green background: ${hasSolidGreen}`);
  console.log(`Has outline style (wrong): ${hasOutlineStyle}`);

  // Get the actual button HTML with more context
  const idx = post.content.indexOf('Start Free Trial');
  if (idx > -1) {
    // Go back to find the <a tag
    let start = idx;
    while (start > 0 && post.content.slice(start, start + 2) !== '<a') {
      start--;
    }
    // Find end of </a>
    const end = post.content.indexOf('</a>', idx) + 4;
    
    console.log('\n=== Full button HTML ===');
    console.log(post.content.slice(start, end));
  }

  await prisma.$disconnect();
}

main();
