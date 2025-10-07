import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if temp user exists
  let tempUser = await prisma.user.findUnique({
    where: { id: 'temp-user-id' },
  });

  if (!tempUser) {
    tempUser = await prisma.user.create({
      data: {
        id: 'temp-user-id',
        email: 'temp@kanban.local',
        name: 'Demo User',
      },
    });
    console.log('✅ Temp user created:', tempUser);
  } else {
    console.log('✅ Temp user already exists:', tempUser);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

