'use client';

import React, { useState } from 'react';
import { GitBranch, Link2, AlertTriangle, X } from 'lucide-react';
import { Task } from '@/types';
import Button from '@/components/ui/Button';
import Select, { SelectOption } from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

export interface TaskDependenciesProps {
  task: Task;
  availableTasks: Task[];
  onAddDependency?: (blockingTaskId: string) => void;
  onRemoveDependency?: (dependencyId: string) => void;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  availableTasks,
  onAddDependency,
  onRemoveDependency,
}) => {
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');

  // Get tasks that are blocking this task
  const blockingTasks = task.dependencies?.map((dep) => dep.blockingTask) || [];
  
  // Get tasks that are blocked by this task
  const dependentTasks = task.dependents?.map((dep) => dep.dependentTask) || [];

  // Filter out already dependent tasks
  const blockingTaskIds = blockingTasks.map((t) => t?.id);
  const availableOptions: SelectOption[] = availableTasks
    .filter((t) => t.id !== task.id && !blockingTaskIds.includes(t.id))
    .map((t) => ({
      value: t.id,
      label: `${t.title} (${t.column?.name})`,
    }));

  const handleAddDependency = () => {
    if (!selectedTask) return;
    onAddDependency?.(selectedTask);
    setSelectedTask('');
    setShowAddDependency(false);
  };

  return (
    <div className="space-y-4">
      {/* Blocked by */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            🚫 Blocked By ({blockingTasks.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddDependency(!showAddDependency)}
            className="text-primary"
          >
            <Link2 className="h-4 w-4 mr-1" />
            Add Blocker
          </Button>
        </div>

        {showAddDependency && (
          <div className="glass p-3 rounded-xl border-2 border-primary/30 mb-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  options={availableOptions}
                  value={selectedTask}
                  onChange={setSelectedTask}
                  placeholder="Select blocking task..."
                />
              </div>
              <Button size="sm" onClick={handleAddDependency} disabled={!selectedTask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddDependency(false);
                  setSelectedTask('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {blockingTasks.map((blockingTask) => {
            const dependency = task.dependencies?.find(
              (d) => d.blockingTaskId === blockingTask?.id
            );
            return (
              <div
                key={dependency?.id}
                className="glass p-3 rounded-xl border flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <span className="text-lg">🔗</span>
                    {blockingTask?.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    in {blockingTask?.column?.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                  >
                    Blocking
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveDependency?.(dependency?.id || '')}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {blockingTasks.length === 0 && (
            <div className="glass p-4 rounded-xl border text-center">
              <p className="text-sm text-muted-foreground">
                ✅ No blocking tasks
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This task can be started anytime
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Blocks these tasks */}
      {dependentTasks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-blue-500" />
            🔒 Blocks These Tasks ({dependentTasks.length})
          </h3>
          <div className="space-y-2">
            {dependentTasks.map((dependentTask) => (
              <div
                key={dependentTask?.id}
                className="glass p-3 rounded-xl border"
              >
                <div className="font-medium text-sm flex items-center gap-2">
                  <span className="text-lg">⏸️</span>
                  {dependentTask?.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  in {dependentTask?.column?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dependency status */}
      {blockingTasks.length > 0 && (
        <div className="glass p-3 rounded-xl border-2 border-orange-200 bg-orange-50/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm text-orange-800">
                ⚠️ Task is Blocked
              </div>
              <div className="text-xs text-orange-700 mt-1">
                Complete {blockingTasks.length} blocking task{blockingTasks.length > 1 ? 's' : ''} before starting this one
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDependencies;


