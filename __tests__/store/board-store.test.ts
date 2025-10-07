import { renderHook, act } from '@testing-library/react';
import { useBoardStore } from '@/store/board-store';
import { Board, Column, Task, Priority } from '@/types';

describe('Board Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBoardStore());
    act(() => {
      result.current.reset();
    });
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useBoardStore());
    
    expect(result.current.boards).toEqual([]);
    expect(result.current.currentBoard).toBeNull();
    expect(result.current.columns).toEqual([]);
    expect(result.current.tasks.size).toBe(0);
  });

  it('adds a board', () => {
    const { result } = renderHook(() => useBoardStore());
    
    const newBoard: Board = {
      id: 'board-1',
      name: 'Test Board',
      description: null,
      background: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: 'user-1',
    };

    act(() => {
      result.current.addBoard(newBoard);
    });

    expect(result.current.boards).toHaveLength(1);
    expect(result.current.boards[0].name).toBe('Test Board');
  });

  it('updates a task', () => {
    const { result } = renderHook(() => useBoardStore());
    
    const task: Task = {
      id: 'task-1',
      title: 'Test Task',
      description: null,
      position: 0,
      priority: Priority.MEDIUM,
      dueDate: null,
      startDate: null,
      timeEstimate: null,
      timeSpent: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      boardId: 'board-1',
      columnId: 'col-1',
    };

    act(() => {
      result.current.addTask(task);
    });

    act(() => {
      result.current.updateTask('task-1', { title: 'Updated Task' });
    });

    const updatedTask = result.current.tasks.get('task-1');
    expect(updatedTask?.title).toBe('Updated Task');
  });

  it('moves a task between columns', () => {
    const { result } = renderHook(() => useBoardStore());
    
    const task: Task = {
      id: 'task-1',
      title: 'Test Task',
      description: null,
      position: 0,
      priority: Priority.MEDIUM,
      dueDate: null,
      startDate: null,
      timeEstimate: null,
      timeSpent: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      boardId: 'board-1',
      columnId: 'col-1',
    };

    act(() => {
      result.current.addTask(task);
    });

    act(() => {
      result.current.moveTask('task-1', 'col-2', 0);
    });

    const movedTask = result.current.tasks.get('task-1');
    expect(movedTask?.columnId).toBe('col-2');
  });

  it('toggles task selection', () => {
    const { result } = renderHook(() => useBoardStore());
    
    act(() => {
      result.current.toggleTaskSelection('task-1');
    });

    expect(result.current.selectedTasks.has('task-1')).toBe(true);

    act(() => {
      result.current.toggleTaskSelection('task-1');
    });

    expect(result.current.selectedTasks.has('task-1')).toBe(false);
  });
});


