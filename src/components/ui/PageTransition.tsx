/**
 * PageTransition Component
 * 
 * Smooth page transitions for mobile navigation.
 * Wraps page content with enter/exit animations.
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
  /** Animation type */
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
  /** Animation duration (ms) */
  duration?: number;
}

export function PageTransition({
  children,
  variant = 'fade',
  duration = 300,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // When children change (page navigation), trigger transition
    if (children !== displayChildren) {
      setIsTransitioning(true);
      
      // Exit animation
      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        
        // Enter animation
        const enterTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
        
        return () => clearTimeout(enterTimer);
      }, duration / 2);
      
      return () => clearTimeout(exitTimer);
    }
  }, [children, displayChildren, duration]);

  // Animation classes
  const animations = {
    fade: {
      enter: 'opacity-100',
      exit: 'opacity-0',
      base: 'transition-opacity',
    },
    'slide-up': {
      enter: 'opacity-100 translate-y-0',
      exit: 'opacity-0 translate-y-4',
      base: 'transition-all',
    },
    'slide-left': {
      enter: 'opacity-100 translate-x-0',
      exit: 'opacity-0 translate-x-4',
      base: 'transition-all',
    },
    scale: {
      enter: 'opacity-100 scale-100',
      exit: 'opacity-0 scale-95',
      base: 'transition-all',
    },
  };

  const anim = animations[variant];
  const animationClass = isTransitioning ? anim.exit : anim.enter;

  return (
    <div
      className={`${anim.base} ${animationClass}`}
      style={{ transitionDuration: `${duration / 2}ms` }}
    >
      {displayChildren}
    </div>
  );
}

/** Staggered list animation wrapper */
export function StaggeredList({
  children,
  staggerDelay = 50,
  className = '',
}: {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'backwards',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/** Simple fade in on mount */
export function FadeIn({
  children,
  delay = 0,
  duration = 300,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/** Slide up on mount */
export function SlideUp({
  children,
  delay = 0,
  duration = 400,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        transition-all
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

export default PageTransition;
