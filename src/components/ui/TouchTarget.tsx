/**
 * Touch Target Utility Component
 * 
 * Ensures minimum 44x44px touch targets (WCAG 2.5.5).
 * Expands hit area without changing visual size.
 */

'use client';

import { ReactNode, forwardRef } from 'react';

interface TouchTargetProps {
  children: ReactNode;
  /** Minimum touch size in pixels */
  minSize?: number;
  /** Additional class names */
  className?: string;
  /** Make it interactive */
  as?: 'button' | 'div' | 'span';
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Aria label for accessibility */
  'aria-label'?: string;
}

/**
 * TouchTarget
 * 
 * Wraps small interactive elements to ensure they have at least 44x44px touch area.
 * The visual element can be smaller, but the touch hit area will be expanded.
 */
export const TouchTarget = forwardRef<HTMLDivElement, TouchTargetProps>(
  function TouchTarget(
    {
      children,
      minSize = 44,
      className = '',
      as = 'div',
      onClick,
      disabled = false,
      'aria-label': ariaLabel,
    },
    ref
  ) {
    const Component = as;
    const isButton = as === 'button';

    return (
      <Component
        ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
        className={`
          relative 
          inline-flex items-center justify-center
          touch-manipulation
          ${isButton ? 'cursor-pointer' : ''}
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
          ${className}
        `}
        onClick={!disabled ? onClick : undefined}
        disabled={isButton ? disabled : undefined}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        style={{
          // Ensure minimum touch target
          minWidth: `${minSize}px`,
          minHeight: `${minSize}px`,
        }}
      >
        {/* Invisible hit area extension */}
        <span
          className="absolute inset-0 -m-2 rounded-full"
          aria-hidden="true"
        />
        
        {/* Actual content */}
        {children}
      </Component>
    );
  }
);

/**
 * ExpandedHitArea
 * 
 * Simple wrapper that expands clickable area using pseudo-elements.
 * Use for icons/buttons that need larger touch areas.
 */
export function ExpandedHitArea({
  children,
  className = '',
  expansion = 8,
}: {
  children: ReactNode;
  className?: string;
  expansion?: number;
}) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        // CSS approach to expand hit area
        padding: `${expansion}px`,
        margin: `-${expansion}px`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * IconButton
 * 
 * Pre-styled icon button with proper touch target.
 */
export function IconButton({
  icon,
  onClick,
  label,
  className = '',
  variant = 'ghost',
  size = 'md',
  disabled = false,
}: {
  icon: ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
  variant?: 'ghost' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    ghost: 'hover:bg-white/10 active:bg-white/20 text-text-muted hover:text-text',
    filled: 'bg-accent/20 hover:bg-accent/30 text-accent',
    outline: 'border border-divider hover:border-accent/50 text-text-muted hover:text-accent',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        ${sizeClasses[size]} min-w-[44px] min-h-[44px]
        rounded-xl
        flex items-center justify-center
        transition-all duration-150
        touch-manipulation
        active:scale-90
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon}
    </button>
  );
}

export default TouchTarget;
