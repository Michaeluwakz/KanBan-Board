import { Priority, BoardRole, ActivityType } from '@prisma/client';

// Re-export Prisma enums
export { Priority, BoardRole, ActivityType };

// User types
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Board types
export interface Board {
  id: string;
  name: string;
  description: string | null;
  background: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator?: User;
  members?: BoardMember[];
  columns?: Column[];
  tasks?: Task[];
  labels?: Label[];
}

export interface BoardMember {
  id: string;
  role: BoardRole;
  joinedAt: Date;
  boardId: string;
  userId: string;
  user?: User;
}

// Column types
export interface Column {
  id: string;
  name: string;
  position: number;
  color: string | null;
  wipLimit: number | null;
  isHidden: boolean;
  boardId: string;
  tasks?: Task[];
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string | null;
  position: number;
  priority: Priority;
  dueDate: Date | null;
  startDate: Date | null;
  timeEstimate: number | null;
  timeSpent: number | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  columnId: string;
  column?: Column;
  assignees?: TaskAssignee[];
  labels?: TaskLabel[];
  comments?: Comment[];
  attachments?: Attachment[];
  checklistItems?: ChecklistItem[];
  activities?: Activity[];
}

export interface TaskAssignee {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: Date;
  user?: User;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId: string;
}

export interface TaskLabel {
  id: string;
  taskId: string;
  labelId: string;
  label?: Label;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  userId: string;
  user?: User;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  taskId: string;
}

export interface ChecklistItem {
  id: string;
  content: string;
  isCompleted: boolean;
  position: number;
  createdAt: Date;
  taskId: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  metadata: any;
  createdAt: Date;
  boardId: string;
  taskId: string | null;
  userId: string;
  user?: User;
  task?: Task;
}

// Form types
export interface CreateBoardInput {
  name: string;
  description?: string;
  background?: string;
}

export interface UpdateBoardInput {
  name?: string;
  description?: string;
  background?: string;
  isArchived?: boolean;
}

export interface CreateColumnInput {
  name: string;
  position: number;
  color?: string;
  wipLimit?: number;
  boardId: string;
}

export interface UpdateColumnInput {
  name?: string;
  position?: number;
  color?: string;
  wipLimit?: number;
  isHidden?: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  position: number;
  priority?: Priority;
  dueDate?: Date;
  startDate?: Date;
  timeEstimate?: number;
  boardId: string;
  columnId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  position?: number;
  priority?: Priority;
  dueDate?: Date | null;
  startDate?: Date | null;
  timeEstimate?: number | null;
  timeSpent?: number | null;
  columnId?: string;
  isArchived?: boolean;
}

export interface MoveTaskInput {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourcePosition: number;
  destinationPosition: number;
}

// Drag and Drop types
export interface DragItem {
  id: string;
  type: 'task' | 'column';
  index: number;
  columnId?: string;
}

export interface DropResult {
  id: string;
  type: 'task' | 'column';
  index: number;
  columnId?: string;
}

// Real-time collaboration types
export interface UserPresence {
  userId: string;
  userName: string;
  userImage: string | null;
  cursor: {
    x: number;
    y: number;
  };
  lastSeen: Date;
}

export interface SocketEvents {
  'task:created': Task;
  'task:updated': { taskId: string; updates: Partial<Task> };
  'task:moved': MoveTaskInput;
  'task:deleted': { taskId: string };
  'column:created': Column;
  'column:updated': { columnId: string; updates: Partial<Column> };
  'column:deleted': { columnId: string };
  'user:presence': UserPresence;
  'board:join': { boardId: string; userId: string };
  'board:leave': { boardId: string; userId: string };
}

// Analytics types
export interface BoardAnalytics {
  totalTasks: number;
  completedTasks: number;
  overdueTask: number;
  tasksByPriority: Record<Priority, number>;
  tasksByColumn: Record<string, number>;
  averageCycleTime: number;
  averageTimeInColumn: Record<string, number>;
  memberWorkload: Record<string, number>;
}

// Filter and sort types
export interface TaskFilter {
  priority?: Priority[];
  assignees?: string[];
  labels?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  search?: string;
}

export type TaskSortBy = 'priority' | 'dueDate' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskSort {
  sortBy: TaskSortBy;
  order: SortOrder;
}

