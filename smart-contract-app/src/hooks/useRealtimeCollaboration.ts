import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { realtimeService, PresenceUser, CollaborationEdit } from '../services/realtime';
import { useAuth } from '../contexts/AuthContext';

interface UseRealtimeCollaborationOptions {
  templateId: string;
  onContentChange?: (content: string) => void;
  onEditReceived?: (edit: CollaborationEdit) => void;
}

export const useRealtimeCollaboration = ({ 
  templateId, 
  onContentChange,
  onEditReceived 
}: UseRealtimeCollaborationOptions) => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [latestEdit, setLatestEdit] = useState<CollaborationEdit | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const contentRef = useRef<string>('');

  // Join template collaboration room
  useEffect(() => {
    if (!user || !templateId) return;

    const joinCollaboration = async () => {
      try {
        const channel = await realtimeService.joinTemplate(
          templateId,
          user.id,
          user.email || 'Anonymous',
          (users) => {
            setActiveUsers(users);
          },
          (edit) => {
            setLatestEdit(edit);
            applyRemoteEdit(edit);
            onEditReceived?.(edit);
          }
        );

        channelRef.current = channel;
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to join collaboration:', error);
        setIsConnected(false);
      }
    };

    joinCollaboration();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (templateId) {
        realtimeService.leaveTemplate(templateId).catch(console.error);
      }
      setIsConnected(false);
      channelRef.current = null;
    };
  }, [user, templateId, onEditReceived]);

  // Apply remote edit to content
  const applyRemoteEdit = useCallback((edit: CollaborationEdit) => {
    let newContent = contentRef.current;

    switch (edit.type) {
      case 'insert':
        if (edit.position !== undefined) {
          newContent = 
            newContent.slice(0, edit.position) + 
            edit.content + 
            newContent.slice(edit.position);
        }
        break;
      case 'delete':
        if (edit.position !== undefined && edit.length !== undefined) {
          newContent = 
            newContent.slice(0, edit.position) + 
            newContent.slice(edit.position + edit.length);
        }
        break;
      case 'replace':
        newContent = edit.content;
        break;
    }

    contentRef.current = newContent;
    onContentChange?.(newContent);
  }, [onContentChange]);

  // Broadcast local edit
  const broadcastEdit = useCallback(async (
    content: string,
    type: 'insert' | 'delete' | 'replace' = 'replace',
    position?: number,
    length?: number
  ) => {
    if (!user || !templateId) return;

    const edit: CollaborationEdit = {
      id: `${user.id}-${Date.now()}`,
      userId: user.id,
      templateId,
      content,
      timestamp: Date.now(),
      type,
      position,
      length,
    };

    contentRef.current = content;
    await realtimeService.broadcastEdit(templateId, edit);
  }, [user, templateId]);

  // Update cursor position
  const updateCursor = useCallback(async (x: number, y: number) => {
    if (!user || !templateId) return;
    await realtimeService.updateCursor(templateId, user.id, { x, y });
  }, [user, templateId]);

  // Update text selection
  const updateSelection = useCallback(async (start: number, end: number) => {
    if (!user || !templateId) return;
    await realtimeService.updateSelection(templateId, user.id, { start, end });
  }, [user, templateId]);

  // Get other users (excluding current user)
  const otherUsers = activeUsers.filter(u => u.id !== user?.id);

  return {
    activeUsers,
    otherUsers,
    isConnected,
    latestEdit,
    broadcastEdit,
    updateCursor,
    updateSelection,
  };
};