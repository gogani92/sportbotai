/**
 * Animated Counter Component
 * 
 * Smooth number animations for stats and metrics.
 * Clean SaaS dashboard feel.
 * 
 * Features:
 * - Smooth easeOutQuart animation
 * - Optional viewport trigger (animateOnView)
 * - Configurable duration, prefix, suffix, decimals
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  /** Only start animation when element enters viewport */
  animateOnView?: boolean;
  /** Threshold for intersection observer (0-1) */
  viewThreshold?: number;
}

export default function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  animateOnView = false,
  viewThreshold = 0.3,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(animateOnView ? 0 : 0);
  const [hasAnimated, setHasAnimated] = useState(!animateOnView);
  const elementRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  const startAnimation = useCallback((endValue: number) => {
    const startValue = startValueRef.current;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        startValueRef.current = endValue;
      }
    };

    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);
  }, [duration]);

  // Viewport detection for animateOnView
  useEffect(() => {
    if (!animateOnView || hasAnimated) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startAnimation(value);
          }
        });
      },
      { threshold: viewThreshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [animateOnView, hasAnimated, value, viewThreshold, startAnimation]);

  // Normal animation (when not using animateOnView, or when value changes after initial animation)
  useEffect(() => {
    if (animateOnView && !hasAnimated) return;
    
    startAnimation(value);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animateOnView, hasAnimated, startAnimation]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

/**
 * Stat Counter with label
 */
interface StatCounterProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatCounter({
  label,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  trend,
  trendValue,
  size = 'md',
  className = '',
}: StatCounterProps) {
  const sizeStyles = {
    sm: { number: 'text-xl', label: 'text-xs' },
    md: { number: 'text-3xl', label: 'text-sm' },
    lg: { number: 'text-4xl', label: 'text-base' },
  };

  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`${sizeStyles[size].label} text-gray-500 mb-1`}>{label}</span>
      <div className="flex items-baseline gap-2">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className={`${sizeStyles[size].number} font-bold text-white`}
        />
        {trend && trendValue && (
          <span className={`text-xs font-medium ${trendColors[trend]}`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Compact Mini Counter
 */
interface MiniCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MiniCounter({ value, label, icon, className = '' }: MiniCounterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon && <span className="text-gray-500">{icon}</span>}
      <div className="flex flex-col">
        <AnimatedCounter
          value={value}
          className="text-lg font-bold text-white"
        />
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

/**
 * Big Hero Counter for landing pages
 */
interface HeroCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function HeroCounter({
  value,
  label,
  suffix = '',
  prefix = '',
  className = '',
}: HeroCounterProps) {
  return (
    <div className={`text-center ${className}`}>
      <AnimatedCounter
        value={value}
        prefix={prefix}
        suffix={suffix}
        duration={1500}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
      />
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
