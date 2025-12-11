/**
 * Match Context Indicators Component
 * 
 * Displays contextual factors that can influence match outcomes:
 * - Rest days (back-to-back, well-rested)
 * - Travel/schedule fatigue
 * - Rivalry/derby indicator
 * - Playoff implications
 * - Motivation factors
 * 
 * Uses compact pill-style indicators with tooltips.
 */

'use client';

import { AnalyzeResponse } from '@/types';
import { useMemo } from 'react';

interface MatchContextIndicatorsProps {
  result: AnalyzeResponse;
}

interface ContextIndicator {
  id: string;
  icon: string;
  label: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral' | 'warning';
  team?: 'home' | 'away' | 'both';
}

// Detect rivalry/derby matches
const RIVALRY_KEYWORDS = [
  // Soccer
  'derby', 'clásico', 'clasico', 'old firm', 'superclásico', 'manchester', 'north london',
  'merseyside', 'el trafico', 'cascadia',
  // NBA
  'celtics lakers', 'lakers celtics', 'knicks nets', 'bulls pistons', 'heat knicks',
  // NFL
  'cowboys eagles', 'packers bears', 'steelers ravens', 'patriots jets', '49ers seahawks',
  // NHL
  'bruins canadiens', 'rangers islanders', 'penguins flyers', 'maple leafs canadiens',
];

function isRivalryMatch(homeTeam: string, awayTeam: string, league: string): boolean {
  const combined = `${homeTeam} ${awayTeam} ${league}`.toLowerCase();
  return RIVALRY_KEYWORDS.some(keyword => combined.includes(keyword.toLowerCase()));
}

// Parse match date to get context
function getScheduleContext(matchDate: string): {
  daysUntilMatch: number;
  dayOfWeek: string;
  isWeekend: boolean;
  isPrimeTime: boolean;
} {
  const date = new Date(matchDate);
  const now = new Date();
  const daysUntilMatch = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const hour = date.getHours();
  
  return {
    daysUntilMatch,
    dayOfWeek,
    isWeekend: [0, 6].includes(date.getDay()),
    isPrimeTime: hour >= 19 && hour <= 22,
  };
}

// Sport-specific context detection
function getSportSpecificContext(sport: string, keyFactors: string[]): ContextIndicator[] {
  const indicators: ContextIndicator[] = [];
  const normalized = sport.toLowerCase();
  const factorsText = keyFactors.join(' ').toLowerCase();

  // Back-to-back detection
  if (factorsText.includes('back-to-back') || factorsText.includes('b2b') || factorsText.includes('second game')) {
    indicators.push({
      id: 'b2b',
      icon: '😓',
      label: 'Back-to-Back',
      description: 'Playing second game in consecutive days - expect fatigue',
      impact: 'negative',
    });
  }

  // Rest advantage
  if (factorsText.includes('rest') || factorsText.includes('days off') || factorsText.includes('well rested')) {
    indicators.push({
      id: 'rest',
      icon: '💪',
      label: 'Rest Advantage',
      description: 'One team has significant rest advantage',
      impact: 'positive',
    });
  }

  // Travel fatigue
  if (factorsText.includes('travel') || factorsText.includes('road trip') || factorsText.includes('coast')) {
    indicators.push({
      id: 'travel',
      icon: '✈️',
      label: 'Travel Factor',
      description: 'Long travel may affect performance',
      impact: 'warning',
    });
  }

  // Injury concerns
  if (factorsText.includes('injury') || factorsText.includes('injured') || factorsText.includes('missing')) {
    indicators.push({
      id: 'injuries',
      icon: '🏥',
      label: 'Injury Alert',
      description: 'Key players may be missing',
      impact: 'warning',
    });
  }

  // Form momentum
  if (factorsText.includes('winning streak') || factorsText.includes('hot streak') || factorsText.includes('momentum')) {
    indicators.push({
      id: 'momentum',
      icon: '🔥',
      label: 'Hot Streak',
      description: 'Team on a winning run',
      impact: 'positive',
    });
  }

  if (factorsText.includes('losing streak') || factorsText.includes('cold') || factorsText.includes('struggling')) {
    indicators.push({
      id: 'cold',
      icon: '❄️',
      label: 'Cold Streak',
      description: 'Team struggling recently',
      impact: 'negative',
    });
  }

  // Sport-specific
  if (normalized.includes('nfl')) {
    if (factorsText.includes('weather') || factorsText.includes('snow') || factorsText.includes('rain') || factorsText.includes('wind')) {
      indicators.push({
        id: 'weather',
        icon: '🌧️',
        label: 'Weather Factor',
        description: 'Weather conditions may impact gameplay',
        impact: 'warning',
      });
    }
    if (factorsText.includes('divisional') || factorsText.includes('division')) {
      indicators.push({
        id: 'division',
        icon: '⚔️',
        label: 'Division Game',
        description: 'Divisional games are historically more competitive',
        impact: 'neutral',
      });
    }
  }

  if (normalized.includes('nba') || normalized.includes('basketball')) {
    if (factorsText.includes('altitude') || factorsText.includes('denver')) {
      indicators.push({
        id: 'altitude',
        icon: '⛰️',
        label: 'Altitude Factor',
        description: 'High altitude can affect visiting teams',
        impact: 'warning',
      });
    }
  }

  return indicators;
}

export default function MatchContextIndicators({ result }: MatchContextIndicatorsProps) {
  const { matchInfo, momentumAndForm, riskAnalysis, tacticalAnalysis } = result;

  const indicators = useMemo((): ContextIndicator[] => {
    const allIndicators: ContextIndicator[] = [];

    // 1. Rivalry detection
    if (isRivalryMatch(matchInfo.homeTeam, matchInfo.awayTeam, matchInfo.leagueName)) {
      allIndicators.push({
        id: 'rivalry',
        icon: '🔴',
        label: 'Rivalry Match',
        description: 'Historic rivalry - expect high intensity',
        impact: 'warning',
        team: 'both',
      });
    }

    // 2. Schedule context
    if (matchInfo.matchDate) {
      const schedule = getScheduleContext(matchInfo.matchDate);
      
      if (schedule.isPrimeTime) {
        allIndicators.push({
          id: 'primetime',
          icon: '📺',
          label: 'Prime Time',
          description: 'National TV game - players often more motivated',
          impact: 'neutral',
        });
      }
    }

    // 3. Sport-specific context from key factors
    const sportContext = getSportSpecificContext(
      matchInfo.sport,
      [
        ...momentumAndForm.keyFormFactors,
        ...(tacticalAnalysis.keyMatchFactors || []),
        riskAnalysis.riskExplanation,
      ]
    );
    allIndicators.push(...sportContext);

    // 4. Data quality indicator
    if (matchInfo.dataQuality === 'LOW') {
      allIndicators.push({
        id: 'data-low',
        icon: '⚠️',
        label: 'Limited Data',
        description: 'Analysis based on limited available data',
        impact: 'warning',
      });
    }

    // 5. Home advantage context
    const homeAdvantageStrong = matchInfo.sport.toLowerCase().includes('soccer') ||
                                matchInfo.sport.toLowerCase().includes('nfl');
    if (homeAdvantageStrong) {
      allIndicators.push({
        id: 'home-advantage',
        icon: '🏟️',
        label: 'Strong Home Factor',
        description: `${matchInfo.sport} typically has significant home advantage`,
        impact: 'neutral',
        team: 'home',
      });
    }

    // 6. Upset potential indicator
    if (result.upsetPotential.upsetProbability >= 35) {
      allIndicators.push({
        id: 'upset-alert',
        icon: '⚡',
        label: 'Upset Potential',
        description: `${result.upsetPotential.upsetProbability}% chance of upset - underdog has factors in their favor`,
        impact: 'warning',
      });
    }

    // Limit to most relevant indicators
    return allIndicators.slice(0, 6);
  }, [matchInfo, momentumAndForm, tacticalAnalysis, riskAnalysis, result.upsetPotential]);

  if (indicators.length === 0) {
    return null;
  }

  const impactColors = {
    positive: 'bg-success/10 text-success border-success/20',
    negative: 'bg-danger/10 text-danger border-danger/20',
    neutral: 'bg-info/10 text-info border-info/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <div className="bg-bg-card rounded-2xl border border-divider shadow-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-sm">🎯</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">Match Context</h3>
          <p className="text-[10px] text-text-muted">Key situational factors</p>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="flex flex-wrap gap-2">
        {indicators.map((indicator) => (
          <div
            key={indicator.id}
            className={`
              group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border
              text-[11px] sm:text-xs font-medium transition-all cursor-help
              ${impactColors[indicator.impact]}
              hover:scale-105
            `}
            title={indicator.description}
          >
            <span>{indicator.icon}</span>
            <span>{indicator.label}</span>
            {indicator.team && (
              <span className="text-[9px] opacity-70">
                ({indicator.team === 'home' ? 'H' : indicator.team === 'away' ? 'A' : '⇄'})
              </span>
            )}

            {/* Tooltip */}
            <div className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
              bg-bg-primary border border-divider rounded-lg shadow-lg
              text-[10px] text-text-secondary whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
              z-50
            ">
              {indicator.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-bg-primary"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Summary */}
      <div className="mt-4 pt-3 border-t border-divider">
        <div className="flex items-center gap-4 text-[10px] sm:text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Favorable
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning"></span>
            Monitor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger"></span>
            Concern
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-info"></span>
            Neutral
          </span>
        </div>
      </div>
    </div>
  );
}
