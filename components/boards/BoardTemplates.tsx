'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  columns: { name: string; color: string; emoji: string }[];
}

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: 'software-dev',
    name: 'Software Development',
    description: 'Complete software development workflow',
    emoji: '💻',
    columns: [
      { name: 'Backlog', color: '#94a3b8', emoji: '📋' },
      { name: 'To Do', color: '#60a5fa', emoji: '📝' },
      { name: 'In Development', color: '#fbbf24', emoji: '⚡' },
      { name: 'Code Review', color: '#a78bfa', emoji: '👀' },
      { name: 'Testing', color: '#f59e0b', emoji: '🧪' },
      { name: 'Done', color: '#34d399', emoji: '✅' },
    ],
  },
  {
    id: 'bug-tracking',
    name: 'Bug Tracking',
    description: 'Track and resolve bugs efficiently',
    emoji: '🐛',
    columns: [
      { name: 'Reported', color: '#ef4444', emoji: '🚨' },
      { name: 'Investigating', color: '#f59e0b', emoji: '🔍' },
      { name: 'In Progress', color: '#fbbf24', emoji: '⚡' },
      { name: 'Testing Fix', color: '#a78bfa', emoji: '🧪' },
      { name: 'Verified', color: '#10b981', emoji: '✅' },
      { name: 'Closed', color: '#6b7280', emoji: '📦' },
    ],
  },
  {
    id: 'agile-sprint',
    name: 'Agile Sprint',
    description: 'Sprint planning and execution',
    emoji: '🏃',
    columns: [
      { name: 'Sprint Backlog', color: '#94a3b8', emoji: '📋' },
      { name: 'To Do', color: '#60a5fa', emoji: '📝' },
      { name: 'In Progress', color: '#fbbf24', emoji: '⚡' },
      { name: 'In Review', color: '#a78bfa', emoji: '👀' },
      { name: 'Done', color: '#34d399', emoji: '✅' },
      { name: 'Blocked', color: '#ef4444', emoji: '🚫' },
    ],
  },
  {
    id: 'testing-qa',
    name: 'Testing & QA',
    description: 'Quality assurance workflow',
    emoji: '🧪',
    columns: [
      { name: 'Test Cases', color: '#60a5fa', emoji: '📝' },
      { name: 'Ready for Testing', color: '#fbbf24', emoji: '⏱️' },
      { name: 'In Testing', color: '#f59e0b', emoji: '🔬' },
      { name: 'Failed', color: '#ef4444', emoji: '❌' },
      { name: 'Passed', color: '#34d399', emoji: '✅' },
      { name: 'Approved', color: '#10b981', emoji: '🎉' },
    ],
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Product development and launch',
    emoji: '🚀',
    columns: [
      { name: 'Ideas', color: '#a78bfa', emoji: '💡' },
      { name: 'Planning', color: '#60a5fa', emoji: '📋' },
      { name: 'Development', color: '#fbbf24', emoji: '⚡' },
      { name: 'Beta Testing', color: '#f59e0b', emoji: '🧪' },
      { name: 'Ready to Launch', color: '#10b981', emoji: '🚀' },
      { name: 'Launched', color: '#34d399', emoji: '🎉' },
    ],
  },
  {
    id: 'custom',
    name: 'Blank Board',
    description: 'Start from scratch',
    emoji: '📝',
    columns: [
      { name: 'To Do', color: '#60a5fa', emoji: '📝' },
      { name: 'In Progress', color: '#fbbf24', emoji: '⚡' },
      { name: 'Done', color: '#34d399', emoji: '✅' },
    ],
  },
];

export interface BoardTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: BoardTemplate) => void;
}

const BoardTemplates: React.FC<BoardTemplatesProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📋 Choose a Board Template"
      description="Select a template to get started quickly"
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BOARD_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            hoverable
            onClick={() => {
              onSelectTemplate(template);
              onClose();
            }}
            className="cursor-pointer glass border-2 hover:border-primary/50 hover:shadow-xl transition-all p-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{template.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  Columns ({template.columns.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.columns.map((column, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: column.color + '20',
                        color: column.color,
                        border: `1px solid ${column.color}40`,
                      }}
                    >
                      <span>{column.emoji}</span>
                      <span>{column.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

export default BoardTemplates;


