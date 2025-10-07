'use client';

import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Board, Task, Priority } from '@/types';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export interface BoardAnalyticsProps {
  board: Board;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

const BoardAnalytics: React.FC<BoardAnalyticsProps> = ({
  board,
  tasks = [],
  isOpen,
  onClose,
}) => {
  // Calculate metrics
  const tasksList = Array.isArray(tasks) ? tasks : [];
  const totalTasks = tasksList.length;
  const completedColumn = board.columns?.find(c => c.name.toLowerCase().includes('done'));
  const completedTasks = tasksList.filter(t => t.columnId === completedColumn?.id).length;
  const overdueTasks = tasksList.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.columnId !== completedColumn?.id
  ).length;
  
  const priorityBreakdown = {
    URGENT: tasksList.filter(t => t.priority === 'URGENT').length,
    HIGH: tasksList.filter(t => t.priority === 'HIGH').length,
    MEDIUM: tasksList.filter(t => t.priority === 'MEDIUM').length,
    LOW: tasksList.filter(t => t.priority === 'LOW').length,
  };

  const columnBreakdown = board.columns?.map(column => ({
    name: column.name,
    count: tasksList.filter(t => t.columnId === column.id).length,
    color: column.color,
  })) || [];

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Team productivity
  const assignedTasks = tasksList.filter(t => t.assignees && t.assignees.length > 0).length;
  const unassignedTasks = totalTasks - assignedTasks;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📊 Board Analytics"
      description={`Insights for ${board.name}`}
      size="xl"
    >
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="glass border-2 p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{totalTasks}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </Card>

          <Card className="glass border-2 p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{completedTasks}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          </Card>

          <Card className="glass border-2 p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{overdueTasks}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          </Card>

          <Card className="glass border-2 p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{completionRate}%</div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Priority Distribution */}
        <Card className="glass border-2 p-3">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            🎯 Priority Distribution
          </h3>
          <div className="space-y-2">
            {Object.entries(priorityBreakdown).map(([priority, count]) => {
              const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
              const emoji = { URGENT: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🟢' }[priority];
              const color = { 
                URGENT: 'bg-red-500', 
                HIGH: 'bg-orange-500', 
                MEDIUM: 'bg-yellow-500', 
                LOW: 'bg-green-500' 
              }[priority];
              
              return (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span>{emoji}</span>
                      {priority}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Column Distribution */}
        <Card className="glass border-2 p-3">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            📋 Workflow Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {columnBreakdown.map((column) => {
              const percentage = totalTasks > 0 ? Math.round((column.count / totalTasks) * 100) : 0;
              return (
                <div
                  key={column.name}
                  className="glass p-2 rounded-xl border-2"
                  style={{ borderColor: column.color + '40' }}
                >
                  <div className="font-semibold text-xs">{column.name}</div>
                  <div className="text-xl font-bold mt-1">{column.count}</div>
                  <div className="text-xs text-muted-foreground">{percentage}% of total</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Team Metrics */}
        <Card className="glass border-2 p-3">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            👥 Team Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Team Members</div>
              <div className="text-2xl font-bold">{board.members?.length || 0}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Assigned Tasks</div>
              <div className="text-2xl font-bold">{assignedTasks}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Unassigned Tasks</div>
              <div className="text-2xl font-bold text-orange-600">{unassignedTasks}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Avg. Tasks/Member</div>
              <div className="text-2xl font-bold">
                {board.members?.length ? Math.round(assignedTasks / board.members.length) : 0}
              </div>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="glass border-2 border-blue-200 bg-blue-50/50 p-3">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-800">
            💡 Insights & Recommendations
          </h3>
          <ul className="space-y-1 text-xs">
            {overdueTasks > 0 && (
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span>{overdueTasks} task{overdueTasks > 1 ? 's are' : ' is'} overdue. Consider reviewing deadlines.</span>
              </li>
            )}
            {unassignedTasks > 3 && (
              <li className="flex items-start gap-2">
                <span>👤</span>
                <span>{unassignedTasks} tasks are unassigned. Assign them to team members for better accountability.</span>
              </li>
            )}
            {priorityBreakdown.URGENT > 5 && (
              <li className="flex items-start gap-2">
                <span>🔥</span>
                <span>High number of urgent tasks ({priorityBreakdown.URGENT}). Focus on completing critical work.</span>
              </li>
            )}
            {completionRate >= 80 && (
              <li className="flex items-start gap-2">
                <span>🎉</span>
                <span>Great job! {completionRate}% completion rate shows excellent progress!</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </Modal>
  );
};

export default BoardAnalytics;

