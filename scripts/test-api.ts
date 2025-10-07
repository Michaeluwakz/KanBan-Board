import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBoardCreation() {
  console.log('🧪 Testing board creation...\n');

  try {
    // Test 1: Check if user exists
    console.log('1️⃣ Checking if temp user exists...');
    const user = await prisma.user.findUnique({
      where: { id: 'temp-user-id' },
    });
    console.log('✅ User found:', user?.email);

    // Test 2: Try to create a board
    console.log('\n2️⃣ Creating test board...');
    const board = await prisma.board.create({
      data: {
        name: 'Test Board',
        description: 'Test description',
        creatorId: 'temp-user-id',
        members: {
          create: {
            userId: 'temp-user-id',
            role: 'OWNER',
          },
        },
        columns: {
          create: [
            { name: 'To Do', position: 0, color: '#60a5fa' },
            { name: 'In Progress', position: 1, color: '#fbbf24' },
            { name: 'Done', position: 2, color: '#34d399' },
          ],
        },
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        columns: true,
      },
    });

    console.log('✅ Board created successfully:', board.name);
    console.log('   - ID:', board.id);
    console.log('   - Columns:', board.columns.length);
    console.log('   - Members:', board.members.length);

    // Test 3: Fetch all boards
    console.log('\n3️⃣ Fetching all boards...');
    const allBoards = await prisma.board.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        columns: true,
      },
    });
    console.log(`✅ Found ${allBoards.length} board(s)`);
    allBoards.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.name} (${b.columns.length} columns, ${b._count.tasks} tasks)`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testBoardCreation()
  .finally(async () => {
    await prisma.$disconnect();
  });

