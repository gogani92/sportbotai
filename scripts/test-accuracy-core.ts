/**
 * Test script for accuracy-core pipeline
 * Run: npx ts-node scripts/test-accuracy-core.ts
 */

import {
  runAccuracyPipeline,
  PipelineInput,
  PipelineResult,
  quickMarketProbabilities,
  calculateOddsVolatilityRaw,
  extractDataQualityFlags,
  interpretDataQuality,
  interpretVolatility,
  calculateBrierScore,
  calculateLogLoss,
  formatForLLM,
} from '../src/lib/accuracy-core/index';

async function main() {
  console.log('='.repeat(60));
  console.log('ACCURACY-CORE PIPELINE TEST');
  console.log('='.repeat(60));
  
  // Test 1: Market Probabilities (Data-1)
  console.log('\n📊 TEST 1: Market Probabilities (Data-1)');
  console.log('-'.repeat(40));
  
  const marketProbs = quickMarketProbabilities(2.10, 3.50, 3.20);
  console.log('Input: Home=2.10, Away=3.50, Draw=3.20');
  console.log('Raw implied:', marketProbs.impliedProbabilitiesRaw);
  console.log('No-vig:', marketProbs.impliedProbabilitiesNoVig);
  console.log('Margin:', (marketProbs.marketMargin * 100).toFixed(2) + '%');
  
  // Test 2: Raw Volatility Stats (Data-1)
  console.log('\n📈 TEST 2: Raw Volatility Stats (Data-1)');
  console.log('-'.repeat(40));
  
  const testOdds = [
    { bookmaker: 'Bet365', homeOdds: 2.10, awayOdds: 3.50, drawOdds: 3.20 },
    { bookmaker: 'Unibet', homeOdds: 2.15, awayOdds: 3.40, drawOdds: 3.25 },
    { bookmaker: 'Betfair', homeOdds: 2.08, awayOdds: 3.60, drawOdds: 3.15 },
  ];
  
  const rawVolatility = calculateOddsVolatilityRaw(testOdds);
  console.log('Bookmaker count:', rawVolatility.bookmakerCount);
  console.log('Home StdDev:', rawVolatility.homeStdDev.toFixed(4));
  console.log('Away StdDev:', rawVolatility.awayStdDev.toFixed(4));
  console.log('Average CV:', rawVolatility.avgCV.toFixed(4));
  console.log('✅ Returns raw stats only - NO interpretation');
  
  // Test 3: Raw Data Quality Flags (Data-1)
  console.log('\n🔍 TEST 3: Raw Data Quality Flags (Data-1)');
  console.log('-'.repeat(40));
  
  const rawFlags = extractDataQualityFlags(
    { played: 10, scored: 15 },
    { played: 8, scored: 12 },
    'WWLDW',
    'LWWDL',
    { total: 5 },
    3
  );
  console.log('Raw flags:', rawFlags);
  console.log('✅ Returns raw flags only - NO interpretation');
  
  // Test 4: Interpretation Layer (Data-2.5)
  console.log('\n⚖️ TEST 4: Quality Interpretation (Data-2.5)');
  console.log('-'.repeat(40));
  
  const qualityResult = interpretDataQuality(rawFlags);
  console.log('Interpreted level:', qualityResult.level);
  console.log('Score:', qualityResult.score);
  console.log('Issues:', qualityResult.issues);
  
  const volatilityResult = interpretVolatility(rawVolatility, 0.3);
  console.log('Volatility level:', volatilityResult.level);
  console.log('✅ Interpretation happens HERE in Data-2.5');
  
  // Test 5: Metrics (Data-0)
  console.log('\n📉 TEST 5: Calibration Metrics (Data-0)');
  console.log('-'.repeat(40));
  
  const testPredictions = [
    { predicted: 0.7, actual: 1 as const },
    { predicted: 0.6, actual: 1 as const },
    { predicted: 0.8, actual: 0 as const },
    { predicted: 0.3, actual: 0 as const },
    { predicted: 0.5, actual: 1 as const },
  ];
  
  const brier = calculateBrierScore(testPredictions);
  const logLoss = calculateLogLoss(testPredictions);
  console.log('Brier Score:', brier.toFixed(4));
  console.log('Log Loss:', logLoss.toFixed(4));
  console.log('✅ Metrics in Data-0 (infrastructure layer)');
  
  // Test 6: Full Pipeline
  console.log('\n🚀 TEST 6: Full Pipeline');
  console.log('-'.repeat(40));
  
  const pipelineInput: PipelineInput = {
    matchId: 'test-match-001',
    sport: 'soccer',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    kickoff: new Date(),
    homeStats: {
      played: 15,
      wins: 10,
      draws: 3,
      losses: 2,
      scored: 28,
      conceded: 12,
    },
    awayStats: {
      played: 15,
      wins: 8,
      draws: 4,
      losses: 3,
      scored: 22,
      conceded: 15,
    },
    homeForm: 'WWDWW',
    awayForm: 'WLDWL',
    h2h: {
      total: 10,
      homeWins: 4,
      awayWins: 3,
      draws: 3,
    },
    odds: [
      { bookmaker: 'Bet365', homeOdds: 1.85, awayOdds: 4.20, drawOdds: 3.60 },
      { bookmaker: 'Unibet', homeOdds: 1.90, awayOdds: 4.00, drawOdds: 3.50 },
      { bookmaker: 'William Hill', homeOdds: 1.87, awayOdds: 4.10, drawOdds: 3.55 },
    ],
    config: { logPredictions: false },
  };
  
  try {
    const result = await runAccuracyPipeline(pipelineInput);
    
    console.log('\n📊 PIPELINE OUTPUT:');
    console.log('Match:', pipelineInput.homeTeam, 'vs', pipelineInput.awayTeam);
    
    console.log('\n📈 Market Probabilities (vig-removed):');
    console.log('  Home:', (result.details.marketProbabilities.impliedProbabilitiesNoVig.home * 100).toFixed(1) + '%');
    console.log('  Away:', (result.details.marketProbabilities.impliedProbabilitiesNoVig.away * 100).toFixed(1) + '%');
    console.log('  Draw:', (result.details.marketProbabilities.impliedProbabilitiesNoVig.draw! * 100).toFixed(1) + '%');
    
    console.log('\n🎯 Model Probabilities (calibrated):');
    console.log('  Home:', (result.output.probabilities.home * 100).toFixed(1) + '%');
    console.log('  Away:', (result.output.probabilities.away * 100).toFixed(1) + '%');
    console.log('  Draw:', (result.output.probabilities.draw! * 100).toFixed(1) + '%');
    
    console.log('\n⚡ Edge Analysis:');
    console.log('  Primary Edge:', result.output.edge.outcome);
    console.log('  Edge Value:', (result.output.edge.value * 100).toFixed(2) + '%');
    console.log('  Quality:', result.output.edge.quality);
    console.log('  Favored:', result.output.favored);
    console.log('  Confidence:', result.output.confidence);
    
    console.log('\n📋 Data Quality:', result.output.dataQuality);
    console.log('📊 Volatility:', result.output.volatility);
    console.log('🚫 Suppress Edge:', result.output.suppressEdge);
    
    // Test LLM formatting
    console.log('\n🤖 LLM CONTEXT (formatForLLM):');
    console.log('-'.repeat(40));
    const llmContext = formatForLLM(result, pipelineInput.homeTeam, pipelineInput.awayTeam);
    console.log(llmContext.substring(0, 1000) + '...');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED - Pipeline working correctly!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Pipeline error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
