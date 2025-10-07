'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Settings,
  Archive,
  Share2,
  UserPlus,
  BarChart3,
  Columns,
} from 'lucide-react';
import { Board, Column } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import ContextMenu, { ContextMenuItem } from '@/components/ui/ContextMenu';
import TeamManagement from './TeamManagement';
import BoardAnalytics from './BoardAnalytics';
import ColumnManagement from './ColumnManagement';

export interface BoardHeaderProps {
  board: Board;
  tasks?: unknown[];
  onUpdateBoard?: (boardId: string, updates: Partial<Board>) => void;
  onArchiveBoard?: (boardId: string) => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
  board,
  tasks = [],
  onUpdateBoard,
  onArchiveBoard,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board.name);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showColumnManagement, setShowColumnManagement] = useState(false);

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: 'Board Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => {
        // TODO: Open board settings modal
      },
    },
    {
      label: 'Share Board',
      icon: <Share2 className="h-4 w-4" />,
      onClick: () => {
        // TODO: Open share modal
      },
    },
    {
      label: board.isArchived ? 'Unarchive Board' : 'Archive Board',
      icon: <Archive className="h-4 w-4" />,
      onClick: () => onArchiveBoard?.(board.id),
      divider: true,
    },
  ];

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== board.name) {
      onUpdateBoard?.(board.id, { name: editedTitle });
    }
    setIsEditingTitle(false);
  };

  const handleAddColumn = async (name: string, color: string) => {
    try {
      const response = await fetch(`/api/boards/${board.id}/columns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error('Failed to create column');
      }

      const newColumn = await response.json();
      
      // Update the board state with the new column
      if (onUpdateBoard) {
        const updatedColumns = [...(board.columns || []), newColumn];
        onUpdateBoard(board.id, { columns: updatedColumns });
      }

      console.log('Column created:', newColumn);
    } catch (error) {
      console.error('Error creating column:', error);
      alert('Failed to create column. Please try again.');
    }
  };

  const handleUpdateColumn = async (columnId: string, name: string, color: string) => {
    try {
      const response = await fetch(`/api/boards/${board.id}/columns/${columnId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error('Failed to update column');
      }

      const updatedColumn = await response.json();
      
      // Update the board state with the updated column
      if (onUpdateBoard) {
        const updatedColumns = (board.columns || []).map(col => 
          col.id === columnId ? updatedColumn : col
        );
        onUpdateBoard(board.id, { columns: updatedColumns });
      }

      console.log('Column updated:', updatedColumn);
    } catch (error) {
      console.error('Error updating column:', error);
      alert('Failed to update column. Please try again.');
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    try {
      const response = await fetch(`/api/boards/${board.id}/columns/${columnId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete column');
      }
      
      // Update the board state by removing the deleted column
      if (onUpdateBoard) {
        const updatedColumns = (board.columns || []).filter(col => col.id !== columnId);
        onUpdateBoard(board.id, { columns: updatedColumns });
      }

      console.log('Column deleted:', columnId);
    } catch (error) {
      console.error('Error deleting column:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete column. Please try again.');
    }
  };

  const handleReorderColumns = async (columns: Column[]) => {
    try {
      // Update positions for all columns
      const updatePromises = columns.map((column, index) =>
        fetch(`/api/boards/${board.id}/columns/${column.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position: index }),
        })
      );

      await Promise.all(updatePromises);
      
      // Update the board state with reordered columns
      if (onUpdateBoard) {
        onUpdateBoard(board.id, { columns });
      }

      console.log('Columns reordered');
    } catch (error) {
      console.error('Error reordering columns:', error);
      alert('Failed to reorder columns. Please try again.');
    }
  };

  return (
    <div className="border-b-2 border-border/50 glass backdrop-blur-md">
      <div className="flex items-center justify-between px-8 py-5">
        {/* Left side - Board title and actions */}
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
              onClick={() => setIsEditingTitle(true)}
            >
              <span>📊</span>
              {board.name}
            </h1>
          )}

          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent/20">
            <span className="text-xl">⭐</span>
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50">
            <span>👥</span>
            <span className="text-sm font-semibold">{board.members?.length || 0}</span>
          </div>
        </div>

        {/* Right side - Search, filter, and actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearching(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Filter */}
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
            <span className="text-lg">🔍</span>
          </Button>

          {/* Members */}
          <div className="flex items-center -space-x-2">
            {board.members?.slice(0, 5).map((member) => (
              <Avatar
                key={member.id}
                src={member.user?.image}
                name={member.user?.name || member.user?.email || ''}
                size="sm"
                className="border-2 border-background shadow-sm"
              />
            ))}
            {board.members && board.members.length > 5 && (
              <div className="h-8 w-8 rounded-full glass border-2 border-background flex items-center justify-center text-xs font-semibold shadow-sm">
                +{board.members.length - 5}
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="glass hover:bg-primary/10"
            onClick={() => setShowColumnManagement(true)}
          >
            <Columns className="h-4 w-4 mr-2" />
            Columns
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="glass hover:bg-primary/10"
            onClick={() => setShowTeamManagement(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Team
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="glass hover:bg-primary/10"
            onClick={() => setShowAnalytics(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>

          {/* More options */}
          <ContextMenu items={contextMenuItems}>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </ContextMenu>
        </div>
      </div>

      {/* Column Management Modal */}
      <ColumnManagement
        board={board}
        isOpen={showColumnManagement}
        onClose={() => setShowColumnManagement(false)}
        onAddColumn={handleAddColumn}
        onUpdateColumn={handleUpdateColumn}
        onDeleteColumn={handleDeleteColumn}
        onReorderColumns={handleReorderColumns}
      />

      {/* Team Management Modal */}
      <TeamManagement
        board={board}
        isOpen={showTeamManagement}
        onClose={() => setShowTeamManagement(false)}
        onInviteMember={(email, role) => {
          console.log('Invite member:', email, role);
          // TODO: Implement invite member
        }}
        onUpdateMemberRole={(memberId, role) => {
          console.log('Update member role:', memberId, role);
          // TODO: Implement update member role
        }}
        onRemoveMember={(memberId) => {
          console.log('Remove member:', memberId);
          // TODO: Implement remove member
        }}
      />

      {/* Analytics Modal */}
      <BoardAnalytics
        board={board}
        tasks={tasks}
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Board description */}
      {board.description && (
        <div className="px-8 pb-4">
          <p className="text-sm text-muted-foreground">{board.description}</p>
        </div>
      )}
    </div>
  );
};

export default BoardHeader;

