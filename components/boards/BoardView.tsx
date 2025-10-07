'use client';

import React, { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { Board, Task } from '@/types';
import { useBoardStore } from '@/store/board-store';
import KanbanDndProvider from '@/components/dnd/DndProvider';
import Column from '@/components/columns/Column';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';
import Button from '@/components/ui/Button';
import { TaskFormData } from '@/components/tasks/TaskForm';

export interface BoardViewProps {
  board: Board;
  onUpdateBoard?: (boardId: string, updates: Partial<Board>) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ board, onUpdateBoard }) => {
  const {
    columns,
    tasks,
    selectedTasks,
    moveTask,
    toggleTaskSelection,
    clearSelection,
    addTask,
    updateTask,
    deleteTask,
  } = useBoardStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter columns and tasks for current board
  const boardColumns = columns.filter((col) => col.boardId === board.id);
  const boardTasks = Array.from(tasks.values()).filter((task) => task.boardId === board.id);

  const getTasksByColumn = useCallback((columnId: string) =>
    boardTasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.position - b.position), [boardTasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.get(event.active.id as string);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.get(activeId);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    // Check if we're dragging over a column or a task
    const overColumn = columns.find((col) => col.id === overId);
    const overTask = tasks.get(overId);

    let destinationColumnId: string;
    let destinationPosition: number;

    if (overColumn) {
      // Dropped on a column
      destinationColumnId = overColumn.id;
      const tasksInColumn = getTasksByColumn(destinationColumnId);
      destinationPosition = tasksInColumn.length;
    } else if (overTask) {
      // Dropped on a task
      destinationColumnId = overTask.columnId;
      destinationPosition = overTask.position;
    } else {
      setActiveTask(null);
      return;
    }

    // Move the task
    moveTask(activeId, destinationColumnId, destinationPosition);
    setActiveTask(null);

    // Clear selection if we moved a selected task
    if (selectedTasks.has(activeId)) {
      clearSelection();
    }

    // TODO: Emit socket event for real-time update
  }, [tasks, columns, selectedTasks, moveTask, clearSelection, getTasksByColumn]);

  const handleAddTask = async (columnId: string, data: TaskFormData) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    const tasksInColumn = getTasksByColumn(columnId);
    const position = tasksInColumn.length;

    const newTask: Task = {
      id: Math.random().toString(36).substring(7), // Temporary ID
      title: data.title,
      description: data.description || null,
      position,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      startDate: null,
      timeEstimate: data.timeEstimate || null,
      timeSpent: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      boardId: board.id,
      columnId,
    };

    addTask(newTask);

    // TODO: Make API call to create task and update with real ID
    // TODO: Emit socket event for real-time update
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskSelect = (taskId: string, isMulti: boolean) => {
    if (isMulti) {
      toggleTaskSelection(taskId);
    } else {
      clearSelection();
      toggleTaskSelection(taskId);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
    // TODO: Make API call to update task
    // TODO: Emit socket event for real-time update
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    // TODO: Make API call to delete task
    // TODO: Emit socket event for real-time update
  };

  const handleAddColumn = async () => {
    const columnName = prompt('Enter column name:');
    if (!columnName?.trim()) return;

    const columnColors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'
    ];
    const randomColor = columnColors[Math.floor(Math.random() * columnColors.length)];

    try {
      const response = await fetch(`/api/boards/${board.id}/columns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: columnName.trim(), 
          color: randomColor 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create column');
      }

      const newColumn = await response.json();
      
      // Update the board state with the new column
      if (onUpdateBoard) {
        const updatedColumns = [...(board.columns || []), newColumn];
        onUpdateBoard(board.id, { columns: updatedColumns });
      }

      console.log('Column created:', newColumn);
    } catch (error) {
      console.error('Error creating column:', error);
      alert('Failed to create column. Please try again.');
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <KanbanDndProvider
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        overlay={
          activeTask ? (
            <TaskCard task={activeTask} isDragging />
          ) : null
        }
      >
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 p-6 h-full">
            {boardColumns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getTasksByColumn(column.id)}
                onAddTask={handleAddTask}
                onTaskClick={handleTaskClick}
                onTaskSelect={handleTaskSelect}
                selectedTasks={selectedTasks}
              />
            ))}

            {/* Add Column Button */}
            <div className="flex items-start">
              <Button
                variant="outline"
                className="min-w-[280px] h-12 glass hover:shadow-lg transition-all"
                onClick={handleAddColumn}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        </div>
      </KanbanDndProvider>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default BoardView;

