/**
 * AI Sports Desk Page
 * 
 * Main feature: SportBot Chat - Ask anything about sports
 * Secondary: Live Intel Feed (auto-posts for X/Twitter)
 * 
 * Registration required to access features.
 */

import { Metadata } from 'next';
import AIDeskClient from './AIDeskClient';
import { META, SITE_CONFIG, getAIDeskSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: META.aiDesk.title,
  description: META.aiDesk.description,
  keywords: META.aiDesk.keywords,
  openGraph: {
    title: META.aiDesk.title,
    description: META.aiDesk.description,
    url: `${SITE_CONFIG.url}/ai-desk`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.url}/og-ai-desk.png`,
        width: 1200,
        height: 630,
        alt: 'AI Sports Desk - Real-Time Intelligence Feed',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: META.aiDesk.title,
    description: META.aiDesk.description,
    site: SITE_CONFIG.twitter,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/ai-desk`,
  },
};

export default function AIDeskPage() {
  const jsonLd = getAIDeskSchema();
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl flex items-center justify-center border border-white/10">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Sports Desk</h1>
                <p className="text-text-muted text-sm">Your AI-powered sports intelligence hub</p>
              </div>
            </div>
          </div>

          {/* Main Layout: Chat Hero + Feed Sidebar (with auth gate) */}
          <AIDeskClient />

          {/* Mobile: Feature badges (visible on mobile, hidden on desktop) */}
          <div className="flex flex-wrap gap-2 mt-6 lg:hidden">
            <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20 flex items-center gap-1.5">
              <span>⚡</span> Real-Time Data
            </span>
            <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20 flex items-center gap-1.5">
              <span>🤖</span> GPT-4 + Perplexity
            </span>
            <span className="px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20 flex items-center gap-1.5">
              <span>📡</span> Auto Intel Feed
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
