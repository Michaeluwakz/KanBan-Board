'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Mail, Crown, Shield, Eye, X } from 'lucide-react';
import { Board, BoardRole } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { SelectOption } from '@/components/ui/Select';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface TeamManagementProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  onInviteMember?: (email: string, role: BoardRole) => void;
  onUpdateMemberRole?: (memberId: string, role: BoardRole) => void;
  onRemoveMember?: (memberId: string) => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({
  board,
  isOpen,
  onClose,
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<BoardRole>('MEMBER');

  const roleOptions: SelectOption[] = [
    { value: 'VIEWER', label: '👁️ Viewer - Can only view' },
    { value: 'MEMBER', label: '👤 Member - Can edit tasks' },
    { value: 'ADMIN', label: '🛡️ Admin - Can manage board' },
    { value: 'OWNER', label: '👑 Owner - Full control' },
  ];

  const getRoleIcon = (role: BoardRole) => {
    switch (role) {
      case 'OWNER': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'ADMIN': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'MEMBER': return <Users className="h-4 w-4 text-green-500" />;
      case 'VIEWER': return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleEmoji = (role: BoardRole) => {
    switch (role) {
      case 'OWNER': return '👑';
      case 'ADMIN': return '🛡️';
      case 'MEMBER': return '👤';
      case 'VIEWER': return '👁️';
    }
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    onInviteMember?.(inviteEmail, inviteRole);
    setInviteEmail('');
    setInviteRole('MEMBER');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👥 Team Members"
      description={`Manage who has access to ${board.name}`}
      size="xl"
    >
      <div className="space-y-8">
        {/* Invite new member */}
        <div className="glass p-6 rounded-2xl border-2 border-primary/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite Team Member
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <div className="relative z-50">
                <Select
                  options={roleOptions}
                  value={inviteRole}
                  onChange={(value) => setInviteRole(value as BoardRole)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleInvite} 
              disabled={!inviteEmail.trim()} 
              className="gradient-warm text-white"
            >
              📨 Send Invite
            </Button>
          </div>
        </div>

        {/* Current members */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Members ({board.members?.length || 0})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {board.members?.map((member) => (
              <div
                key={member.id}
                className="glass p-4 rounded-xl border flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar
                    src={member.user?.image}
                    name={member.user?.name || member.user?.email || ''}
                    size="md"
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {member.user?.name || 'Unknown User'}
                      <span className="text-xl">{getRoleEmoji(member.role)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-semibold px-3 py-1',
                      member.role === 'OWNER' && 'bg-yellow-50 text-yellow-700 border-yellow-200',
                      member.role === 'ADMIN' && 'bg-blue-50 text-blue-700 border-blue-200',
                      member.role === 'MEMBER' && 'bg-green-50 text-green-700 border-green-200',
                      member.role === 'VIEWER' && 'bg-gray-50 text-gray-700 border-gray-200'
                    )}
                  >
                    {getRoleIcon(member.role)}
                    <span className="ml-2">{member.role}</span>
                  </Badge>

                  {member.role !== 'OWNER' && (
                    <div className="flex gap-2">
                      <div className="relative z-40">
                        <Select
                          options={roleOptions}
                          value={member.role}
                          onChange={(value) => onUpdateMemberRole?.(member.id, value as BoardRole)}
                          className="w-32 text-xs"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (window.confirm(`Remove ${member.user?.name || 'this member'}?`)) {
                            onRemoveMember?.(member.id);
                          }
                        }}
                        className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role descriptions */}
        <div className="glass p-4 rounded-xl border">
          <h4 className="font-semibold mb-3">📋 Role Permissions</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span>👁️</span>
              <div>
                <strong>Viewer:</strong> Can only view boards and tasks
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>👤</span>
              <div>
                <strong>Member:</strong> Can create, edit, and move tasks
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>🛡️</span>
              <div>
                <strong>Admin:</strong> Can manage columns, labels, and invite members
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>👑</span>
              <div>
                <strong>Owner:</strong> Full control including board deletion
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TeamManagement;

