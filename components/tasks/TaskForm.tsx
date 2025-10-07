'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select, { SelectOption } from '@/components/ui/Select';
import Button from '@/components/ui/Button';

// Priority enum (fallback if Prisma client hasn't loaded)
const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

type Priority = typeof Priority[keyof typeof Priority];

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
  timeEstimate: z.number().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const priorityOptions: SelectOption[] = [
  { value: Priority.LOW, label: '↓ Low' },
  { value: Priority.MEDIUM, label: '→ Medium' },
  { value: Priority.HIGH, label: '↑ High' },
  { value: Priority.URGENT, label: '⚡ Urgent' },
];

const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Create Task',
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || Priority.MEDIUM,
      dueDate: initialData?.dueDate || '',
      timeEstimate: initialData?.timeEstimate,
    },
  });

  const priority = watch('priority');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="Enter task title..."
        error={errors.title?.message}
        {...register('title')}
        autoFocus
      />

      <Textarea
        label="Description"
        placeholder="Add a description..."
        rows={4}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(value) => setValue('priority', value as Priority)}
          error={errors.priority?.message}
        />

        <Input
          type="date"
          label="Due Date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <Input
        type="number"
        label="Time Estimate (hours)"
        placeholder="0"
        min="0"
        step="0.5"
        error={errors.timeEstimate?.message}
        {...register('timeEstimate', {
          valueAsNumber: true,
          setValueAs: (v) => (v === '' ? undefined : Number(v) * 60), // Convert to minutes
        })}
      />

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;

