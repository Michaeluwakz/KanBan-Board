'use client';

import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Task } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { cn, formatDate, isOverdue } from '@/lib/utils';

export interface TaskCardProps {
  task: Task;
  onClick?: (e?: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  isSelected?: boolean;
  isDragging?: boolean;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onDoubleClick,
  isSelected,
  isDragging,
  className,
}) => {
  const hasLabels = task.labels && task.labels.length > 0;
  const hasAssignees = task.assignees && task.assignees.length > 0;
  const hasComments = task.comments && task.comments.length > 0;
  const hasAttachments = task.attachments && task.attachments.length > 0;
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  
  const completedChecklist = task.checklistItems?.filter(item => item.isCompleted).length || 0;
  const totalChecklist = task.checklistItems?.length || 0;
  const checklistProgress = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0;

  const isDue = task.dueDate && isOverdue(task.dueDate);

  const priorityEmojis = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    URGENT: '🔴'
  };

  return (
    <Card
      className={cn(
        'task-card p-4 cursor-pointer select-none glass border-l-4 hover:shadow-xl',
        isSelected && 'selected ring-2 ring-primary',
        isDragging && 'dragging opacity-50',
        task.priority === 'URGENT' && 'border-l-red-500',
        task.priority === 'HIGH' && 'border-l-orange-500',
        task.priority === 'MEDIUM' && 'border-l-yellow-500',
        task.priority === 'LOW' && 'border-l-green-500',
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      hoverable
    >
      {/* Labels */}
      {hasLabels && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels?.slice(0, 3).map((taskLabel) => (
            <div
              key={taskLabel.id}
              className="h-2 w-12 rounded-full"
              style={{ backgroundColor: taskLabel.label?.color || '#ccc' }}
              title={taskLabel.label?.name}
            />
          ))}
          {task.labels && task.labels.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{task.labels.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-base mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description preview */}
      {task.description && (
        <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Checklist progress */}
      {hasChecklist && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {completedChecklist}/{totalChecklist}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1">
            <div
              className={cn(
                'h-1 rounded-full transition-all',
                checklistProgress === 100 ? 'bg-green-500' : 'bg-primary'
              )}
              style={{ width: `${checklistProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Metadata row */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Priority badge */}
          <Badge
            variant="outline"
            size="sm"
            className={cn(
              'text-xs font-medium',
              task.priority === 'URGENT' && 'bg-red-50 text-red-700 border-red-200',
              task.priority === 'HIGH' && 'bg-orange-50 text-orange-700 border-orange-200',
              task.priority === 'MEDIUM' && 'bg-yellow-50 text-yellow-700 border-yellow-200',
              task.priority === 'LOW' && 'bg-green-50 text-green-700 border-green-200'
            )}
          >
            <span className="mr-1">{priorityEmojis[task.priority as keyof typeof priorityEmojis]}</span>
            {task.priority}
          </Badge>

          {/* Due date */}
          {task.dueDate && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs px-2 py-1 rounded-md',
                isDue ? 'bg-red-50 text-red-700' : 'bg-muted/50 text-muted-foreground'
              )}
            >
              <span>{isDue ? '⏰' : '📅'}</span>
              <span className="truncate">{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Time estimate */}
          {task.timeEstimate && (
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">
              <span>⏱️</span>
              <span>{Math.floor(task.timeEstimate / 60)}h</span>
            </div>
          )}
        </div>

        {/* Icons row */}
        <div className="flex items-center gap-2">
          {hasComments && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>💬</span>
              <span>{task.comments?.length}</span>
            </div>
          )}

          {hasAttachments && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>📎</span>
              <span>{task.attachments?.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Assignees */}
      {hasAssignees && (
        <div className="flex items-center gap-1 mt-3 -space-x-2">
          {task.assignees?.slice(0, 5).map((assignee) => (
            <Avatar
              key={assignee.id}
              src={assignee.user?.image}
              name={assignee.user?.name || assignee.user?.email || ''}
              size="xs"
              className="border-2 border-background"
            />
          ))}
          {task.assignees && task.assignees.length > 5 && (
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
              +{task.assignees.length - 5}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TaskCard;

