import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BoardRole } from '@prisma/client';

// GET /api/boards - List all boards for the current user
export async function GET() {
  try {
    // TODO: Get user from session
    const userId = 'temp-user-id'; // Replace with actual user from session

    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { creatorId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}

// POST /api/boards - Create a new board
export async function POST(request: NextRequest) {
  try {
    // TODO: Get user from session
    const userId = 'temp-user-id'; // Replace with actual user from session

    const body = await request.json();
    const { name, description, background } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Board name is required' },
        { status: 400 }
      );
    }

    // Create board with default columns
    const board = await prisma.board.create({
      data: {
        name,
        description,
        background,
        creatorId: userId,
        members: {
          create: {
            userId,
            role: BoardRole.OWNER,
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
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'BOARD_CREATED',
        content: `Created board "${name}"`,
        boardId: board.id,
        userId,
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}


