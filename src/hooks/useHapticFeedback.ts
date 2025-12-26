/**
 * useHapticFeedback Hook
 * 
 * Provides haptic feedback on supported devices (iOS Safari, Android Chrome).
 * Falls back silently on unsupported devices.
 */

'use client';

import { useCallback } from 'react';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHapticFeedback() {
  const vibrate = useCallback((style: HapticStyle = 'light') => {
    // Check if vibration API is available
    if (typeof navigator === 'undefined' || !navigator.vibrate) {
      return;
    }

    // Pattern based on style (duration in ms)
    const patterns: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 20], // Quick double tap
      warning: [30, 50, 30], // Double pulse
      error: [50, 30, 50, 30, 50], // Triple shake
    };

    try {
      navigator.vibrate(patterns[style]);
    } catch {
      // Silently fail if vibration is blocked
    }
  }, []);

  const lightTap = useCallback(() => vibrate('light'), [vibrate]);
  const mediumTap = useCallback(() => vibrate('medium'), [vibrate]);
  const heavyTap = useCallback(() => vibrate('heavy'), [vibrate]);
  const success = useCallback(() => vibrate('success'), [vibrate]);
  const warning = useCallback(() => vibrate('warning'), [vibrate]);
  const error = useCallback(() => vibrate('error'), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    warning,
    error,
  };
}

export default useHapticFeedback;
