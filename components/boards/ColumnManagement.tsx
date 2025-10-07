'use client';

import React, { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit3, Save, X } from 'lucide-react';
import { Board, Column } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface ColumnManagementProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  onAddColumn?: (name: string, color: string) => void;
  onUpdateColumn?: (columnId: string, name: string, color: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onReorderColumns?: (columns: Column[]) => void;
}

const ColumnManagement: React.FC<ColumnManagementProps> = ({
  board,
  isOpen,
  onClose,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
}) => {
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('#3B82F6');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const columnColors = [
    { name: 'Blue', value: '#3B82F6', emoji: '🔵' },
    { name: 'Green', value: '#10B981', emoji: '🟢' },
    { name: 'Yellow', value: '#F59E0B', emoji: '🟡' },
    { name: 'Red', value: '#EF4444', emoji: '🔴' },
    { name: 'Purple', value: '#8B5CF6', emoji: '🟣' },
    { name: 'Pink', value: '#EC4899', emoji: '🩷' },
    { name: 'Orange', value: '#F97316', emoji: '🟠' },
    { name: 'Teal', value: '#14B8A6', emoji: '🟦' },
  ];

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    onAddColumn?.(newColumnName.trim(), newColumnColor);
    setNewColumnName('');
    setNewColumnColor('#3B82F6');
  };

  const handleEditStart = (column: Column) => {
    setEditingColumn(column.id);
    setEditName(column.name);
    setEditColor(column.color || '#3B82F6');
  };

  const handleEditSave = () => {
    if (!editingColumn || !editName.trim()) return;
    onUpdateColumn?.(editingColumn, editName.trim(), editColor);
    setEditingColumn(null);
    setEditName('');
    setEditColor('');
  };

  const handleEditCancel = () => {
    setEditingColumn(null);
    setEditName('');
    setEditColor('');
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column? All tasks in this column will be moved to the first available column.')) {
      onDeleteColumn?.(columnId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📋 Column Management"
      description={`Manage columns for ${board.name}`}
      size="xl"
    >
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
        {/* Add new column */}
        <div className="glass p-4 rounded-2xl border-2 border-primary/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Column
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Column Name</label>
              <Input
                placeholder="e.g., In Review, Testing, Blocked"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex gap-1 flex-wrap">
                {columnColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewColumnColor(color.value)}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all',
                      newColumnColor === color.value 
                        ? 'border-foreground scale-110' 
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {newColumnColor === color.value && '✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <Button 
              onClick={handleAddColumn} 
              disabled={!newColumnName.trim()}
              className="gradient-warm text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>

        {/* Current columns */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GripVertical className="h-5 w-5" />
            Current Columns ({board.columns?.length || 0})
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {board.columns?.map((column, index) => (
              <div
                key={column.id}
                className="glass p-3 rounded-xl border flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  </div>
                  
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: column.color || '#3B82F6' }}
                  />
                  
                  {editingColumn === column.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        {columnColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setEditColor(color.value)}
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all',
                              editColor === color.value 
                                ? 'border-foreground scale-110' 
                                : 'border-transparent hover:scale-105'
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {editColor === color.value && '✓'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium">{column.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {column.tasks?.length || 0} tasks
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingColumn === column.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditSave}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStart(column)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {board.columns && board.columns.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteColumn(column.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column tips */}
        <div className="glass p-3 rounded-xl border">
          <h4 className="font-semibold mb-2">💡 Column Tips</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>• Use descriptive names like &quot;In Review&quot;, &quot;Testing&quot;, or &quot;Blocked&quot;</div>
            <div>• Choose colors that match your workflow stages</div>
            <div>• You need at least one column to organize tasks</div>
            <div>• Drag columns to reorder them in your board</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ColumnManagement;
