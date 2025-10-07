'use client';

import React, { useState } from 'react';
import { UserPlus, X, Send } from 'lucide-react';
import { BoardMember, User } from '@/types';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export interface TaskAssignmentProps {
  assignees: { id: string; user?: User }[];
  availableMembers: BoardMember[];
  onAssign?: (userId: string) => void;
  onUnassign?: (assigneeId: string) => void;
  onNotify?: (userId: string) => void;
  className?: string;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  assignees,
  availableMembers,
  onAssign,
  onUnassign,
  onNotify,
  className,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const assignedUserIds = assignees.map((a) => a.user?.id);
  const unassignedMembers = availableMembers.filter(
    (m) => !assignedUserIds.includes(m.user?.id)
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <span>👥</span>
          Assigned To
        </h3>
        {unassignedMembers.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-primary"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>
        )}
      </div>

      {/* Current assignees */}
      <div className="space-y-2">
        {assignees.map((assignee) => (
          <div
            key={assignee.id}
            className="glass p-3 rounded-xl border flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar
                src={assignee.user?.image}
                name={assignee.user?.name || assignee.user?.email || ''}
                size="sm"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {assignee.user?.name || 'Unknown User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {assignee.user?.email}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNotify?.(assignee.user?.id || '')}
                className="h-8 w-8 hover:bg-primary/10"
                title="Notify about this task"
              >
                <Send className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUnassign?.(assignee.id)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {assignees.length === 0 && (
          <div className="glass p-4 rounded-xl border text-center">
            <p className="text-sm text-muted-foreground">
              👤 No one assigned yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Assign team members to collaborate on this task
            </p>
          </div>
        )}
      </div>

      {/* Dropdown to add assignees */}
      {showDropdown && (
        <div className="glass p-3 rounded-xl border-2 border-primary/30 space-y-2">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            Select team member
          </div>
          {unassignedMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => {
                onAssign?.(member.user?.id || '');
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar
                src={member.user?.image}
                name={member.user?.name || member.user?.email || ''}
                size="sm"
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">
                  {member.user?.name || 'Unknown User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {member.user?.email}
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-muted">
                {member.role === 'OWNER' && '👑'}
                {member.role === 'ADMIN' && '🛡️'}
                {member.role === 'MEMBER' && '👤'}
                {member.role === 'VIEWER' && '👁️'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskAssignment;

