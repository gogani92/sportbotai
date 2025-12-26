/**
 * Bottom Sheet Component
 * 
 * Mobile-native bottom sheet modal (like iOS/Android).
 * Supports drag-to-dismiss and snap points.
 */

'use client';

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Title shown in header */
  title?: string;
  /** Snap points as percentages of screen height */
  snapPoints?: number[];
  /** Initial snap point index */
  initialSnap?: number;
  /** Allow dragging to dismiss */
  dismissible?: boolean;
  /** Show drag handle */
  showHandle?: boolean;
  /** Additional classes for content */
  className?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [50, 90],
  initialSnap = 0,
  dismissible = true,
  showHandle = true,
  className = '',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(snapPoints[initialSnap]);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset height when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentHeight(snapPoints[initialSnap]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, snapPoints, initialSnap]);

  // Handle touch/mouse start
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartHeight(currentHeight);
  }, [currentHeight]);

  // Handle touch/mouse move
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    
    const deltaY = startY - clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(10, Math.min(95, startHeight + deltaPercent));
    
    setCurrentHeight(newHeight);
  }, [isDragging, startY, startHeight]);

  // Handle touch/mouse end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Find nearest snap point
    const distances = snapPoints.map(snap => Math.abs(currentHeight - snap));
    const closestIndex = distances.indexOf(Math.min(...distances));
    
    // If dragged below minimum snap and dismissible, close
    if (dismissible && currentHeight < snapPoints[0] - 15) {
      onClose();
      return;
    }
    
    setCurrentHeight(snapPoints[closestIndex]);
  }, [isDragging, currentHeight, snapPoints, dismissible, onClose]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={dismissible ? onClose : undefined}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-[101]
          bg-bg-card border-t border-white/10
          rounded-t-2xl shadow-2xl
          transition-[height] ${isDragging ? 'duration-0' : 'duration-300'} ease-out
        `}
        style={{ height: `${currentHeight}vh` }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onMouseMove={(e) => isDragging && handleDragMove(e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="w-10 h-1 bg-gray-500 rounded-full" />
          </div>
        )}
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className={`overflow-y-auto overscroll-contain ${className}`} style={{ 
          height: title ? 'calc(100% - 60px)' : 'calc(100% - 20px)',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        }}>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

/**
 * Simple action sheet for quick choices
 */
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    destructive?: boolean;
  }[];
}

export function ActionSheet({ isOpen, onClose, title, actions }: ActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[40]} className="p-4">
      {title && (
        <p className="text-center text-sm text-gray-400 mb-4">{title}</p>
      )}
      <div className="space-y-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3
              rounded-xl text-left font-medium
              transition-colors active:scale-[0.98]
              ${action.destructive 
                ? 'text-red-400 hover:bg-red-500/10' 
                : 'text-white hover:bg-white/5'
              }
            `}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full mt-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
      >
        Cancel
      </button>
    </BottomSheet>
  );
}
