'use client';

import React from 'react';
import { Activity as ActivityIcon, Clock } from 'lucide-react';
import { Activity, ActivityType } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { formatDateTime } from '@/lib/utils';

export interface TaskActivityProps {
  activities: Activity[];
}

const TaskActivity: React.FC<TaskActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityType) => {
    const icons = {
      TASK_CREATED: '✨',
      TASK_UPDATED: '📝',
      TASK_MOVED: '➡️',
      TASK_DELETED: '🗑️',
      TASK_ASSIGNED: '👤',
      TASK_UNASSIGNED: '👥',
      COMMENT_ADDED: '💬',
      ATTACHMENT_ADDED: '📎',
      CHECKLIST_ITEM_ADDED: '☑️',
      CHECKLIST_ITEM_COMPLETED: '✅',
      BOARD_CREATED: '📋',
      BOARD_UPDATED: '📝',
      BOARD_ARCHIVED: '📦',
      COLUMN_CREATED: '➕',
      COLUMN_UPDATED: '📝',
      COLUMN_DELETED: '➖',
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type: ActivityType) => {
    const colors = {
      TASK_CREATED: 'bg-green-50 text-green-700 border-green-200',
      TASK_UPDATED: 'bg-blue-50 text-blue-700 border-blue-200',
      TASK_MOVED: 'bg-purple-50 text-purple-700 border-purple-200',
      TASK_DELETED: 'bg-red-50 text-red-700 border-red-200',
      TASK_ASSIGNED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      TASK_UNASSIGNED: 'bg-gray-50 text-gray-700 border-gray-200',
      COMMENT_ADDED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      ATTACHMENT_ADDED: 'bg-orange-50 text-orange-700 border-orange-200',
      CHECKLIST_ITEM_ADDED: 'bg-teal-50 text-teal-700 border-teal-200',
      CHECKLIST_ITEM_COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      BOARD_CREATED: 'bg-blue-50 text-blue-700 border-blue-200',
      BOARD_UPDATED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      BOARD_ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200',
      COLUMN_CREATED: 'bg-green-50 text-green-700 border-green-200',
      COLUMN_UPDATED: 'bg-blue-50 text-blue-700 border-blue-200',
      COLUMN_DELETED: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <ActivityIcon className="h-4 w-4" />
        📊 Activity Feed
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="glass p-3 rounded-xl border flex gap-3 hover:shadow-md transition-shadow"
          >
            <div className={`mt-1 px-2 py-1 rounded-lg border ${getActivityColor(activity.type)}`}>
              <span className="text-lg">{getActivityIcon(activity.type)}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={activity.user?.image}
                    name={activity.user?.name || activity.user?.email || ''}
                    size="xs"
                  />
                  <span className="font-medium text-sm">
                    {activity.user?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(activity.createdAt)}
                </div>
              </div>
              
              <p className="text-sm mt-1">{activity.content}</p>
              
              {activity.metadata && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  {typeof activity.metadata === 'string' 
                    ? activity.metadata 
                    : JSON.stringify(activity.metadata)}
                </div>
              )}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="glass p-6 rounded-xl border text-center">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm text-muted-foreground">
              No activity yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Activity will appear here as the task progresses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskActivity;


