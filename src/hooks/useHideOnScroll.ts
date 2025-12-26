/**
 * useHideOnScroll Hook
 * 
 * Hides an element (like header) when scrolling down, shows when scrolling up.
 * Great for maximizing mobile screen real estate.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseHideOnScrollOptions {
  /** Minimum scroll distance before hiding (px) */
  threshold?: number;
  /** Disable on desktop */
  mobileOnly?: boolean;
  /** Initial visibility */
  initiallyVisible?: boolean;
}

interface UseHideOnScrollReturn {
  isVisible: boolean;
  /** Current scroll direction */
  scrollDirection: 'up' | 'down' | null;
  /** Current scroll position */
  scrollY: number;
}

export function useHideOnScroll(options: UseHideOnScrollOptions = {}): UseHideOnScrollReturn {
  const {
    threshold = 10,
    mobileOnly = true,
    initiallyVisible = true,
  } = options;

  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDir = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Always show at top of page
    if (currentScrollY < 50) {
      setIsVisible(true);
      setScrollDirection(null);
      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
      ticking.current = false;
      return;
    }

    const diff = currentScrollY - lastScrollY.current;
    
    // Only update if scrolled more than threshold
    if (Math.abs(diff) < threshold) {
      ticking.current = false;
      return;
    }

    // Check if mobile only
    if (mobileOnly && window.innerWidth >= 768) {
      setIsVisible(true);
      ticking.current = false;
      return;
    }

    if (diff > 0) {
      // Scrolling down
      setScrollDirection('down');
      setIsVisible(false);
    } else {
      // Scrolling up
      setScrollDirection('up');
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
    setScrollY(currentScrollY);
    ticking.current = false;
  }, [threshold, mobileOnly]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollDir]);

  return { isVisible, scrollDirection, scrollY };
}

export default useHideOnScroll;
