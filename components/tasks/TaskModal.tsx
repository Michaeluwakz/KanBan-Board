'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Paperclip,
  CheckSquare,
  MessageSquare,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { Task } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { cn, formatDateTime, getPriorityColor, getPriorityIcon } from '@/lib/utils';

export interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    onUpdate?.(task.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // TODO: Implement comment creation
    setNewComment('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id);
      onClose();
    }
  };

  const completedChecklist = task.checklistItems?.filter(item => item.isCompleted).length || 0;
  const totalChecklist = task.checklistItems?.length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-lg font-semibold"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl font-bold">{task.title}</h2>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className={cn(getPriorityColor(task.priority))}
              >
                <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                {task.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                in {task.column?.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Description
              </h3>
              {isEditing ? (
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={6}
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              )}
            </div>

            {/* Checklist */}
            {task.checklistItems && task.checklistItems.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Checklist ({completedChecklist}/{totalChecklist})
                </h3>
                <div className="space-y-2">
                  {task.checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => {
                          // TODO: Toggle checklist item
                        }}
                        className="h-4 w-4 rounded border-input"
                      />
                      <span className={cn(
                        'text-sm',
                        item.isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {item.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({task.attachments.length})
                </h3>
                <div className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 rounded-md border border-border hover:bg-accent"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({task.comments?.length || 0})
              </h3>
              <div className="space-y-3">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar
                      src={comment.user?.image}
                      name={comment.user?.name || comment.user?.email || ''}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add comment */}
                <div className="flex gap-3 pt-2">
                  <Avatar size="sm" name="You" />
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      className="mt-2"
                      disabled={!newComment.trim()}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignees */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignees
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.assignees?.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-2">
                    <Avatar
                      src={assignee.user?.image}
                      name={assignee.user?.name || assignee.user?.email || ''}
                      size="sm"
                    />
                    <span className="text-sm">
                      {assignee.user?.name || assignee.user?.email}
                    </span>
                  </div>
                ))}
                {(!task.assignees || task.assignees.length === 0) && (
                  <span className="text-sm text-muted-foreground">No assignees</span>
                )}
              </div>
            </div>

            {/* Labels */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Labels
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.labels?.map((taskLabel) => (
                  <Badge
                    key={taskLabel.id}
                    style={{
                      backgroundColor: taskLabel.label?.color,
                      color: '#fff',
                    }}
                  >
                    {taskLabel.label?.name}
                  </Badge>
                ))}
                {(!task.labels || task.labels.length === 0) && (
                  <span className="text-sm text-muted-foreground">No labels</span>
                )}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dates
              </h3>
              <div className="space-y-2 text-sm">
                {task.startDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start:</span>
                    <span>{formatDateTime(task.startDate)}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due:</span>
                    <span>{formatDateTime(task.dueDate)}</span>
                  </div>
                )}
                {!task.startDate && !task.dueDate && (
                  <span className="text-muted-foreground">No dates set</span>
                )}
              </div>
            </div>

            {/* Time */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Tracking
              </h3>
              <div className="space-y-2 text-sm">
                {task.timeEstimate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimate:</span>
                    <span>{Math.floor(task.timeEstimate / 60)}h {task.timeEstimate % 60}m</span>
                  </div>
                )}
                {task.timeSpent && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spent:</span>
                    <span>{Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m</span>
                  </div>
                )}
                {!task.timeEstimate && !task.timeSpent && (
                  <span className="text-muted-foreground">No time tracked</span>
                )}
              </div>
            </div>

            {/* Activity */}
            <div>
              <h3 className="font-semibold mb-2">Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDateTime(task.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{formatDateTime(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;


