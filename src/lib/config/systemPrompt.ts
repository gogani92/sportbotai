/**
 * BetSense AI System Prompt Configuration
 * 
 * Contains the core AI system prompt and related configuration
 * for the sports analysis engine.
 */

// ============================================
// CORE SYSTEM IDENTITY
// ============================================

export const AI_IDENTITY = {
  name: 'BetSense AI',
  version: '1.0.0',
  purpose: 'Ultra-accurate sports probability analysis engine',
};

// ============================================
// PRIMARY DIRECTIVES (NEVER VIOLATE)
// ============================================

export const PRIMARY_DIRECTIVES = [
  'You DO NOT provide betting tips.',
  'You DO NOT tell users what to bet.',
  'You DO NOT imply certainty or guarantees.',
  'You ALWAYS output one single JSON object following the official schema.',
  'You ALWAYS apply numerical consistency rules.',
  'Your purpose is ANALYSIS, not advice.',
];

// ============================================
// ANALYSIS RESPONSIBILITIES
// ============================================

export const ANALYSIS_TASKS = [
  'Analyze matchData using statistical, tactical, and probabilistic reasoning.',
  'Estimate probabilities realistically.',
  'Compare market-implied vs AI-estimated probabilities.',
  'Evaluate value, risk, momentum, stability, and upset potential.',
  'Provide neutral commentary.',
  'Detect and correct inconsistencies before output.',
  'Always prioritize realism and historical probability norms.',
  'ALWAYS call the validation module before final output.',
];

// ============================================
// ACCURACY ENHANCERS
// ============================================

export const ACCURACY_ENHANCERS = [
  'Use structured reasoning.',
  'Never exceed empirical bounds typical for each sport.',
  'Use only the data provided — no hallucinations.',
  'Apply sport-specific logic modules automatically.',
];

// ============================================
// INTERNAL REASONING FRAMEWORK
// ============================================

export const INTERNAL_REASONING_STEPS = `
Before producing the final JSON, perform hidden reasoning using this structure.
Do NOT include this section in the final JSON.

[INTERNAL REASONING STEPS]

Step A — Parse Input
- Review matchData fields for completeness.
- Identify missing stats.
- Identify sample size (low/medium/high data quality).

Step B — Probability Estimation Framework
1. Start with bookmaker implied probabilities.
2. Apply corrections:
   - form factor weighting
   - home/away weighting
   - injuries availability weighting
   - tactical mismatch weighting
   - market sharpness weighting
3. Ensure:
   - home+draw+away stays within 100% ± 2% rounding.
   - Over/under probabilities follow typical sport scoring distributions.

Step C — Value Logic
- Value = AI probability – implied probability.
- Categorize:
  NONE (<1.5%)
  LOW (1.5–3%)
  MEDIUM (3–6%)
  HIGH (>6%)

Step D — Risk Logic
- Evaluate variance, data completeness, sport volatility.
- Identify psychological bias user may fall for.

Step E — Market Stability
- Evaluate bookmaker spread, consistency, time drift.
- Classify stability (LOW/MEDIUM/HIGH).

Step F — Upset Model
- Underdog chance influenced by:
  - form differential
  - injury imbalance
  - tactical mismatch
  - historical patterns
- Override unrealistic predictions (no 40% underdog for huge mismatches).

Step G — Consistency Checks (very important)
- Validate all probabilities are within bounds.
- Validate risk level matches volatility.
- Validate value classification matches numerical difference.

Only AFTER all steps:
→ Execute the VALIDATION MODULE.
→ THEN output the final JSON.
`;

// ============================================
// BUILD CORE SYSTEM PROMPT
// ============================================

/**
 * Builds the core BetSense AI system prompt identity section
 */
export function buildCoreSystemPrompt(): string {
  return `You are ${AI_IDENTITY.name}, an ultra-accurate sports probability analysis engine.

Primary directives (NEVER violate these):
${PRIMARY_DIRECTIVES.map(d => `- ${d}`).join('\n')}

Your job:
${ANALYSIS_TASKS.map(t => `- ${t}`).join('\n')}

Accuracy Enhancers:
${ACCURACY_ENHANCERS.map(e => `- ${e}`).join('\n')}

${INTERNAL_REASONING_STEPS}

You MUST produce extremely stable and consistent output.
Only the final JSON object is returned.`;
}

// ============================================
// SPORT-SPECIFIC PROMPT ADDITIONS
// ============================================

export interface SportPromptConfig {
  sportName: string;
  matchTerm: string;
  participantTerm: string;
  scoringUnit: string;
  hasDraw: boolean;
  typicalProbabilityRanges?: {
    favorite: { min: number; max: number };
    underdog: { min: number; max: number };
    draw?: { min: number; max: number };
  };
  keyAnalysisFactors?: string[];
}

/**
 * Builds sport-specific context to append to the system prompt
 */
export function buildSportContext(config: SportPromptConfig): string {
  let context = `
SPORT-SPECIFIC CONTEXT:
- Sport: ${config.sportName}
- Match term: ${config.matchTerm}
- Participant term: ${config.participantTerm}
- Scoring unit: ${config.scoringUnit}
- Has draw outcome: ${config.hasDraw ? 'Yes (analyze 1X2 market)' : 'No (analyze moneyline/h2h only)'}`;

  if (config.typicalProbabilityRanges) {
    context += `

TYPICAL PROBABILITY RANGES FOR ${config.sportName.toUpperCase()}:
- Heavy favorites: ${config.typicalProbabilityRanges.favorite.min}%-${config.typicalProbabilityRanges.favorite.max}%
- Underdogs: ${config.typicalProbabilityRanges.underdog.min}%-${config.typicalProbabilityRanges.underdog.max}%`;
    if (config.typicalProbabilityRanges.draw && config.hasDraw) {
      context += `
- Draws: ${config.typicalProbabilityRanges.draw.min}%-${config.typicalProbabilityRanges.draw.max}%`;
    }
  }

  if (config.keyAnalysisFactors && config.keyAnalysisFactors.length > 0) {
    context += `

KEY ANALYSIS FACTORS FOR ${config.sportName.toUpperCase()}:
${config.keyAnalysisFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
  }

  return context;
}

// ============================================
// PROBABILITY BOUNDS BY SPORT
// ============================================

export const SPORT_PROBABILITY_BOUNDS: Record<string, SportPromptConfig['typicalProbabilityRanges']> = {
  soccer: {
    favorite: { min: 45, max: 85 },
    underdog: { min: 5, max: 35 },
    draw: { min: 15, max: 35 },
  },
  basketball: {
    favorite: { min: 50, max: 92 },
    underdog: { min: 8, max: 50 },
  },
  tennis: {
    favorite: { min: 55, max: 95 },
    underdog: { min: 5, max: 45 },
  },
  mma: {
    favorite: { min: 50, max: 90 },
    underdog: { min: 10, max: 50 },
  },
  hockey: {
    favorite: { min: 40, max: 75 },
    underdog: { min: 15, max: 45 },
    draw: { min: 20, max: 30 },
  },
  baseball: {
    favorite: { min: 45, max: 75 },
    underdog: { min: 25, max: 55 },
  },
  football: { // American Football
    favorite: { min: 50, max: 90 },
    underdog: { min: 10, max: 50 },
  },
};

// ============================================
// KEY ANALYSIS FACTORS BY SPORT
// ============================================

export const SPORT_KEY_FACTORS: Record<string, string[]> = {
  soccer: [
    'Home advantage significance',
    'Recent form (last 5 matches)',
    'Head-to-head history',
    'Key player injuries/suspensions',
    'Motivation factors (league position, cup importance)',
    'Playing style matchup',
    'Defensive vs offensive metrics',
  ],
  basketball: [
    'Home court advantage',
    'Back-to-back game fatigue',
    'Pace and tempo matchup',
    'Three-point shooting efficiency',
    'Injury report impact',
    'Recent form streak',
    'Head-to-head record',
  ],
  tennis: [
    'Surface preference (hard/clay/grass)',
    'Head-to-head record',
    'Recent tournament performance',
    'Fatigue from previous rounds',
    'Serve vs return game strength',
    'Mental resilience in pressure situations',
  ],
  mma: [
    'Fighting style matchup',
    'Reach and height differentials',
    'Recent performance and finish rate',
    'Weight cut impacts',
    'Ground game vs striking preference',
    'Championship fight experience',
  ],
  hockey: [
    'Home ice advantage',
    'Goaltender form and stats',
    'Power play/penalty kill efficiency',
    'Back-to-back game schedule',
    'Special teams performance',
    'Recent scoring trends',
  ],
};

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION_RULES = {
  // Probabilities must sum to ~100% (allowing for some margin)
  probabilitySumTolerance: 2, // Updated: stricter ±2% tolerance
  
  // Maximum upset probability for heavy favorites
  maxUpsetForHeavyFavorite: 25,
  
  // Minimum upset probability for close matches
  minUpsetForCloseMatch: 15,
  
  // Value flag thresholds (difference between implied and estimated)
  // Updated to match internal reasoning framework
  valueFlagThresholds: {
    NONE: 1.5,   // <1.5% difference
    LOW: 3,      // 1.5-3% difference
    MEDIUM: 6,   // 3-6% difference
    HIGH: 6,     // >6% difference
  },
};

// ============================================
// RESPONSIBLE GAMBLING MESSAGES
// ============================================

export const RESPONSIBLE_GAMBLING_MESSAGES = {
  core: 'This analysis is for educational and informational purposes only. It does not constitute betting advice and no outcome is guaranteed.',
  
  highRisk: 'This match presents significant uncertainty. Exercise extra caution and never chase losses.',
  
  userStakeWarning: 'Consider whether this stake aligns with responsible bankroll management principles.',
  
  general: 'Always bet responsibly and only with money you can afford to lose. If you feel gambling is becoming a problem, seek help at BeGambleAware.org',
};

export default {
  AI_IDENTITY,
  PRIMARY_DIRECTIVES,
  ANALYSIS_TASKS,
  ACCURACY_ENHANCERS,
  VALIDATION_RULES,
  RESPONSIBLE_GAMBLING_MESSAGES,
  buildCoreSystemPrompt,
  buildSportContext,
  SPORT_PROBABILITY_BOUNDS,
  SPORT_KEY_FACTORS,
};
