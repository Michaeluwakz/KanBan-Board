import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/boards/:id/tasks - Get all tasks for a board
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tasks = await prisma.task.findMany({
      where: {
        boardId: id,
        isArchived: false,
      },
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
        comments: {
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
          orderBy: {
            createdAt: 'asc',
          },
        },
        attachments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        checklistItems: {
          orderBy: {
            position: 'asc',
          },
        },
        activities: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
        dependencies: {
          include: {
            blockingTask: {
              include: {
                column: true,
              },
            },
          },
        },
        dependents: {
          include: {
            dependentTask: {
              include: {
                column: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          columnId: 'asc',
        },
        {
          position: 'asc',
        },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/boards/:id/tasks - Create a new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: boardId } = await params;
    const body = await request.json();
    
    const {
      title,
      description,
      columnId,
      position,
      priority,
      dueDate,
      startDate,
      timeEstimate,
      assigneeIds,
      labelIds,
    } = body;

    if (!title || !columnId) {
      return NextResponse.json(
        { error: 'Title and column are required' },
        { status: 400 }
      );
    }

    // TODO: Get user from session
    const userId = 'temp-user-id';

    // Create task with relations
    const task = await prisma.task.create({
      data: {
        title,
        description,
        boardId,
        columnId,
        position: position ?? 0,
        priority: priority ?? 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        timeEstimate,
        assignees: assigneeIds
          ? {
              create: assigneeIds.map((id: string) => ({
                userId: id,
              })),
            }
          : undefined,
        labels: labelIds
          ? {
              create: labelIds.map((id: string) => ({
                labelId: id,
              })),
            }
          : undefined,
      },
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
        comments: true,
        attachments: true,
        checklistItems: true,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'TASK_CREATED',
        content: `Created task "${title}"`,
        boardId,
        taskId: task.id,
        userId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

