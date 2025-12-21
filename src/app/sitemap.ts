import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://www.sportbotai.com';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  // Core Product Pages
  { path: '', priority: 1, changeFreq: 'daily' as const },
  { path: '/matches', priority: 0.95, changeFreq: 'hourly' as const },
  { path: '/ai-desk', priority: 0.95, changeFreq: 'hourly' as const },
  
  // Content & Conversion
  { path: '/blog', priority: 0.85, changeFreq: 'daily' as const },
  { path: '/pricing', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/contact', priority: 0.6, changeFreq: 'monthly' as const },
  
  // Legal & Compliance
  { path: '/responsible-gambling', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
  
  // AI/LLM Discovery Files
  { path: '/llms.txt', priority: 0.4, changeFreq: 'monthly' as const },
  { path: '/llms-full.txt', priority: 0.4, changeFreq: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();
  
  // Build static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(page => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // Fetch published blog posts for dynamic sitemap
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { 
        status: 'PUBLISHED',
        publishedAt: { not: null },
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 100, // Limit to latest 100 posts
    });

    blogEntries = blogPosts.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('[Sitemap] Error fetching blog posts:', error);
  }

  // NOTE: Team pages removed from sitemap - they require numeric teamId from API-Football,
  // but sitemap was generating slug-based URLs which cause 500 errors.
  // TODO: Implement proper team slug -> teamId resolution before re-adding to sitemap.
  const teamEntries: MetadataRoute.Sitemap = [];

  return [...staticEntries, ...blogEntries, ...teamEntries];
}
