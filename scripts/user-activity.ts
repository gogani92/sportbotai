import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: {
      email: true,
      createdAt: true,
      analysisCount: true,
      referralSource: true,
      plan: true,
    }
  });
  
  console.log('\n📊 User Activity Report\n');
  console.log('='.repeat(85));
  console.log('Email'.padEnd(32) + '| Source'.padEnd(15) + '| Plan'.padEnd(10) + '| Analyses | Signup');
  console.log('-'.repeat(85));
  
  let totalAnalyses = 0;
  let activeUsers = 0;
  
  for (const u of users) {
    const email = (u.email || 'N/A').substring(0, 30);
    const source = (u.referralSource || 'direct').substring(0, 12);
    const plan = (u.plan || 'FREE').substring(0, 8);
    const analyses = u.analysisCount || 0;
    const date = u.createdAt?.toISOString().split('T')[0] || '';
    
    totalAnalyses += analyses;
    if (analyses > 0) activeUsers++;
    
    const activity = analyses > 0 ? '✅' : '❌';
    console.log(
      email.padEnd(32) + '| ' + 
      source.padEnd(13) + '| ' + 
      plan.padEnd(8) + '| ' + 
      String(analyses).padEnd(9) + '| ' + 
      date + ' ' + activity
    );
  }
  
  console.log('='.repeat(85));
  console.log('\n📈 Summary:');
  console.log(`   Active users (ran analyses): ${activeUsers}/${users.length} (${Math.round(activeUsers/users.length*100)}%)`);
  console.log(`   Total analyses: ${totalAnalyses}`);
  console.log(`   Avg analyses per active user: ${activeUsers > 0 ? (totalAnalyses/activeUsers).toFixed(1) : 0}`);
  
  // Check ChatGPT users specifically
  const chatgptUsers = users.filter(u => u.referralSource === 'chatgpt.com');
  if (chatgptUsers.length > 0) {
    console.log('\n🤖 ChatGPT Users:');
    for (const u of chatgptUsers) {
      const analyses = u.analysisCount || 0;
      console.log(`   ${u.email}: ${analyses} analyses`);
    }
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
