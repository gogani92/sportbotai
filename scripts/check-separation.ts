/**
 * Check if winner prediction differs from value bet side
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSeparation() {
  const preds = await prisma.prediction.findMany({
    where: { valueBetSide: { not: null } },
    select: {
      matchName: true,
      prediction: true,
      valueBetSide: true,
      valueBetEdge: true,
      outcome: true,
      valueBetOutcome: true,
    },
  });
  
  console.log('=== CHECKING WINNER vs VALUE BET SEPARATION ===\n');
  
  let same = 0;
  let diff = 0;
  const diffList: string[] = [];
  
  preds.forEach(p => {
    const predLower = p.prediction?.toLowerCase() || '';
    const [homeTeam, awayTeam] = p.matchName.split(' vs ').map(t => t.trim());
    const homeKeyword = homeTeam.split(' ').pop()?.toLowerCase() || '';
    const awayKeyword = awayTeam.split(' ').pop()?.toLowerCase() || '';
    
    let predictedSide = 'UNKNOWN';
    if (predLower.includes('home win') || predLower.includes(homeKeyword)) {
      predictedSide = 'HOME';
    } else if (predLower.includes('away win') || predLower.includes(awayKeyword)) {
      predictedSide = 'AWAY';
    } else if (predLower.includes('draw')) {
      predictedSide = 'DRAW';
    }
    
    const isSame = predictedSide === p.valueBetSide;
    if (isSame) {
      same++;
    } else {
      diff++;
      diffList.push(`${p.matchName}: Winner=${predictedSide} (${p.prediction}), Value=${p.valueBetSide}`);
    }
  });
  
  console.log(`Total predictions with value bets: ${preds.length}`);
  console.log(`Same (winner = value bet): ${same} (${((same/preds.length)*100).toFixed(1)}%)`);
  console.log(`Different (winner ≠ value bet): ${diff} (${((diff/preds.length)*100).toFixed(1)}%)`);
  
  if (diffList.length > 0) {
    console.log('\n=== EXAMPLES WHERE WINNER ≠ VALUE BET ===\n');
    diffList.slice(0, 10).forEach(d => console.log(`  ${d}`));
  }
  
  // Check if outcomes differ when sides differ
  const predsWithBothOutcomes = preds.filter(p => 
    p.outcome && p.outcome !== 'PENDING' && 
    p.valueBetOutcome && p.valueBetOutcome !== 'PENDING'
  );
  
  let outcomesDiffer = 0;
  predsWithBothOutcomes.forEach(p => {
    if (p.outcome !== p.valueBetOutcome) {
      outcomesDiffer++;
    }
  });
  
  console.log(`\n=== OUTCOME DIFFERENCES ===`);
  console.log(`Predictions with both outcomes resolved: ${predsWithBothOutcomes.length}`);
  console.log(`Cases where winner outcome ≠ value bet outcome: ${outcomesDiffer}`);
  
  if (outcomesDiffer > 0) {
    console.log('\nExamples:');
    predsWithBothOutcomes.filter(p => p.outcome !== p.valueBetOutcome).slice(0, 5).forEach(p => {
      console.log(`  ${p.matchName}: Winner=${p.outcome}, ValueBet=${p.valueBetOutcome}`);
    });
  }
  
  await prisma.$disconnect();
}

checkSeparation().catch(console.error);
