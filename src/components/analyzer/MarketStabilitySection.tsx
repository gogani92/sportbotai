/**
 * Market Stability Section Component
 * 
 * Displays analysis.marketStability with sub-cards for each market type,
 * confidence stars, and safest market recommendation.
 */

'use client';

import { MarketStability, MarketStabilityItem, RiskLevel, MarketType, MarketConfidence } from '@/types';

interface MarketStabilitySectionProps {
  marketStability: MarketStability;
}

const stabilityConfig: Record<RiskLevel, { label: string; color: string; bgColor: string; borderColor: string }> = {
  LOW: { label: 'Low', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  MEDIUM: { label: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  HIGH: { label: 'High', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
};

const marketTypeLabels: Record<string, { name: string; icon: string }> = {
  main_1x2: { name: '1X2 (Match Result)', icon: '⚽' },
  over_under: { name: 'Over/Under', icon: '🎯' },
  btts: { name: 'Both Teams To Score', icon: '🥅' },
};

const safestMarketLabels: Record<MarketType, string> = {
  '1X2': 'Match Result (1X2)',
  'OVER_UNDER': 'Over/Under Goals',
  'BTTS': 'Both Teams To Score',
  'NONE': 'No Clear Safest Market',
};

interface ConfidenceStarsProps {
  confidence: MarketConfidence;
}

function ConfidenceStars({ confidence }: ConfidenceStarsProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= confidence ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface MarketCardProps {
  marketKey: string;
  market: MarketStabilityItem;
}

function MarketCard({ marketKey, market }: MarketCardProps) {
  const config = stabilityConfig[market.stability];
  const marketInfo = marketTypeLabels[marketKey] || { name: marketKey, icon: '📊' };

  return (
    <div className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{marketInfo.icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{marketInfo.name}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${config.color} bg-white/70`}>
          {config.label}
        </span>
      </div>
      
      <div className="mb-2">
        <p className="text-xs text-gray-500 mb-1">Confidence</p>
        <ConfidenceStars confidence={market.confidence} />
      </div>
      
      <p className="text-xs text-gray-600 leading-relaxed">{market.comment}</p>
    </div>
  );
}

export default function MarketStabilitySection({ marketStability }: MarketStabilitySectionProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Market Stability
      </h3>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MarketCard marketKey="main_1x2" market={marketStability.markets.main_1x2} />
        <MarketCard marketKey="over_under" market={marketStability.markets.over_under} />
        <MarketCard marketKey="btts" market={marketStability.markets.btts} />
      </div>

      {/* Safest Market Recommendation */}
      <div className="border-t border-gray-200 pt-4">
        <div className={`p-4 rounded-lg ${
          marketStability.safestMarketType !== 'NONE' 
            ? 'bg-emerald-50 border border-emerald-200' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              marketStability.safestMarketType !== 'NONE' 
                ? 'bg-emerald-100' 
                : 'bg-gray-200'
            }`}>
              <svg 
                className={`w-5 h-5 ${
                  marketStability.safestMarketType !== 'NONE' 
                    ? 'text-emerald-600' 
                    : 'text-gray-500'
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className={`font-semibold ${
                marketStability.safestMarketType !== 'NONE' 
                  ? 'text-emerald-800' 
                  : 'text-gray-600'
              }`}>
                Safest Market: {safestMarketLabels[marketStability.safestMarketType]}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {marketStability.safestMarketExplanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
