/**
 * Team Logo Component
 * 
 * Displays team logos with automatic fallback to generated initials.
 * Uses ESPN, API-Sports, or fallback SVG based on sport/team.
 * For MMA/UFC (individual sports), shows fighter's country flag instead.
 */

'use client';

import { useState } from 'react';
import { getTeamLogo } from '@/lib/logos';
import FighterFlag from './FighterFlag';

interface TeamLogoProps {
  teamName: string;
  sport: string;
  league?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

/**
 * Check if sport is an individual combat sport (MMA/UFC/Boxing)
 */
function isIndividualSport(sport: string): boolean {
  const normalized = sport.toLowerCase();
  return (
    normalized.includes('mma') ||
    normalized.includes('ufc') ||
    normalized.includes('bellator') ||
    normalized.includes('pfl') ||
    normalized.includes('boxing') ||
    normalized.includes('mixed_martial_arts')
  );
}

export default function TeamLogo({ 
  teamName, 
  sport, 
  league, 
  size = 'md',
  className = '' 
}: TeamLogoProps) {
  const [hasError, setHasError] = useState(false);
  
  // For MMA/UFC/Boxing - show fighter's country flag instead of team logo
  if (isIndividualSport(sport)) {
    return <FighterFlag fighterName={teamName} size={size} className={className} />;
  }
  
  const logoUrl = getTeamLogo(teamName, sport, league);
  const isFallback = logoUrl.startsWith('data:');

  // Generate fallback initials
  const getInitials = (name: string) => {
    const words = name.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  // Generate consistent color from name
  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 50%)`;
  };

  // If external logo fails, show initials
  if (hasError || isFallback) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ backgroundColor: getColor(teamName) }}
      >
        <span className="text-white font-bold text-xs">
          {getInitials(teamName)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${teamName} logo`}
      className={`${sizeClasses[size]} object-contain flex-shrink-0 ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
