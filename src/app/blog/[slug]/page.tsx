// Individual blog post page - /blog/[slug]

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface RelatedPost {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  category: string | null;
}

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== 'PUBLISHED') {
    return null;
  }

  // Increment views
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  // Get related posts
  const relatedPosts: RelatedPost[] = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: post.id },
      OR: [
        { category: post.category },
        { tags: { hasSome: post.tags.slice(0, 3) } },
      ],
    },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      category: true,
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  return { post, relatedPosts };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPost(slug);

  if (!data) {
    return {
      title: 'Post Not Found | SportBot AI',
    };
  }

  const { post } = data;

  return {
    title: post.metaTitle || `${post.title} | SportBot AI Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
    take: 100, // Pre-render top 100 posts
  });

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getPost(slug);

  if (!data) {
    notFound();
  }

  const { post, relatedPosts } = data;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'SportBot AI',
      url: 'https://sportbotai.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SportBot AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sportbotai.com/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sportbotai.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <header className="pt-8 pb-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-white">Blog</Link>
                </li>
                <li>/</li>
                <li className="text-slate-300 truncate max-w-[200px]">{post.title}</li>
              </ol>
            </nav>

            <div className="max-w-4xl mx-auto">
              {/* Category */}
              {post.category && (
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className="inline-block text-emerald-400 text-sm font-medium mb-4 hover:text-emerald-300"
                >
                  {post.category}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mb-8">
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Draft'}
                </span>
                <span>•</span>
                <span>{post.views} views</span>
                <span>•</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-700 mb-8">
                  <Image
                    src={post.featuredImage}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Article Content - Enhanced Typography */}
              <div 
                className="
                  prose prose-lg prose-invert prose-emerald max-w-none
                  
                  /* Headings - Better hierarchy and spacing */
                  prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:leading-tight
                  prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-700/50
                  prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-5 prose-h3:text-slate-100
                  prose-h4:text-xl prose-h4:mt-10 prose-h4:mb-4 prose-h4:text-slate-200
                  
                  /* Paragraphs - Better readability */
                  prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-[17px]
                  
                  /* Links */
                  prose-a:text-emerald-400 prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-emerald-400/30 hover:prose-a:border-emerald-400
                  
                  /* Strong/Bold */
                  prose-strong:text-white prose-strong:font-semibold
                  
                  /* Lists - Better spacing */
                  prose-ul:text-slate-300 prose-ul:my-8 prose-ul:space-y-3
                  prose-ol:text-slate-300 prose-ol:my-8 prose-ol:space-y-3
                  prose-li:text-[17px] prose-li:leading-[1.7] prose-li:pl-2
                  prose-li:marker:text-emerald-400 prose-li:marker:font-bold
                  
                  /* Blockquotes - Standout style */
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 
                  prose-blockquote:bg-slate-800/50 prose-blockquote:rounded-r-lg
                  prose-blockquote:text-slate-300 prose-blockquote:italic
                  prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
                  prose-blockquote:not-italic prose-blockquote:text-[17px]
                  
                  /* Code */
                  prose-code:text-emerald-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-slate-800/80 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl prose-pre:my-8
                  
                  /* Tables */
                  prose-table:border-slate-700 prose-table:my-8
                  prose-th:bg-slate-800 prose-th:text-white prose-th:border-slate-700 prose-th:px-4 prose-th:py-3
                  prose-td:border-slate-700 prose-td:px-4 prose-td:py-3
                  
                  /* Images */
                  prose-img:rounded-xl prose-img:my-10 prose-img:shadow-lg
                  
                  /* Horizontal rules */
                  prose-hr:border-slate-700 prose-hr:my-12
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full hover:bg-slate-700"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-slate-300 text-center">
                  Found this helpful? Share it with fellow sports analytics enthusiasts!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-slate-800/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {relatedPosts.map((related: RelatedPost) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all"
                  >
                    <div className="aspect-video relative bg-slate-700">
                      {related.featuredImage ? (
                        <Image
                          src={related.featuredImage}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">📊</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-emerald-400 text-xs font-medium">
                        {related.category}
                      </span>
                      <h3 className="text-white font-semibold mt-1 line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Put This Knowledge to Use
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Use our AI-powered analyzer to apply these concepts to real matches.
            </p>
            <Link
              href="/analyzer"
              className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Analyze a Match
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
