import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tasks/:id/move - Move task to different column/position
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { destinationColumnId, destinationPosition } = body;

    if (!destinationColumnId || destinationPosition === undefined) {
      return NextResponse.json(
        { error: 'Destination column and position are required' },
        { status: 400 }
      );
    }

    // TODO: Get user from session
    const userId = 'temp-user-id';

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        columnId: true,
        position: true,
        boardId: true,
        title: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const sourceColumnId = task.columnId;
    const sourcePosition = task.position;

    // Use a transaction to update positions atomically
    await prisma.$transaction(async (tx) => {
      if (sourceColumnId === destinationColumnId) {
        // Moving within the same column
        if (sourcePosition < destinationPosition) {
          // Moving down - decrease position of tasks in between
          await tx.task.updateMany({
            where: {
              columnId: sourceColumnId,
              position: {
                gt: sourcePosition,
                lte: destinationPosition,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        } else if (sourcePosition > destinationPosition) {
          // Moving up - increase position of tasks in between
          await tx.task.updateMany({
            where: {
              columnId: sourceColumnId,
              position: {
                gte: destinationPosition,
                lt: sourcePosition,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        }
      } else {
        // Moving to a different column
        // Decrease position of tasks after source position in source column
        await tx.task.updateMany({
          where: {
            columnId: sourceColumnId,
            position: {
              gt: sourcePosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        // Increase position of tasks at or after destination position in destination column
        await tx.task.updateMany({
          where: {
            columnId: destinationColumnId,
            position: {
              gte: destinationPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      // Update the moved task
      await tx.task.update({
        where: { id },
        data: {
          columnId: destinationColumnId,
          position: destinationPosition,
        },
      });
    });

    // Get the updated task with all relations
    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: {
        column: true,
        assignees: {
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
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'TASK_MOVED',
        content: `Moved task "${task.title}" to ${updatedTask?.column.name}`,
        boardId: task.boardId,
        taskId: id,
        userId,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json(
      { error: 'Failed to move task' },
      { status: 500 }
    );
  }
}


