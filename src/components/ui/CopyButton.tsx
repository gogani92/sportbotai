/**
 * Copy to Clipboard Component
 * 
 * Premium copy-to-clipboard with animated feedback.
 * Shows a smooth checkmark animation and "Copied!" toast.
 */

'use client';

import { useState, useCallback, ReactNode } from 'react';

interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Custom children (replaces default icon) */
  children?: ReactNode;
  /** Additional classes */
  className?: string;
  /** Callback after successful copy */
  onCopy?: () => void;
  /** Success message duration in ms */
  successDuration?: number;
  /** Show inline "Copied!" text instead of just icon change */
  showLabel?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export default function CopyButton({
  text,
  children,
  className = '',
  onCopy,
  successDuration = 2000,
  showLabel = false,
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setIsAnimating(true);
      onCopy?.();

      // Reset after duration
      setTimeout(() => {
        setCopied(false);
      }, successDuration);

      // Animation cleanup
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [text, onCopy, successDuration]);

  return (
    <button
      onClick={handleCopy}
      className={`
        relative inline-flex items-center justify-center gap-1.5
        ${sizeClasses[size]}
        text-gray-400 hover:text-white
        bg-white/5 hover:bg-white/10
        border border-white/10 hover:border-white/20
        rounded-lg
        transition-all duration-200
        active:scale-95
        ${copied ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : ''}
        ${className}
      `}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {children ? (
        children
      ) : (
        <div className="relative">
          {/* Copy icon */}
          <svg
            className={`
              ${iconSizes[size]}
              transition-all duration-300
              ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>

          {/* Checkmark icon */}
          <svg
            className={`
              ${iconSizes[size]}
              absolute inset-0
              text-emerald-400
              transition-all duration-300
              ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
              className={isAnimating ? 'animate-draw-check' : ''}
              style={{
                strokeDasharray: isAnimating ? '24' : 'none',
                strokeDashoffset: isAnimating ? '0' : 'none',
              }}
            />
          </svg>
        </div>
      )}

      {/* Label */}
      {showLabel && (
        <span className={`
          text-xs font-medium
          transition-all duration-200
          ${copied ? 'text-emerald-400' : 'text-gray-400'}
        `}>
          {copied ? 'Copied!' : 'Copy'}
        </span>
      )}

      {/* Ripple effect on copy */}
      {isAnimating && (
        <span 
          className="absolute inset-0 rounded-lg animate-ping-once bg-emerald-400/30"
          style={{ animationDuration: '400ms' }}
        />
      )}
    </button>
  );
}

/**
 * Inline copy wrapper - wraps any content and adds copy functionality
 */
interface CopyWrapperProps {
  text: string;
  children: ReactNode;
  className?: string;
  showToast?: boolean;
}

export function CopyWrapper({
  text,
  children,
  className = '',
  showToast = true,
}: CopyWrapperProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (showToast) {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [text, showToast]);

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={handleCopy}>
      {children}
      
      {/* Copy hint */}
      <div className="
        absolute top-1/2 right-2 -translate-y-1/2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
      ">
        <div className={`
          flex items-center gap-1 px-2 py-1
          bg-gray-900 border border-white/10 rounded
          text-xs text-gray-400
          transition-all duration-200
          ${showCopied ? 'text-emerald-400' : ''}
        `}>
          {showCopied ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Click to copy
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * useCopyToClipboard hook for custom implementations
 */
export function useCopyToClipboard(successDuration: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, [successDuration]);

  return { copied, copy };
}
