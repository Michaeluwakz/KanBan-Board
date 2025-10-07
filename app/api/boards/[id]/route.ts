import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/boards/:id - Get board details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const board = await prisma.board.findUnique({
      where: { id },
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
        labels: true,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // TODO: Check if user has access to this board

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

// PUT /api/boards/:id - Update board
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, background, isArchived } = body;

    // TODO: Get user from session and check permissions
    const userId = 'temp-user-id';

    const board = await prisma.board.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(background !== undefined && { background }),
        ...(isArchived !== undefined && { isArchived: isArchived ? 1 : 0 }),
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
        type: 'BOARD_UPDATED',
        content: `Updated board "${board.name}"`,
        boardId: board.id,
        userId,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/:id - Delete board
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Get user from session and check if user is owner

    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    );
  }
}

