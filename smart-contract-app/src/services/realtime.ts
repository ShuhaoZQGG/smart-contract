import { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface PresenceUser {
  id: string;
  name: string;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
  color: string;
}

export interface CollaborationEdit {
  id: string;
  userId: string;
  templateId: string;
  content: string;
  timestamp: number;
  type: 'insert' | 'delete' | 'replace';
  position?: number;
  length?: number;
}

class RealtimeCollaborationService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#FDA7DF'
  ];

  async joinTemplate(
    templateId: string, 
    userId: string, 
    userName: string,
    onPresenceUpdate: (users: PresenceUser[]) => void,
    onContentUpdate: (edit: CollaborationEdit) => void
  ): Promise<RealtimeChannel> {
    const channelName = `template:${templateId}`;
    
    // Clean up existing channel if any
    if (this.channels.has(channelName)) {
      await this.leaveTemplate(templateId);
    }

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: userId,
        },
        broadcast: {
          self: false,
        },
      },
    });

    // Set up presence tracking
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = this.parsePresenceState(state);
        onPresenceUpdate(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      });

    // Set up broadcast for content updates
    channel.on('broadcast', { event: 'content_update' }, ({ payload }) => {
      if (payload && payload.userId !== userId) {
        onContentUpdate(payload as CollaborationEdit);
      }
    });

    // Subscribe to the channel
    await channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Track user presence
        await channel.track({
          id: userId,
          name: userName,
          color: this.getUserColor(userId),
          online_at: new Date().toISOString(),
        });
      }
    });

    this.channels.set(channelName, channel);
    return channel;
  }

  async leaveTemplate(templateId: string): Promise<void> {
    const channelName = `template:${templateId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.untrack();
      await supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  async broadcastEdit(templateId: string, edit: CollaborationEdit): Promise<void> {
    const channelName = `template:${templateId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'content_update',
        payload: edit,
      });
    }
  }

  async updateCursor(templateId: string, userId: string, cursor: { x: number; y: number }): Promise<void> {
    const channelName = `template:${templateId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.track({ cursor });
    }
  }

  async updateSelection(templateId: string, userId: string, selection: { start: number; end: number }): Promise<void> {
    const channelName = `template:${templateId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.track({ selection });
    }
  }

  private parsePresenceState(state: RealtimePresenceState): PresenceUser[] {
    const users: PresenceUser[] = [];
    
    Object.entries(state).forEach(([key, presences]) => {
      if (presences && presences.length > 0) {
        const presence = presences[0] as any;
        users.push({
          id: presence.id || key,
          name: presence.name || 'Anonymous',
          cursor: presence.cursor,
          selection: presence.selection,
          color: presence.color || this.getUserColor(key),
        });
      }
    });

    return users;
  }

  private getUserColor(userId: string): string {
    // Generate consistent color based on user ID
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.userColors[hash % this.userColors.length];
  }

  // Conflict resolution for simultaneous edits
  resolveConflict(localEdit: CollaborationEdit, remoteEdit: CollaborationEdit): CollaborationEdit[] {
    // Create copies to avoid mutating original edits
    const localCopy = { ...localEdit };
    const remoteCopy = { ...remoteEdit };
    
    // Adjust positions based on which edit came first
    if (remoteCopy.timestamp < localCopy.timestamp) {
      // Remote edit happened first, adjust local edit position
      if (remoteCopy.type === 'insert' && localCopy.position && remoteCopy.position) {
        if (remoteCopy.position <= localCopy.position) {
          localCopy.position += remoteCopy.length || 0;
        }
      } else if (remoteCopy.type === 'delete' && localCopy.position && remoteCopy.position) {
        if (remoteCopy.position < localCopy.position) {
          localCopy.position = Math.max(0, localCopy.position - (remoteCopy.length || 0));
        }
      }
      return [remoteCopy, localCopy];
    } else {
      // Local edit happened first, adjust remote edit position
      if (localCopy.type === 'insert' && remoteCopy.position && localCopy.position) {
        if (localCopy.position <= remoteCopy.position) {
          remoteCopy.position += localCopy.length || 0;
        }
      } else if (localCopy.type === 'delete' && remoteCopy.position && localCopy.position) {
        if (localCopy.position < remoteCopy.position) {
          remoteCopy.position = Math.max(0, remoteCopy.position - (localCopy.length || 0));
        }
      }
      return [localCopy, remoteCopy];
    }
  }

  // Get all active users in a template
  async getActiveUsers(templateId: string): Promise<PresenceUser[]> {
    const channelName = `template:${templateId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      const state = channel.presenceState();
      return this.parsePresenceState(state);
    }
    
    return [];
  }

  // Clean up all channels
  async cleanup(): Promise<void> {
    for (const [channelName, channel] of this.channels) {
      await channel.untrack();
      await supabase.removeChannel(channel);
    }
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeCollaborationService();