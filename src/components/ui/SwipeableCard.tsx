/**
 * SwipeableCard Component
 * 
 * Wraps content and adds swipe-to-reveal actions (like iOS Mail).
 * Supports left and right swipe actions.
 */

'use client';

import { ReactNode, useState, useRef, useCallback } from 'react';

interface SwipeAction {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  /** Swipe threshold to trigger action (px) */
  threshold?: number;
  /** Disable swipe */
  disabled?: boolean;
  className?: string;
}

export default function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 80,
  disabled = false,
  className = '',
}: SwipeableCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = Math.max(leftActions.length, rightActions.length) * 80;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    // Add resistance at edges
    const resistance = 0.5;
    const resistedDiff = limitedDiff * (1 - Math.abs(limitedDiff) / (maxSwipe * 2) * resistance);
    
    setTranslateX(resistedDiff);
  }, [isDragging, disabled, leftActions.length, rightActions.length]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if threshold reached for action
    if (translateX > threshold && leftActions.length > 0) {
      // Trigger first left action
      leftActions[0].onClick();
    } else if (translateX < -threshold && rightActions.length > 0) {
      // Trigger first right action
      rightActions[0].onClick();
    }

    // Reset position
    setTranslateX(0);
  }, [isDragging, translateX, threshold, leftActions, rightActions]);

  // Calculate action visibility
  const showLeftActions = translateX > 20;
  const showRightActions = translateX < -20;
  const actionOpacity = Math.min(1, Math.abs(translateX) / threshold);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Left actions (revealed on right swipe) */}
      {leftActions.length > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 flex items-center gap-2 px-4"
          style={{ opacity: showLeftActions ? actionOpacity : 0 }}
        >
          {leftActions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`
                flex flex-col items-center justify-center gap-1 p-3 rounded-xl
                transition-transform ${translateX > threshold ? 'scale-110' : 'scale-100'}
              `}
              style={{ backgroundColor: action.color }}
            >
              {action.icon}
              <span className="text-[10px] font-medium text-white">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right actions (revealed on left swipe) */}
      {rightActions.length > 0 && (
        <div 
          className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4"
          style={{ opacity: showRightActions ? actionOpacity : 0 }}
        >
          {rightActions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`
                flex flex-col items-center justify-center gap-1 p-3 rounded-xl
                transition-transform ${translateX < -threshold ? 'scale-110' : 'scale-100'}
              `}
              style={{ backgroundColor: action.color }}
            >
              {action.icon}
              <span className="text-[10px] font-medium text-white">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        className={`relative bg-bg-card transition-transform ${isDragging ? 'duration-0' : 'duration-200'}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
