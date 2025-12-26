/**
 * ScrollReveal Component
 * 
 * Wraps content and reveals it with smooth animations when scrolled into view.
 * Premium Apple-style reveal animations.
 * 
 * Usage:
 * <ScrollReveal animation="fade-up">
 *   <YourContent />
 * </ScrollReveal>
 * 
 * For staggered lists:
 * {items.map((item, i) => (
 *   <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
 *     <Item />
 *   </ScrollReveal>
 * ))}
 */

'use client';

import { ReactNode, CSSProperties } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type AnimationType = 
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'scale-up'
  | 'blur';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const getInitialStyles = (animation: AnimationType): CSSProperties => {
  const base: CSSProperties = {
    opacity: 0,
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  switch (animation) {
    case 'fade':
      return base;
    case 'fade-up':
      return { ...base, transform: 'translateY(30px)' };
    case 'fade-down':
      return { ...base, transform: 'translateY(-30px)' };
    case 'fade-left':
      return { ...base, transform: 'translateX(30px)' };
    case 'fade-right':
      return { ...base, transform: 'translateX(-30px)' };
    case 'scale':
      return { ...base, transform: 'scale(0.95)' };
    case 'scale-up':
      return { ...base, transform: 'scale(0.95) translateY(20px)' };
    case 'blur':
      return { ...base, filter: 'blur(10px)' };
    default:
      return base;
  }
};

const getRevealedStyles = (animation: AnimationType, duration: number): CSSProperties => {
  return {
    opacity: 1,
    transform: 'translateY(0) translateX(0) scale(1)',
    filter: 'blur(0)',
    transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
  };
};

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
  className = '',
  as: Component = 'div',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({
    threshold,
    once,
    delay,
  });

  const styles: CSSProperties = isVisible
    ? { ...getRevealedStyles(animation, duration), transitionDelay: `${delay}ms` }
    : { ...getInitialStyles(animation), transitionDelay: `${delay}ms` };

  // Cast Component to any to handle dynamic element type
  const Element = Component as any;

  return (
    <Element ref={ref} className={className} style={styles}>
      {children}
    </Element>
  );
}

/**
 * Staggered container for lists
 * Automatically staggers children with increasing delays
 */
interface StaggerContainerProps {
  children: ReactNode[];
  animation?: AnimationType;
  staggerDelay?: number;
  baseDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  animation = 'fade-up',
  staggerDelay = 80,
  baseDelay = 0,
  className = '',
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          animation={animation}
          delay={baseDelay + index * staggerDelay}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
