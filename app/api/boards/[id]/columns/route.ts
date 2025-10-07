import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/boards/:id/columns - Get all columns for a board
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: boardId } = params;

    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(columns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch columns' },
      { status: 500 }
    );
  }
}

// POST /api/boards/:id/columns - Create a new column
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: boardId } = params;
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Column name is required' },
        { status: 400 }
      );
    }

    // TODO: Get user from session and check permissions
    const userId = 'temp-user-id';

    // Get the highest position to add new column at the end
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastColumn ? lastColumn.position + 1 : 0;

    const column = await prisma.column.create({
      data: {
        name,
        color: color || '#3B82F6',
        position: newPosition,
        boardId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'COLUMN_CREATED',
        content: `Created column "${name}"`,
        boardId,
        userId,
      },
    });

    return NextResponse.json(column, { status: 201 });
  } catch (error) {
    console.error('Error creating column:', error);
    return NextResponse.json(
      { error: 'Failed to create column' },
      { status: 500 }
    );
  }
}
