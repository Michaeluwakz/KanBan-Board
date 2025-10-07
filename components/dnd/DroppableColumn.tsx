'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

export interface DroppableColumnProps {
  id: string;
  items: string[];
  children: React.ReactNode;
  className?: string;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  id,
  items,
  children,
  className,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[200px] transition-colors',
          isOver && 'bg-accent/20',
          className
        )}
      >
        {children}
      </div>
    </SortableContext>
  );
};

export default DroppableColumn;

