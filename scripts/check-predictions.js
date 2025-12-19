const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const predictions = await prisma.prediction.findMany({
    where: { outcome: 'PENDING' },
    orderBy: { kickoff: 'desc' }
  });
  
  console.log('Pending predictions (' + predictions.length + '):');
  console.log('');
  
  const now = new Date();
  
  for (const p of predictions) {
    const isPast = new Date(p.kickoff) < now;
    const status = isPast ? '⏰ FINISHED' : '📅 UPCOMING';
    
    console.log(status + ' ' + p.matchName);
    console.log('  Sport: ' + p.sport);
    console.log('  League: ' + p.league);
    console.log('  Kickoff: ' + p.kickoff.toISOString());
    console.log('  Prediction: ' + p.prediction);
    console.log('  Conviction: ' + p.conviction);
    console.log('');
  }
  
  // Summary
  const pastPending = predictions.filter(p => new Date(p.kickoff) < now).length;
  console.log('---');
  console.log('Total pending: ' + predictions.length);
  console.log('Matches finished (need result check): ' + pastPending);
  console.log('Upcoming matches: ' + (predictions.length - pastPending));
}

main().catch(console.error).finally(() => prisma.$disconnect());
