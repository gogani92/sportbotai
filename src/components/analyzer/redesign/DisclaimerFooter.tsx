/**
 * Disclaimer Footer Component
 * 
 * Responsible gambling notice with clean, non-intrusive design.
 */

'use client';

interface DisclaimerFooterProps {
  responsibleGamblingNote?: string;
}

export default function DisclaimerFooter({ responsibleGamblingNote }: DisclaimerFooterProps) {
  return (
    <div className="mt-8 pt-6 border-t border-white/[0.04]">
      {/* Responsible Gambling */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm">⚠️</span>
        </div>
        <div>
          <p className="text-xs font-medium text-amber-400/80 mb-1">Responsible Gambling</p>
          <p className="text-xs text-white/50 leading-relaxed">
            {responsibleGamblingNote || 'This analysis is for informational purposes only. Gambling involves risk and should be done responsibly. Never bet more than you can afford to lose. If you feel you may have a gambling problem, seek help.'}
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-white/30">
        <a href="/responsible-gambling" className="hover:text-white/50 transition-colors">
          Responsible Gambling
        </a>
        <span>•</span>
        <a href="/terms" className="hover:text-white/50 transition-colors">
          Terms of Use
        </a>
        <span>•</span>
        <a href="/privacy" className="hover:text-white/50 transition-colors">
          Privacy Policy
        </a>
      </div>

      {/* Age Restriction */}
      <div className="flex items-center justify-center mt-4">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-medium">
          18+ Only
        </span>
      </div>
    </div>
  );
}
