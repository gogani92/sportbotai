/**
 * useScrollReveal Hook
 * 
 * Reveals elements with smooth animations when they scroll into view.
 * Creates that premium Apple-style cascading reveal effect.
 */

'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseScrollRevealOptions {
  /** Threshold for triggering the reveal (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Only trigger once */
  once?: boolean;
  /** Delay before animation starts (ms) */
  delay?: number;
}

interface UseScrollRevealReturn {
  ref: RefObject<HTMLElement>;
  isVisible: boolean;
  hasRevealed: boolean;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}): UseScrollRevealReturn {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true);
                setHasRevealed(true);
              }, delay);
            } else {
              setIsVisible(true);
              setHasRevealed(true);
            }
            
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay]);

  return { ref: ref as RefObject<HTMLElement>, isVisible, hasRevealed };
}

/**
 * Generate staggered delays for a list of items
 */
export function getStaggerDelay(index: number, baseDelay: number = 50): number {
  return index * baseDelay;
}

export default useScrollReveal;
