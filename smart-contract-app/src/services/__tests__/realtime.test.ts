import { realtimeService, CollaborationEdit } from '../realtime';

// Mock Supabase
const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn(),
  track: jest.fn(),
  untrack: jest.fn(),
  send: jest.fn(),
  presenceState: jest.fn(),
};

const mockSupabase = {
  channel: jest.fn(() => mockChannel),
  removeChannel: jest.fn(),
};

jest.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('RealtimeCollaborationService', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    mockChannel.subscribe.mockImplementation(async (callback: any) => {
      if (typeof callback === 'function') {
        callback('SUBSCRIBED');
      }
      return Promise.resolve();
    });
    mockChannel.track.mockResolvedValue(undefined);
    mockChannel.untrack.mockResolvedValue(undefined);
    mockChannel.send.mockResolvedValue(undefined);
    mockChannel.presenceState.mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('joinTemplate', () => {
    it('should create and subscribe to a channel for a template', async () => {
      const templateId = 'test-template-123';
      const userId = 'user-456';
      const userName = 'Test User';
      const onPresenceUpdate = jest.fn();
      const onContentUpdate = jest.fn();

      const channel = await realtimeService.joinTemplate(
        templateId,
        userId,
        userName,
        onPresenceUpdate,
        onContentUpdate
      );

      expect(mockSupabase.channel).toHaveBeenCalledWith(
        `template:${templateId}`,
        expect.objectContaining({
          config: expect.objectContaining({
            presence: { key: userId },
            broadcast: { self: false },
          }),
        })
      );

      expect(mockChannel.subscribe).toHaveBeenCalled();
      expect(mockChannel.track).toHaveBeenCalledWith(
        expect.objectContaining({
          id: userId,
          name: userName,
          color: expect.any(String),
          online_at: expect.any(String),
        })
      );
      expect(channel).toBe(mockChannel);
    });

    it('should handle presence events', async () => {
      const onPresenceUpdate = jest.fn();
      const onContentUpdate = jest.fn();

      // Mock presence state
      mockChannel.presenceState.mockReturnValue({
        'user-1': [{
          id: 'user-1',
          name: 'User One',
          color: '#FF6B6B',
        }],
        'user-2': [{
          id: 'user-2',
          name: 'User Two',
          color: '#4ECDC4',
        }],
      });

      await realtimeService.joinTemplate(
        'test-template',
        'current-user',
        'Current User',
        onPresenceUpdate,
        onContentUpdate
      );

      // Find the presence sync handler
      const presenceHandlers = mockChannel.on.mock.calls.filter(
        (call: any) => call[0] === 'presence' && call[1].event === 'sync'
      );
      
      expect(presenceHandlers.length).toBeGreaterThan(0);
      
      // Trigger the presence sync handler
      const syncHandler = presenceHandlers[0][2];
      syncHandler();

      // Verify presence update was called with parsed users
      expect(onPresenceUpdate).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'user-1',
          name: 'User One',
          color: '#FF6B6B',
        }),
        expect.objectContaining({
          id: 'user-2',
          name: 'User Two',
          color: '#4ECDC4',
        }),
      ]);
    });
  });

  describe('leaveTemplate', () => {
    it('should untrack and remove channel when leaving', async () => {
      const templateId = 'test-template';
      
      // First join the template
      await realtimeService.joinTemplate(
        templateId,
        'user-id',
        'User Name',
        jest.fn(),
        jest.fn()
      );

      // Then leave
      await realtimeService.leaveTemplate(templateId);

      expect(mockChannel.untrack).toHaveBeenCalled();
      expect(mockSupabase.removeChannel).toHaveBeenCalledWith(mockChannel);
    });
  });

  describe('broadcastEdit', () => {
    it('should broadcast edit to channel', async () => {
      const templateId = 'test-template';
      
      // Join template first
      await realtimeService.joinTemplate(
        templateId,
        'user-id',
        'User Name',
        jest.fn(),
        jest.fn()
      );

      const edit: CollaborationEdit = {
        id: 'edit-123',
        userId: 'user-id',
        templateId,
        content: 'New content',
        timestamp: Date.now(),
        type: 'insert',
        position: 10,
        length: 11,
      };

      await realtimeService.broadcastEdit(templateId, edit);

      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'content_update',
        payload: edit,
      });
    });
  });

  describe('updateCursor', () => {
    it('should track cursor position', async () => {
      const templateId = 'test-template';
      
      await realtimeService.joinTemplate(
        templateId,
        'user-id',
        'User Name',
        jest.fn(),
        jest.fn()
      );

      await realtimeService.updateCursor(templateId, 'user-id', { x: 100, y: 200 });

      expect(mockChannel.track).toHaveBeenCalledWith({ cursor: { x: 100, y: 200 } });
    });
  });

  describe('updateSelection', () => {
    it('should track text selection', async () => {
      const templateId = 'test-template';
      
      await realtimeService.joinTemplate(
        templateId,
        'user-id',
        'User Name',
        jest.fn(),
        jest.fn()
      );

      await realtimeService.updateSelection(templateId, 'user-id', { start: 10, end: 20 });

      expect(mockChannel.track).toHaveBeenCalledWith({ selection: { start: 10, end: 20 } });
    });
  });

  describe('resolveConflict', () => {
    it('should resolve conflicts based on timestamp', () => {
      const localEdit: CollaborationEdit = {
        id: 'local-1',
        userId: 'user-1',
        templateId: 'template-1',
        content: 'Local content',
        timestamp: 1000,
        type: 'insert',
        position: 10,
      };

      const remoteEdit: CollaborationEdit = {
        id: 'remote-1',
        userId: 'user-2',
        templateId: 'template-1',
        content: 'Remote content',
        timestamp: 2000,
        type: 'insert',
        position: 5,
      };

      const resolved = realtimeService.resolveConflict(localEdit, remoteEdit);

      // Remote edit should come first (newer timestamp)
      expect(resolved[0]).toBe(remoteEdit);
      expect(resolved[1]).toBe(localEdit);
    });

    it('should adjust positions for overlapping inserts', () => {
      const localEdit: CollaborationEdit = {
        id: 'local-1',
        userId: 'user-1',
        templateId: 'template-1',
        content: 'Local',
        timestamp: 2000,
        type: 'insert',
        position: 10,
        length: 5,
      };

      const remoteEdit: CollaborationEdit = {
        id: 'remote-1',
        userId: 'user-2',
        templateId: 'template-1',
        content: 'Remote',
        timestamp: 1000,
        type: 'insert',
        position: 5,
        length: 6,
      };

      const resolved = realtimeService.resolveConflict(localEdit, remoteEdit);

      // Local edit position should be adjusted
      expect(resolved[1].position).toBe(16); // 10 + 6
    });
  });

  describe('getActiveUsers', () => {
    it('should return active users for a template', async () => {
      const templateId = 'test-template';
      
      // Mock presence state
      mockChannel.presenceState.mockReturnValue({
        'user-1': [{
          id: 'user-1',
          name: 'Active User',
          color: '#FF6B6B',
        }],
      });

      await realtimeService.joinTemplate(
        templateId,
        'current-user',
        'Current User',
        jest.fn(),
        jest.fn()
      );

      const activeUsers = await realtimeService.getActiveUsers(templateId);

      expect(activeUsers).toHaveLength(1);
      expect(activeUsers[0]).toMatchObject({
        id: 'user-1',
        name: 'Active User',
        color: '#FF6B6B',
      });
    });
  });

  describe('cleanup', () => {
    it('should clean up all channels', async () => {
      // Join multiple templates
      await realtimeService.joinTemplate('template-1', 'user', 'User', jest.fn(), jest.fn());
      await realtimeService.joinTemplate('template-2', 'user', 'User', jest.fn(), jest.fn());

      await realtimeService.cleanup();

      // Verify untrack was called for each channel
      expect(mockChannel.untrack).toHaveBeenCalledTimes(2);
      // Verify removeChannel was called for each channel
      expect(mockSupabase.removeChannel).toHaveBeenCalledTimes(2);
    });
  });
});