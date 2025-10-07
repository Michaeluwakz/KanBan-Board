'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

export interface SortableTaskProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const SortableTask: React.FC<SortableTaskProps> = ({
  id,
  children,
  disabled,
  className,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && 'opacity-50 cursor-grabbing z-50',
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default SortableTask;


