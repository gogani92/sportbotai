/**
 * useLongPress Hook
 * 
 * Detects long-press gestures for context menus and quick previews.
 * Cancels if user moves finger too much (drag vs long press).
 */

import { useCallback, useRef, useState } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

interface UseLongPressOptions {
  /** Duration to trigger long press (ms) */
  threshold?: number;
  /** Max movement allowed before cancelling (px) */
  moveThreshold?: number;
  /** Callback on long press */
  onLongPress?: () => void;
  /** Callback on press start */
  onPressStart?: () => void;
  /** Callback on press end */
  onPressEnd?: () => void;
  /** Enable haptic feedback */
  haptic?: boolean;
  /** Disable the long press */
  disabled?: boolean;
}

interface Position {
  x: number;
  y: number;
}

export function useLongPress({
  threshold = 500,
  moveThreshold = 10,
  onLongPress,
  onPressStart,
  onPressEnd,
  haptic = true,
  disabled = false,
}: UseLongPressOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<Position | null>(null);
  const { mediumTap } = useHapticFeedback();

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressed(false);
    startPosRef.current = null;
  }, []);

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    
    // Get starting position
    if ('touches' in e) {
      startPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else {
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
    
    setIsPressed(true);
    onPressStart?.();
    
    // Start long press timer
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true);
      
      if (haptic) {
        mediumTap();
      }
      
      onLongPress?.();
    }, threshold);
  }, [disabled, threshold, haptic, mediumTap, onLongPress, onPressStart]);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!startPosRef.current || !timerRef.current) return;
    
    let currentPos: Position;
    
    if ('touches' in e) {
      currentPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else {
      currentPos = {
        x: e.clientX,
        y: e.clientY,
      };
    }
    
    // Check if moved too far
    const deltaX = Math.abs(currentPos.x - startPosRef.current.x);
    const deltaY = Math.abs(currentPos.y - startPosRef.current.y);
    
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      cancel();
    }
  }, [moveThreshold, cancel]);

  const handleEnd = useCallback(() => {
    cancel();
    setIsLongPressed(false);
    onPressEnd?.();
  }, [cancel, onPressEnd]);

  // Touch/mouse handler props
  const handlers = {
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
    onTouchCancel: handleEnd,
    onMouseDown: handleStart,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  };

  return {
    handlers,
    isPressed,
    isLongPressed,
    cancel,
  };
}

export default useLongPress;
