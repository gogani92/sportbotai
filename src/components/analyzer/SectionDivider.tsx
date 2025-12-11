/**
 * Section Divider Component
 * 
 * Premium glowing section separator with label.
 * Creates visual hierarchy and makes long pages feel organized.
 * 
 * Style: iOS 17 + Tesla UI inspired
 */

'use client';

interface SectionDividerProps {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
  className?: string;
}

export default function SectionDivider({ 
  label, 
  icon,
  variant = 'primary',
  className = '' 
}: SectionDividerProps) {
  const variants = {
    primary: {
      line: 'from-transparent via-accent/40 to-transparent',
      glow: 'shadow-[0_0_20px_rgba(42,246,160,0.15)]',
      text: 'text-accent',
      bg: 'bg-accent/5',
    },
    secondary: {
      line: 'from-transparent via-primary/40 to-transparent',
      glow: 'shadow-[0_0_15px_rgba(26,115,232,0.1)]',
      text: 'text-primary',
      bg: 'bg-primary/5',
    },
    subtle: {
      line: 'from-transparent via-divider to-transparent',
      glow: '',
      text: 'text-text-muted',
      bg: 'bg-white/3',
    },
  };

  const style = variants[variant];

  return (
    <div className={`relative flex items-center justify-center py-6 lg:py-8 ${className}`}>
      {/* Left Line */}
      <div className={`flex-1 h-px bg-gradient-to-r ${style.line} ${style.glow}`}></div>
      
      {/* Center Label */}
      <div className={`mx-4 px-4 py-1.5 rounded-full ${style.bg} border border-white/5`}>
        <span className={`text-xs sm:text-sm font-semibold uppercase tracking-widest ${style.text}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </span>
      </div>
      
      {/* Right Line */}
      <div className={`flex-1 h-px bg-gradient-to-l ${style.line} ${style.glow}`}></div>
    </div>
  );
}
