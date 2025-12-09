import { Metadata } from 'next';
import { META } from '@/lib/seo';

export const metadata: Metadata = {
  title: META.analyzer.title,
  description: META.analyzer.description,
  keywords: META.analyzer.keywords,
  openGraph: {
    title: META.analyzer.title,
    description: META.analyzer.description,
  },
};

export default function AnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
