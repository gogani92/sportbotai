import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      email: true,
      name: true,
      referralSource: true,
      referralMedium: true,
      referralCampaign: true,
      analysisCount: true,
      lastAnalysisDate: true,
      createdAt: true,
      _count: {
        select: {
          analyses: true,
          favoriteTeams: true,
        }
      }
    },
  });

  console.log('\n=== Last 10 Registered Users - Activity Check ===\n');
  
  users.forEach((user, i) => {
    const isActive = user.analysisCount > 0 || user._count.analyses > 0 || user._count.favoriteTeams > 0;
    const status = isActive ? '✅ ACTIVE' : '⚠️ NO ACTIVITY';
    
    console.log(`${i + 1}. ${user.email} ${status}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Registered: ${user.createdAt.toISOString().split('T')[0]} ${user.createdAt.toTimeString().split(' ')[0]}`);
    console.log(`   Analyses: ${user.analysisCount} (counter) / ${user._count.analyses} (records)`);
    console.log(`   Favorite Teams: ${user._count.favoriteTeams}`);
    console.log(`   Last Analysis: ${user.lastAnalysisDate ? user.lastAnalysisDate.toISOString() : 'Never'}`);
    console.log(`   Source: ${user.referralSource || 'direct'}`);
    console.log('');
  });

  // Summary
  const activeCount = users.filter(u => u.analysisCount > 0 || u._count.analyses > 0).length;
  console.log(`\n📊 Summary: ${activeCount}/${users.length} users have analyzed matches`);

  await prisma.$disconnect();
}

main();
