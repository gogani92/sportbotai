/**
 * Backfill news content for existing match previews
 * 
 * This script transforms SEO-optimized blog content into Google News-friendly
 * journalistic content by:
 * - Removing CTA boxes and promotional content
 * - Rewriting titles to be more news-like
 * - Making content more factual and less promotional
 * 
 * Run with: npx ts-node scripts/backfill-news-content.ts
 */

import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Transform blog content to news content
async function transformToNewsContent(
  title: string,
  content: string,
  homeTeam: string,
  awayTeam: string,
  league: string,
  matchDate: Date | null
): Promise<{ newsTitle: string; newsContent: string }> {
  const dateStr = matchDate
    ? matchDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'upcoming';

  const prompt = `Transform this sports blog post into a Google News-friendly article.

ORIGINAL TITLE: ${title}
MATCH: ${homeTeam} vs ${awayTeam}
LEAGUE: ${league}
DATE: ${dateStr}

ORIGINAL CONTENT:
${content}

REQUIREMENTS FOR NEWS VERSION:
1. NEW TITLE: Create a news-style headline (50-70 chars)
   - Use present tense verbs: "face", "meet", "clash", "prepare"
   - Lead with the news angle (injuries, form, stakes)
   - Examples: "${homeTeam} Face Injury Crisis Ahead of ${awayTeam} Clash"
   - NO words like "prediction", "preview", "tips", "best bets"

2. NEWS CONTENT: Rewrite as a news article
   - REMOVE all CTA boxes, promotional divs, and "Try SportBot" links
   - REMOVE betting odds and gambling references
   - REMOVE any HTML divs with promotional content
   - Keep useful tables (form, h2h stats) but remove CTAs near them
   - Write in journalistic third-person style
   - Lead with the most newsworthy angle (injury news, manager quotes, rivalry history)
   - Use quotes if available in original (manager statements, etc.)
   - Keep factual analysis: form, head-to-head, key players
   - Add context about what's at stake (league position, knockout stage, etc.)
   - Keep the match info box but remove promotional CTAs
   - Keep prediction percentages but frame as "analysis suggests" not "betting value"
   - End with match details (date, time, venue) not a CTA

3. STRUCTURE:
   - Opening paragraph: News lead (who, what, when, why it matters)
   - Match context: What's at stake for each team
   - Team news: Injuries, suspensions, form
   - Head-to-head: Brief historical context
   - Analysis: Expert view on likely outcome
   - Closing: Match details

Return your response in this exact JSON format:
{
  "newsTitle": "Your news-style headline here",
  "newsContent": "The full transformed HTML content here"
}

IMPORTANT: Return ONLY valid JSON, no markdown code blocks.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      newsTitle: parsed.newsTitle || title,
      newsContent: parsed.newsContent || content,
    };
  } catch (error) {
    console.error('Error transforming content:', error);
    // Fallback: strip CTAs programmatically
    return {
      newsTitle: title.replace(/prediction|preview|tips|odds/gi, 'Analysis'),
      newsContent: stripCTAs(content),
    };
  }
}

// Fallback: programmatically strip CTA content
function stripCTAs(content: string): string {
  // Remove CTA divs
  let cleaned = content
    // Remove promotional divs with "Try SportBot", "Get Started", etc.
    .replace(/<div[^>]*>[\s\S]*?(Try SportBot|Get Started|Start Free|View Plans|See Pro Features|Unlock Advanced)[\s\S]*?<\/div>/gi, '')
    // Remove anchor tags to /register, /pricing
    .replace(/<a[^>]*href="\/(?:register|pricing)"[^>]*>[\s\S]*?<\/a>/gi, '')
    // Remove "Pro tip" boxes
    .replace(/<p[^>]*>[\s\S]*?Pro tip[\s\S]*?<\/p>/gi, '')
    // Remove gradients with CTA patterns
    .replace(/<div[^>]*background:\s*linear-gradient[^>]*>[\s\S]*?(Register|Subscribe|Join|Start)[\s\S]*?<\/div>/gi, '')
    // Remove betting language
    .replace(/best bet|betting value|stake|wager/gi, 'analysis')
    .replace(/gamblers?|bettors?/gi, 'fans');

  return cleaned;
}

async function backfillNewsContent() {
  console.log('🔍 Finding match previews without news content...\n');

  const posts = await prisma.blogPost.findMany({
    where: {
      postType: { in: ['MATCH_PREVIEW', 'NEWS'] },
      status: 'PUBLISHED',
      newsContent: null,
    },
    orderBy: { publishedAt: 'desc' },
    take: 50, // Process in batches
  });

  console.log(`Found ${posts.length} posts to process\n`);

  let processed = 0;
  let errors = 0;

  for (const post of posts) {
    console.log(`[${processed + 1}/${posts.length}] Processing: ${post.title}`);

    try {
      const { newsTitle, newsContent } = await transformToNewsContent(
        post.title,
        post.content,
        post.homeTeam || '',
        post.awayTeam || '',
        post.league || '',
        post.matchDate
      );

      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          newsTitle,
          newsContent,
        },
      });

      console.log(`   ✅ Created news version: "${newsTitle}"`);
      processed++;

      // Rate limiting - avoid API throttling
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ Error: ${error}`);
      errors++;
    }
  }

  console.log(`\n✅ Processed: ${processed}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total: ${posts.length}`);
}

// Quick mode: just strip CTAs without AI rewrite
async function quickStripCTAs() {
  console.log('🔧 Quick mode: Stripping CTAs from existing content...\n');

  const posts = await prisma.blogPost.findMany({
    where: {
      postType: { in: ['MATCH_PREVIEW', 'NEWS'] },
      status: 'PUBLISHED',
      newsContent: null,
    },
  });

  console.log(`Found ${posts.length} posts to process\n`);

  for (const post of posts) {
    const newsTitle = post.title
      .replace(/\s*[|\-–]\s*Prediction.*$/i, '')
      .replace(/\s*[|\-–]\s*Preview.*$/i, '')
      .replace(/\s*[|\-–]\s*Tips.*$/i, '')
      .replace(/\s*[|\-–]\s*Odds.*$/i, '');

    const newsContent = stripCTAs(post.content);

    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        newsTitle,
        newsContent,
      },
    });

    console.log(`✅ ${post.title}`);
  }

  console.log(`\n✅ Done! Processed ${posts.length} posts`);
}

// Main
const mode = process.argv[2];

if (mode === '--quick') {
  quickStripCTAs()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} else {
  backfillNewsContent()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
