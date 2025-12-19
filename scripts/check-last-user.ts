import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      email: true,
      name: true,
      referralSource: true,
      referralMedium: true,
      referralCampaign: true,
      createdAt: true,
    },
  });

  console.log('\n=== Last 5 Registered Users ===\n');
  
  users.forEach((user, i) => {
    console.log(`${i + 1}. ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Source: ${user.referralSource || 'direct'}`);
    console.log(`   Medium: ${user.referralMedium || 'N/A'}`);
    console.log(`   Campaign: ${user.referralCampaign || 'N/A'}`);
    console.log('');
  });

  await prisma.$disconnect();
}

main();
