/**
 * Share to X (Twitter) Button Component
 * 
 * Simple share link that opens Twitter with pre-filled text.
 * No OAuth needed - users post from their own account.
 */

'use client';

interface ShareToXProps {
  text: string;
  url?: string;
  hashtags?: string[];
  via?: string;
  variant?: 'button' | 'icon' | 'text';
  className?: string;
}

export default function ShareToX({ 
  text, 
  url, 
  hashtags = [], 
  via = 'SportBotAI',
  variant = 'button',
  className = '',
}: ShareToXProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const params = new URLSearchParams();
    params.set('text', text);
    if (url) params.set('url', url);
    if (hashtags.length > 0) params.set('hashtags', hashtags.join(','));
    if (via) params.set('via', via);
    
    const shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
    window.open(shareUrl, '_blank', 'width=550,height=420,noopener,noreferrer');
  };

  // X Logo SVG
  const XLogo = () => (
    <svg 
      viewBox="0 0 24 24" 
      className="w-4 h-4 fill-current"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={`p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all ${className}`}
        title="Share to X"
        aria-label="Share to X"
      >
        <XLogo />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleShare}
        className={`text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1.5 ${className}`}
      >
        <XLogo />
        <span>Share</span>
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-medium rounded-full border border-zinc-700 hover:border-zinc-600 transition-all ${className}`}
    >
      <XLogo />
      <span>Share to X</span>
    </button>
  );
}

/**
 * Helper to generate share text for matches
 */
export function generateMatchShareText(
  homeTeam: string,
  awayTeam: string,
  league: string,
  insight?: string
): string {
  let text = `⚽ ${homeTeam} vs ${awayTeam}\n🏆 ${league}`;
  if (insight) {
    text += `\n\n${insight}`;
  }
  text += '\n\nAnalyzed with @SportBotAI';
  return text;
}

/**
 * Helper to generate share text for AI analysis results
 */
export function generateAnalysisShareText(
  homeTeam: string,
  awayTeam: string,
  homeWinProb: number | null,
  awayWinProb: number | null,
  riskLevel: string
): string {
  let text = `🎯 AI Analysis: ${homeTeam} vs ${awayTeam}\n`;
  if (homeWinProb !== null && awayWinProb !== null) {
    text += `📊 ${homeTeam}: ${homeWinProb}% | ${awayTeam}: ${awayWinProb}%\n`;
  }
  text += `⚠️ Risk: ${riskLevel}\n`;
  text += '\nGet your analysis at @SportBotAI';
  return text;
}

/**
 * Helper to generate share text for AI posts
 */
export function generatePostShareText(
  content: string,
  matchRef: string
): string {
  // Truncate content if too long for Twitter
  const maxLength = 200;
  const truncatedContent = content.length > maxLength 
    ? content.slice(0, maxLength) + '...'
    : content;
  
  return `${truncatedContent}\n\n📍 ${matchRef}\n\nvia @SportBotAI`;
}
