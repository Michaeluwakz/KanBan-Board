import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/boards/:id/columns/:columnId - Update a column
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; columnId: string } }
) {
  try {
    const { id: boardId, columnId } = params;
    const body = await request.json();
    const { name, color, position } = body;

    // TODO: Get user from session and check permissions
    const userId = 'temp-user-id';

    const column = await prisma.column.update({
      where: { 
        id: columnId,
        boardId, // Ensure column belongs to this board
      },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(position !== undefined && { position }),
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
        type: 'COLUMN_UPDATED',
        content: `Updated column "${column.name}"`,
        boardId,
        userId,
      },
    });

    return NextResponse.json(column);
  } catch (error) {
    console.error('Error updating column:', error);
    return NextResponse.json(
      { error: 'Failed to update column' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/:id/columns/:columnId - Delete a column
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; columnId: string } }
) {
  try {
    const { id: boardId, columnId } = params;

    // TODO: Get user from session and check permissions
    const userId = 'temp-user-id';

    // Get column info before deletion for activity log
    const column = await prisma.column.findUnique({
      where: { 
        id: columnId,
        boardId,
      },
    });

    if (!column) {
      return NextResponse.json(
        { error: 'Column not found' },
        { status: 404 }
      );
    }

    // Check if this is the last column
    const columnCount = await prisma.column.count({
      where: { boardId },
    });

    if (columnCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last column' },
        { status: 400 }
      );
    }

    // Get the first available column to move tasks to
    const firstColumn = await prisma.column.findFirst({
      where: { 
        boardId,
        id: { not: columnId },
      },
      orderBy: { position: 'asc' },
    });

    if (firstColumn) {
      // Move all tasks from deleted column to first column
      await prisma.task.updateMany({
        where: { columnId },
        data: { columnId: firstColumn.id },
      });
    }

    // Delete the column
    await prisma.column.delete({
      where: { id: columnId },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'COLUMN_DELETED',
        content: `Deleted column "${column.name}"`,
        boardId,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting column:', error);
    return NextResponse.json(
      { error: 'Failed to delete column' },
      { status: 500 }
    );
  }
}
