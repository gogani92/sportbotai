/**
 * useSwipeNavigation Hook
 * 
 * Enables swipe left/right navigation between items.
 * Great for navigating between matches or tabs.
 */

import { useCallback, useRef, useState } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

interface UseSwipeNavigationOptions {
  /** Swipe distance threshold (px) */
  threshold?: number;
  /** Callback when swiping left */
  onSwipeLeft?: () => void;
  /** Callback when swiping right */
  onSwipeRight?: () => void;
  /** Enable/disable */
  enabled?: boolean;
  /** Enable haptic feedback */
  haptic?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
}

export function useSwipeNavigation({
  threshold = 100,
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
  haptic = true,
}: UseSwipeNavigationOptions = {}) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isSwiping: false,
    direction: null,
  });
  
  const { lightTap, mediumTap } = useHapticFeedback();
  const triggeredRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    triggeredRef.current = false;
    
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      isSwiping: false,
      direction: null,
    });
  }, [enabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = Math.abs(touch.clientY - swipeState.startY);
    
    // Only consider horizontal swipes
    if (deltaY > Math.abs(deltaX) * 0.5) {
      return;
    }
    
    const direction = deltaX > 0 ? 'right' : 'left';
    const isSwiping = Math.abs(deltaX) > 20;
    
    // Haptic feedback when crossing threshold
    if (Math.abs(deltaX) >= threshold && !triggeredRef.current) {
      if (haptic) lightTap();
      triggeredRef.current = true;
    } else if (Math.abs(deltaX) < threshold) {
      triggeredRef.current = false;
    }
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      isSwiping,
      direction,
    }));
  }, [enabled, swipeState.startX, swipeState.startY, threshold, haptic, lightTap]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !swipeState.isSwiping) {
      setSwipeState(prev => ({ ...prev, isSwiping: false, direction: null }));
      return;
    }
    
    const deltaX = swipeState.currentX - swipeState.startX;
    
    if (Math.abs(deltaX) >= threshold) {
      if (deltaX > 0 && onSwipeRight) {
        if (haptic) mediumTap();
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        if (haptic) mediumTap();
        onSwipeLeft();
      }
    }
    
    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      isSwiping: false,
      direction: null,
    });
  }, [enabled, swipeState, threshold, onSwipeLeft, onSwipeRight, haptic, mediumTap]);

  // Calculate swipe offset for visual feedback
  const swipeOffset = swipeState.isSwiping 
    ? swipeState.currentX - swipeState.startX 
    : 0;

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  };

  return {
    handlers,
    swipeOffset,
    isSwiping: swipeState.isSwiping,
    direction: swipeState.direction,
  };
}

export default useSwipeNavigation;
