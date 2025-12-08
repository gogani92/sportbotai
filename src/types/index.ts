/**
 * Tipovi za BetSense AI aplikaciju
 * 
 * Centralizovani TypeScript tipovi koji se koriste kroz aplikaciju.
 */

// ============================================
// ANALYZER TIPOVI
// ============================================

/**
 * Input podaci za analizu meča
 */
export interface AnalyzeRequest {
  sport: string;
  league: string;
  teamA: string;
  teamB: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  userPrediction: string;
  stake: number;
}

/**
 * Nivo rizika
 */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Odgovor od /api/analyze endpoint-a
 */
export interface AnalyzeResponse {
  probabilities: {
    homeWin: number | null;
    draw: number | null;
    awayWin: number | null;
    over: number | null;
    under: number | null;
  };
  valueComment: string;
  riskLevel: RiskLevel;
  analysisSummary: string;
  responsibleGamblingNote: string;
}

// ============================================
// STRIPE TIPOVI
// ============================================

/**
 * Request za kreiranje Stripe checkout sesije
 */
export interface CreateCheckoutSessionRequest {
  priceId: string;
  planName: string;
}

/**
 * Response od Stripe checkout sesije
 */
export interface CreateCheckoutSessionResponse {
  url: string;
}

// ============================================
// PRICING TIPOVI
// ============================================

/**
 * Pricing plan
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  priceId: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}
