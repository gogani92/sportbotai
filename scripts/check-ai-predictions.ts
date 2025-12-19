import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking AI Predictions...\n');
  
  // Total count
  const total = await prisma.prediction.count();
  console.log('Total predictions:', total);
  
  if (total === 0) {
    console.log('\n❌ No predictions found!');
    console.log('The pre-analyze cron may not have created Prediction records.');
    return;
  }
  
  // By outcome
  const byOutcome = await prisma.prediction.groupBy({
    by: ['outcome'],
    _count: true,
  });
  console.log('\nBy outcome:');
  byOutcome.forEach(o => {
    console.log(`  ${o.outcome}: ${o._count}`);
  });
  
  // By sport
  const bySport = await prisma.prediction.groupBy({
    by: ['sport'],
    _count: true,
  });
  console.log('\nBy sport:');
  bySport.forEach(s => {
    console.log(`  ${s.sport}: ${s._count}`);
  });
  
  // Recent predictions
  const recent = await prisma.prediction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      matchName: true,
      prediction: true,
      conviction: true,
      outcome: true,
      createdAt: true,
    },
  });
  console.log('\nRecent 5 predictions:');
  recent.forEach(p => {
    console.log(`  ${p.matchName}: ${p.prediction} (${p.conviction}%) - ${p.outcome}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
