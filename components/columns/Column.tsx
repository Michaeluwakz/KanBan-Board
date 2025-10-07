'use client';

import React, { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, EyeOff } from 'lucide-react';
import { Column as ColumnType, Task } from '@/types';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import ContextMenu, { ContextMenuItem } from '@/components/ui/ContextMenu';
import DroppableColumn from '@/components/dnd/DroppableColumn';
import SortableTask from '@/components/dnd/SortableTask';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm, { TaskFormData } from '@/components/tasks/TaskForm';
import Modal from '@/components/ui/Modal';

export interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask?: (columnId: string, task: TaskFormData) => void;
  onUpdateColumn?: (columnId: string, updates: Partial<ColumnType>) => void;
  onDeleteColumn?: (columnId: string) => void;
  onTaskClick?: (task: Task) => void;
  onTaskSelect?: (taskId: string, isMulti: boolean) => void;
  selectedTasks?: Set<string>;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onUpdateColumn,
  onDeleteColumn,
  onTaskClick,
  onTaskSelect,
  selectedTasks = new Set(),
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(column.name);

  const taskIds = tasks.map((task) => task.id);
  const isWipLimitReached = column.wipLimit ? tasks.length >= column.wipLimit : false;

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: 'Edit Column',
      icon: <Edit2 className="h-4 w-4" />,
      onClick: () => setIsEditing(true),
    },
    {
      label: column.isHidden ? 'Show Column' : 'Hide Column',
      icon: <EyeOff className="h-4 w-4" />,
      onClick: () => onUpdateColumn?.(column.id, { isHidden: !column.isHidden }),
    },
    {
      label: 'Delete Column',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this column?')) {
          onDeleteColumn?.(column.id);
        }
      },
      danger: true,
      divider: true,
    },
  ];

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateColumn?.(column.id, { name: editedName });
      setIsEditing(false);
    }
  };

  const handleAddTask = (data: TaskFormData) => {
    onAddTask?.(column.id, data);
    setIsAddingTask(false);
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      onTaskSelect?.(task.id, true);
    } else {
      onTaskClick?.(task);
    }
  };

  const columnEmojis: { [key: string]: string } = {
    'To Do': '📝',
    'In Progress': '⚡',
    'Done': '✅',
    'Review': '👀',
    'Testing': '🧪',
    'Blocked': '🚫'
  };

  const columnEmoji = columnEmojis[column.name] || '📋';

  return (
    <div className="flex flex-col h-full glass rounded-2xl p-4 min-w-[340px] max-w-[340px] border-2 shadow-lg">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">{columnEmoji}</span>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="flex-1 px-3 py-1.5 text-base font-bold bg-background/80 border-2 border-primary rounded-lg"
              autoFocus
            />
          ) : (
            <h3 className="font-bold text-base flex-1">
              {column.name}
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
                {tasks.length}
                {column.wipLimit && ` / ${column.wipLimit}`}
              </span>
            </h3>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => setIsAddingTask(true)}
            disabled={isWipLimitReached}
            title="Add new task"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <ContextMenu items={contextMenuItems}>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </ContextMenu>
        </div>
      </div>

      {/* WIP Limit Warning */}
      {isWipLimitReached && (
        <div className="mb-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span>
          <span className="font-medium">WIP limit reached ({column.wipLimit})</span>
        </div>
      )}

      {/* Tasks */}
      <DroppableColumn
        id={column.id}
        items={taskIds}
        className="flex-1 space-y-3 overflow-y-auto scrollbar-thin pr-1"
      >
        {tasks.map((task) => (
          <SortableTask key={task.id} id={task.id}>
            <TaskCard
              task={task}
              onClick={(e) => handleTaskClick(task, e)}
              isSelected={selectedTasks.has(task.id)}
            />
          </SortableTask>
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center p-6">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm text-muted-foreground font-medium">No tasks yet</p>
            <p className="text-xs text-muted-foreground mt-1">Click + to add one</p>
          </div>
        )}
      </DroppableColumn>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        title={`✨ Create New Task in ${column.name}`}
        size="md"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsAddingTask(false)}
          submitLabel="Create Task"
        />
      </Modal>
    </div>
  );
};

export default Column;

