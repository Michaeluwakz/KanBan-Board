'use client';

import React, { useState } from 'react';
import { Plus, Star, Archive, Folder, Sparkles } from 'lucide-react';
import { Board } from '@/types';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import BoardTemplates, { BoardTemplate } from './BoardTemplates';
import { formatDate } from '@/lib/utils';

export interface BoardListProps {
  boards: Board[];
  onSelectBoard: (board: Board) => void;
  onCreateBoard?: (data: { name: string; description?: string }) => void;
}

const BoardList: React.FC<BoardListProps> = ({
  boards,
  onSelectBoard,
  onCreateBoard,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate | null>(null);

  const activeBoards = boards.filter((b) => !b.isArchived);
  const archivedBoards = boards.filter((b) => b.isArchived);

  const handleCreate = () => {
    if (!newBoardName.trim()) return;

    onCreateBoard?.({
      name: newBoardName,
      description: newBoardDescription || undefined,
    });

    setNewBoardName('');
    setNewBoardDescription('');
    setIsCreating(false);
  };

  const BoardCard: React.FC<{ board: Board }> = ({ board }) => (
    <Card
      hoverable
      className="cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 glass border-2"
      onClick={() => onSelectBoard(board)}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              📊 {board.name}
              {board.isArchived && (
                <span className="text-sm">📦</span>
              )}
            </CardTitle>
            {board.description && (
              <CardDescription className="mt-2 line-clamp-2 text-sm">
                {board.description}
              </CardDescription>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-accent/20"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Toggle favorite
            }}
          >
            ⭐
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span>📋</span>
                <span>{board.columns?.length || 0} columns</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span>✅</span>
                <span>{(board as any)._count?.tasks || board.tasks?.length || 0} tasks</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            🕐 Updated {formatDate(board.updatedAt)}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              📋 Your Boards
            </h1>
            <p className="text-muted-foreground">Organize your tasks and boost productivity</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowTemplates(true)} variant="outline" className="glass">
              <Sparkles className="h-5 w-5 mr-2" />
              📋 Use Template
            </Button>
            <Button onClick={() => setIsCreating(true)} className="gradient-warm text-white shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-5 w-5 mr-2" />
              ✨ Create Board
            </Button>
          </div>
        </div>
      </div>

      {/* Active Boards */}
      {activeBoards.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            🚀 Active Boards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </div>
      )}

      {/* Archived Boards */}
      {archivedBoards.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            📦 Archived Boards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {archivedBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {boards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="glass rounded-3xl p-12 max-w-md">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold mb-3">No boards yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first board to get started with task management and boost your productivity! 🚀
            </p>
            <Button onClick={() => setIsCreating(true)} className="gradient-warm text-white shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              ✨ Create Your First Board
            </Button>
          </div>
        </div>
      )}

      {/* Board Templates Modal */}
      <BoardTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={(template) => {
          setSelectedTemplate(template);
          setNewBoardName(template.name);
          setNewBoardDescription(template.description);
          setIsCreating(true);
        }}
      />

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setSelectedTemplate(null);
          setNewBoardName('');
          setNewBoardDescription('');
        }}
        title={selectedTemplate ? `✨ Create ${selectedTemplate.emoji} ${selectedTemplate.name}` : "✨ Create New Board"}
        description={selectedTemplate ? `Using ${selectedTemplate.name} template` : "Create a new board to organize your tasks and boost productivity"}
        size="md"
      >
        <div className="space-y-5">
          <Input
            label="📝 Board Name"
            placeholder="e.g., Project Roadmap, Sprint Planning..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            autoFocus
          />

          <Textarea
            label="📄 Description (Optional)"
            placeholder="What will you track on this board?"
            value={newBoardDescription}
            onChange={(e) => setNewBoardDescription(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              ❌ Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newBoardName.trim()} className="gradient-warm text-white">
              ✅ Create Board
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoardList;

