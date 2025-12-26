/**
 * Mobile Quick Actions FAB
 * 
 * Floating action button for quick access to key features on mobile.
 * Shows above the bottom navigation.
 */

'use client';

import { usePathname } from 'next/navigation';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function MobileQuickActions() {
  const pathname = usePathname();
  
  // Hide on certain pages where it's not needed
  const hiddenPaths = ['/analyzer', '/ai-desk', '/login', '/register', '/admin'];
  if (hiddenPaths.some(path => pathname.startsWith(path))) {
    return null;
  }

  return (
    <FloatingActionButton
      icon={
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
      label="Quick Actions"
      menuItems={[
        {
          icon: <span className="text-lg">🧠</span>,
          label: 'Ask AI Agent',
          href: '/ai-desk',
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
          label: 'Analyze Match',
          href: '/analyzer',
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          label: 'Browse Matches',
          href: '/matches',
        },
      ]}
      bottomOffset={75}
    />
  );
}
