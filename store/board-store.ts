import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Board, Column, Task, Label, User } from '@/types';
import { Priority } from '@prisma/client';

interface BoardState {
  // State
  boards: Board[];
  currentBoard: Board | null;
  columns: Column[];
  tasks: Map<string, Task>;
  labels: Label[];
  selectedTasks: Set<string>;
  isLoading: boolean;
  error: string | null;

  // Board actions
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;

  // Column actions
  setColumns: (columns: Column[]) => void;
  addColumn: (column: Column) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (columnId: string, newPosition: number) => void;

  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, destinationColumnId: string, newPosition: number) => void;
  moveMultipleTasks: (taskIds: string[], destinationColumnId: string, startPosition: number) => void;

  // Label actions
  setLabels: (labels: Label[]) => void;
  addLabel: (label: Label) => void;
  updateLabel: (labelId: string, updates: Partial<Label>) => void;
  deleteLabel: (labelId: string) => void;

  // Selection actions
  toggleTaskSelection: (taskId: string) => void;
  selectMultipleTasks: (taskIds: string[]) => void;
  clearSelection: () => void;

  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  boards: [],
  currentBoard: null,
  columns: [],
  tasks: new Map<string, Task>(),
  labels: [],
  selectedTasks: new Set<string>(),
  isLoading: false,
  error: null,
};

export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Board actions
        setBoards: (boards) => set({ boards }),

        setCurrentBoard: (board) => set({ currentBoard: board }),

        addBoard: (board) =>
          set((state) => ({
            boards: [...state.boards, board],
          })),

        updateBoard: (boardId, updates) =>
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId ? { ...board, ...updates } : board
            ),
            currentBoard:
              state.currentBoard?.id === boardId
                ? { ...state.currentBoard, ...updates }
                : state.currentBoard,
          })),

        deleteBoard: (boardId) =>
          set((state) => ({
            boards: state.boards.filter((board) => board.id !== boardId),
            currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard,
          })),

        // Column actions
        setColumns: (columns) =>
          set({ columns: columns.sort((a, b) => a.position - b.position) }),

        addColumn: (column) =>
          set((state) => ({
            columns: [...state.columns, column].sort((a, b) => a.position - b.position),
          })),

        updateColumn: (columnId, updates) =>
          set((state) => ({
            columns: state.columns
              .map((column) => (column.id === columnId ? { ...column, ...updates } : column))
              .sort((a, b) => a.position - b.position),
          })),

        deleteColumn: (columnId) =>
          set((state) => ({
            columns: state.columns.filter((column) => column.id !== columnId),
          })),

        moveColumn: (columnId, newPosition) =>
          set((state) => {
            const columns = [...state.columns];
            const columnIndex = columns.findIndex((col) => col.id === columnId);
            if (columnIndex === -1) return state;

            const [movedColumn] = columns.splice(columnIndex, 1);
            columns.splice(newPosition, 0, movedColumn);

            return {
              columns: columns.map((col, index) => ({ ...col, position: index })),
            };
          }),

        // Task actions
        setTasks: (tasks) =>
          set({
            tasks: new Map(tasks.map((task) => [task.id, task])),
          }),

        addTask: (task) =>
          set((state) => {
            const newTasks = new Map(state.tasks);
            newTasks.set(task.id, task);
            return { tasks: newTasks };
          }),

        updateTask: (taskId, updates) =>
          set((state) => {
            const task = state.tasks.get(taskId);
            if (!task) return state;

            const newTasks = new Map(state.tasks);
            newTasks.set(taskId, { ...task, ...updates });
            return { tasks: newTasks };
          }),

        deleteTask: (taskId) =>
          set((state) => {
            const newTasks = new Map(state.tasks);
            newTasks.delete(taskId);
            return { tasks: newTasks };
          }),

        moveTask: (taskId, destinationColumnId, newPosition) =>
          set((state) => {
            const task = state.tasks.get(taskId);
            if (!task) return state;

            const newTasks = new Map(state.tasks);
            const tasksInColumn = Array.from(newTasks.values())
              .filter((t) => t.columnId === destinationColumnId)
              .sort((a, b) => a.position - b.position);

            // Update positions
            const updatedTask = { ...task, columnId: destinationColumnId, position: newPosition };
            newTasks.set(taskId, updatedTask);

            // Reposition other tasks in the column
            tasksInColumn.forEach((t, index) => {
              if (t.id !== taskId) {
                const adjustedIndex = index >= newPosition ? index + 1 : index;
                newTasks.set(t.id, { ...t, position: adjustedIndex });
              }
            });

            return { tasks: newTasks };
          }),

        moveMultipleTasks: (taskIds, destinationColumnId, startPosition) =>
          set((state) => {
            const newTasks = new Map(state.tasks);
            let currentPosition = startPosition;

            taskIds.forEach((taskId) => {
              const task = newTasks.get(taskId);
              if (task) {
                newTasks.set(taskId, {
                  ...task,
                  columnId: destinationColumnId,
                  position: currentPosition++,
                });
              }
            });

            return { tasks: newTasks };
          }),

        // Label actions
        setLabels: (labels) => set({ labels }),

        addLabel: (label) =>
          set((state) => ({
            labels: [...state.labels, label],
          })),

        updateLabel: (labelId, updates) =>
          set((state) => ({
            labels: state.labels.map((label) =>
              label.id === labelId ? { ...label, ...updates } : label
            ),
          })),

        deleteLabel: (labelId) =>
          set((state) => ({
            labels: state.labels.filter((label) => label.id !== labelId),
          })),

        // Selection actions
        toggleTaskSelection: (taskId) =>
          set((state) => {
            const newSelection = new Set(state.selectedTasks);
            if (newSelection.has(taskId)) {
              newSelection.delete(taskId);
            } else {
              newSelection.add(taskId);
            }
            return { selectedTasks: newSelection };
          }),

        selectMultipleTasks: (taskIds) =>
          set({
            selectedTasks: new Set(taskIds),
          }),

        clearSelection: () =>
          set({
            selectedTasks: new Set(),
          }),

        // Utility actions
        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'board-storage',
        partialize: (state) => ({
          currentBoard: state.currentBoard,
        }),
      }
    )
  )
);

// Selectors for optimized access
export const useCurrentBoard = () => useBoardStore((state) => state.currentBoard);
export const useColumns = () => useBoardStore((state) => state.columns);
export const useTasks = () => useBoardStore((state) => state.tasks);
export const useLabels = () => useBoardStore((state) => state.labels);
export const useSelectedTasks = () => useBoardStore((state) => state.selectedTasks);

// Helper function to get tasks by column
export const useTasksByColumn = (columnId: string) =>
  useBoardStore((state) =>
    Array.from(state.tasks.values())
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.position - b.position)
  );

