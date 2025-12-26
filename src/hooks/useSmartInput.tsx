/**
 * useSmartInput Hook
 * 
 * Handles mobile keyboard interactions:
 * - Auto-scrolls input into view when focused
 * - Handles virtual keyboard appearance
 * - Provides blur on submit/escape
 * - Prevents zoom on iOS
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSmartInputOptions {
  /** Scroll offset from top when focusing */
  scrollOffset?: number;
  /** Auto-submit on enter */
  submitOnEnter?: boolean;
  /** Blur on submit */
  blurOnSubmit?: boolean;
  /** Submit callback */
  onSubmit?: (value: string) => void;
  /** Delay before scrolling (ms) */
  scrollDelay?: number;
}

export function useSmartInput({
  scrollOffset = 100,
  submitOnEnter = true,
  blurOnSubmit = true,
  onSubmit,
  scrollDelay = 300,
}: UseSmartInputOptions = {}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboard, setHasKeyboard] = useState(false);

  // Detect virtual keyboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const detectKeyboard = () => {
      // iOS/Android heuristic: viewport height shrinks when keyboard opens
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const keyboardOpen = visualViewport.height < window.innerHeight * 0.75;
        setHasKeyboard(keyboardOpen);
      }
    };

    // Use visualViewport API if available
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', detectKeyboard);
      return () => window.visualViewport?.removeEventListener('resize', detectKeyboard);
    }
  }, []);

  // Scroll input into view on focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    
    // Delay to wait for keyboard animation
    setTimeout(() => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - scrollOffset;
        
        window.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth',
        });
      }
    }, scrollDelay);
  }, [scrollOffset, scrollDelay]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && submitOnEnter) {
      e.preventDefault();
      
      const value = inputRef.current?.value || '';
      onSubmit?.(value);
      
      if (blurOnSubmit) {
        inputRef.current?.blur();
      }
    }
    
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  }, [submitOnEnter, blurOnSubmit, onSubmit]);

  // Input props to spread
  const inputProps = {
    ref: inputRef,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    // Prevent iOS zoom on small fonts
    style: { fontSize: '16px' } as React.CSSProperties,
    // Improve mobile experience
    autoComplete: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    // Touch-friendly
    className: 'touch-manipulation',
  };

  // Helper to focus input
  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Helper to blur input
  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  // Helper to clear input
  const clear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return {
    inputRef,
    inputProps,
    isFocused,
    hasKeyboard,
    focus,
    blur,
    clear,
  };
}

/**
 * SmartInput Component
 * 
 * Pre-configured input with all mobile optimizations.
 */
export function SmartInput({
  placeholder = '',
  value,
  onChange,
  onSubmit,
  className = '',
  type = 'text',
  disabled = false,
  autoFocus = false,
  ...props
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  type?: 'text' | 'email' | 'search' | 'tel' | 'url';
  disabled?: boolean;
  autoFocus?: boolean;
  [key: string]: unknown;
}) {
  const { inputProps, inputRef } = useSmartInput({
    onSubmit,
    submitOnEnter: true,
    blurOnSubmit: true,
  });

  return (
    <input
      {...inputProps}
      {...props}
      ref={inputRef as React.Ref<HTMLInputElement>}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`
        w-full px-4 py-3 min-h-[48px]
        bg-bg-card border border-divider rounded-xl
        text-text placeholder:text-text-muted
        focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
        ${className}
      `}
      style={{ fontSize: '16px' }} // Prevent iOS zoom
    />
  );
}

export default useSmartInput;
