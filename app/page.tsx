'use client';

import { useEffect, useState, useCallback } from 'react';
import { Board } from '@/types';
import { useBoardStore } from '@/store/board-store';
import BoardList from '@/components/boards/BoardList';
import BoardView from '@/components/boards/BoardView';
import BoardHeader from '@/components/boards/BoardHeader';

export default function Home() {
  const { boards, currentBoard, tasks, setBoards, setCurrentBoard, setColumns, setTasks, setLabels } = useBoardStore();
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoards = useCallback(async () => {
    try {
      console.log('Fetching boards...');
      const response = await fetch('/api/boards');
      console.log('Boards response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Boards fetched:', data.length, 'boards');
        setBoards(data);
      } else {
        const error = await response.json();
        console.error('Failed to fetch boards:', error);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setBoards]);

  useEffect(() => {
    // Fetch boards on mount
    fetchBoards();
  }, [fetchBoards]);

  const fetchBoardDetails = async (boardId: string) => {
    try {
      console.log('Fetching board details for:', boardId);
      const [boardRes, tasksRes] = await Promise.all([
        fetch(`/api/boards/${boardId}`),
        fetch(`/api/boards/${boardId}/tasks`),
      ]);

      if (boardRes.ok && tasksRes.ok) {
        const board = await boardRes.json();
        const tasks = await tasksRes.json();
        
        console.log('Board loaded:', board);
        console.log('Tasks loaded:', tasks);

        setCurrentBoard(board);
        setColumns(board.columns || []);
        setTasks(tasks);
        setLabels(board.labels || []);
      } else {
        console.error('API error:', boardRes.status, tasksRes.status);
      }
    } catch (error) {
      console.error('Error fetching board details:', error);
    }
  };

  const handleSelectBoard = (board: Board) => {
    fetchBoardDetails(board.id);
  };

  const handleCreateBoard = async (data: { name: string; description?: string }) => {
    try {
      console.log('Creating board with data:', data);
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const newBoard = await response.json();
        console.log('Board created successfully:', newBoard);
        await fetchBoards(); // Refresh boards list
        await fetchBoardDetails(newBoard.id); // Open the new board
      } else {
        const error = await response.json();
        console.error('Failed to create board:', error);
        alert(`Failed to create board: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board. Please check the console for details.');
    }
  };

  const handleUpdateBoard = async (boardId: string, updates: Partial<Board>) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedBoard = await response.json();
        setCurrentBoard(updatedBoard);
        fetchBoards(); // Refresh boards list
      }
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  const handleArchiveBoard = async (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    await handleUpdateBoard(boardId, { isArchived: !board.isArchived });
    
    if (currentBoard?.id === boardId) {
      setCurrentBoard(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading boards...</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <BoardList
        boards={boards}
        onSelectBoard={handleSelectBoard}
        onCreateBoard={handleCreateBoard}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <BoardHeader
        board={currentBoard}
        tasks={Array.from(tasks.values())}
        onUpdateBoard={handleUpdateBoard}
        onArchiveBoard={handleArchiveBoard}
      />
      <BoardView board={currentBoard} onUpdateBoard={handleUpdateBoard} />
      
      {/* Back to boards button */}
      <button
        onClick={() => setCurrentBoard(null)}
        className="fixed bottom-8 left-8 px-6 py-3 gradient-warm text-white rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
      >
        <span>←</span>
        <span>📋 Back to Boards</span>
      </button>
    </div>
  );
}
