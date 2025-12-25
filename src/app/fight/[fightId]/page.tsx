/**
 * MMA Fight Analysis Page
 * 
 * Dedicated page for UFC/MMA fight analysis.
 * Uses API-Sports MMA data for fighter information.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MMAFightPreviewClient from './MMAFightPreviewClient';

interface PageProps {
  params: Promise<{ fightId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { fightId } = await params;
  
  return {
    title: `UFC Fight Analysis | SportBot AI`,
    description: 'Premium UFC fight intelligence powered by AI. Understand any fight in 60 seconds.',
    openGraph: {
      title: `UFC Fight Analysis | SportBot AI`,
      description: 'Premium UFC fight intelligence powered by AI',
      type: 'article',
    },
  };
}

export default async function MMAFightPage({ params }: PageProps) {
  const { fightId } = await params;
  
  if (!fightId) {
    notFound();
  }

  return <MMAFightPreviewClient fightId={fightId} />;
}
