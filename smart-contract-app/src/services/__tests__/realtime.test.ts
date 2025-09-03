// Create a properly chained mock channel
const createMockChannel = () => {
  const mockChannel: any = {
    on: jest.fn(),
    subscribe: jest.fn(),
    track: jest.fn(),
    untrack: jest.fn(),
    send: jest.fn(),
    presenceState: jest.fn(),
  };
  
  // Make on() chainable - it should return itself
  mockChannel.on.mockImplementation(() => mockChannel);
  
  return mockChannel;
};

// Create the initial mock channel
let mockChannel = createMockChannel();

// Mock the supabase module
jest.mock('../../lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => mockChannel),
    removeChannel: jest.fn(),
  },
}));

import { realtimeService, CollaborationEdit } from '../realtime';

// Get the mocked supabase for assertions
const mockSupabase = require('../../lib/supabase').supabase;

describe('RealtimeCollaborationService', () => {
  beforeEach(async () => {
    // Clean up any existing channels in the service
    await realtimeService.cleanup();
    
    // Create a fresh mock channel for each test
    mockChannel = createMockChannel();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Track multiple channels for tests that need them
    const channels = new Map();
    
    // Ensure channel returns appropriate mock for each channel name
    mockSupabase.channel.mockImplementation((name: string) => {
      if (!channels.has(name)) {
        const newChannel = createMockChannel();
        // Setup default implementations for the new channel
        newChannel.subscribe.mockImplementation(async (callback: any) => {
          if (typeof callback === 'function') {
            callback('SUBSCRIBED');
          }
          return Promise.resolve();
        });
        newChannel.track.mockResolvedValue(undefined);
        newChannel.untrack.mockResolvedValue(undefined);
        newChannel.send.mockResolvedValue(undefined);
        newChannel.presenceState.mockReturnValue({});
        newChannel.on.mockReturnValue(newChannel);
        
        channels.set(name, newChannel);
        // Also set as default mockChannel for first channel
        if (channels.size === 1) {
          mockChannel = newChannel;
        }
      }
      return channels.get(name);
    });

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
    
    // Make sure on() is chainable
    mockChannel.on.mockReturnValue(mockChannel);
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

      // Store the channel first
      let testChannel: any;
      mockSupabase.channel.mockImplementation((name: string) => {
        testChannel = createMockChannel();
        testChannel.subscribe.mockImplementation(async (callback: any) => {
          if (typeof callback === 'function') {
            callback('SUBSCRIBED');
          }
          return Promise.resolve();
        });
        testChannel.track.mockResolvedValue(undefined);
        testChannel.untrack.mockResolvedValue(undefined);
        testChannel.send.mockResolvedValue(undefined);
        testChannel.on.mockReturnValue(testChannel);
        
        // Mock presence state for this test
        testChannel.presenceState.mockReturnValue({
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
        
        return testChannel;
      });

      await realtimeService.joinTemplate(
        'test-template',
        'current-user',
        'Current User',
        onPresenceUpdate,
        onContentUpdate
      );

      // Find the presence sync handler
      const presenceHandlers = testChannel.on.mock.calls.filter(
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

      // Local edit happened first (older timestamp), so it should come first
      expect(resolved[0]).toMatchObject(localEdit);
      expect(resolved[1]).toMatchObject(remoteEdit);
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
      
      // Store channel reference
      let testChannel: any;
      mockSupabase.channel.mockImplementation((name: string) => {
        testChannel = createMockChannel();
        testChannel.subscribe.mockImplementation(async (callback: any) => {
          if (typeof callback === 'function') {
            callback('SUBSCRIBED');
          }
          return Promise.resolve();
        });
        testChannel.track.mockResolvedValue(undefined);
        testChannel.untrack.mockResolvedValue(undefined);
        testChannel.send.mockResolvedValue(undefined);
        testChannel.on.mockReturnValue(testChannel);
        
        // Mock presence state
        testChannel.presenceState.mockReturnValue({
          'user-1': [{
            id: 'user-1',
            name: 'Active User',
            color: '#FF6B6B',
          }],
        });
        
        return testChannel;
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

      // Clear previous calls
      mockSupabase.removeChannel.mockClear();

      await realtimeService.cleanup();

      // Verify removeChannel was called for each channel
      expect(mockSupabase.removeChannel).toHaveBeenCalledTimes(2);
    });
  });
});