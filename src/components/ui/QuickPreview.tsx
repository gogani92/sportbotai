/**
 * QuickPreview Component
 * 
 * Long-press quick preview popup for match cards.
 * Shows summary without navigating to full page.
 */

'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLongPress } from '@/hooks/useLongPress';
import { X, ChevronRight, Calendar, Clock, Star } from 'lucide-react';

interface QuickPreviewProps {
  children: ReactNode;
  /** Content to show in preview */
  preview: ReactNode;
  /** Optional title */
  title?: string;
  /** Full page link */
  href?: string;
  /** Callback when viewing full */
  onViewFull?: () => void;
  /** Disable preview */
  disabled?: boolean;
}

export function QuickPreview({
  children,
  preview,
  title,
  href,
  onViewFull,
  disabled = false,
}: QuickPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  
  const { handlers, isPressed } = useLongPress({
    threshold: 400,
    onLongPress: () => {
      if (disabled) return;
      
      // Calculate position
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          x: Math.min(rect.left, window.innerWidth - 320),
          y: Math.min(rect.top + rect.height + 8, window.innerHeight - 300),
        });
      }
      
      setIsOpen(true);
    },
    disabled,
  });

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Close on outside touch
  useEffect(() => {
    if (!isOpen) return;
    
    const handleTouch = () => setIsOpen(false);
    
    // Delay to prevent immediate close
    const timeout = setTimeout(() => {
      window.addEventListener('touchstart', handleTouch);
    }, 100);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        {...handlers}
        className={`cursor-pointer select-none transition-transform ${isPressed ? 'scale-95' : ''}`}
        role="button"
        aria-haspopup="dialog"
      >
        {children}
      </div>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Preview card */}
          <div
            className="absolute w-[300px] max-h-[280px] bg-bg-card border border-accent/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            style={{
              left: position.x,
              top: position.y,
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-divider bg-bg-hover">
              <span className="text-sm font-medium text-text truncate">
                {title || 'Quick Preview'}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-text-muted"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 max-h-[200px] overflow-y-auto">
              {preview}
            </div>
            
            {/* Footer - View full */}
            {(href || onViewFull) && (
              <div className="p-3 border-t border-divider bg-bg-hover">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onViewFull) {
                      onViewFull();
                    } else if (href) {
                      window.location.href = href;
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  View Full Analysis
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/** Quick preview content for matches */
export function MatchPreviewContent({
  homeTeam,
  awayTeam,
  date,
  time,
  competition,
  odds,
}: {
  homeTeam: string;
  awayTeam: string;
  date?: string;
  time?: string;
  competition?: string;
  odds?: { home?: number; draw?: number; away?: number };
}) {
  return (
    <div className="space-y-3">
      {/* Competition */}
      {competition && (
        <div className="text-xs text-text-muted uppercase tracking-wide">
          {competition}
        </div>
      )}
      
      {/* Teams */}
      <div className="space-y-1">
        <div className="text-lg font-semibold text-text">{homeTeam}</div>
        <div className="text-sm text-text-muted">vs</div>
        <div className="text-lg font-semibold text-text">{awayTeam}</div>
      </div>
      
      {/* Date/Time */}
      {(date || time) && (
        <div className="flex items-center gap-4 text-sm text-text-muted">
          {date && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {date}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {time}
            </span>
          )}
        </div>
      )}
      
      {/* Odds */}
      {odds && (
        <div className="grid grid-cols-3 gap-2 pt-2">
          {odds.home && (
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-text-muted mb-1">Home</div>
              <div className="text-sm font-semibold text-accent">{odds.home.toFixed(2)}</div>
            </div>
          )}
          {odds.draw && (
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-text-muted mb-1">Draw</div>
              <div className="text-sm font-semibold text-text">{odds.draw.toFixed(2)}</div>
            </div>
          )}
          {odds.away && (
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-text-muted mb-1">Away</div>
              <div className="text-sm font-semibold text-accent">{odds.away.toFixed(2)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuickPreview;
