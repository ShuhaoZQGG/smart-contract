import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConflictResolution from './ConflictResolution';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase');

describe('ConflictResolution', () => {
  const mockTemplateId = 'test-template-id';
  const mockUserId = 'test-user-id';
  const mockConflict = {
    id: 'conflict-1',
    template_id: mockTemplateId,
    user_id: mockUserId,
    conflict_type: 'edit',
    original_content: { text: 'Original text content' },
    conflicting_content: { text: 'Conflicting text content' },
    resolved: false,
    created_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (supabase as any).from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    }));
    
    (supabase as any).channel = jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(() => ({ status: 'SUBSCRIBED' })),
      unsubscribe: jest.fn(),
    }));
  });

  describe('Conflict Detection', () => {
    it('should detect edit conflicts in real-time', async () => {
      const mockChannel = {
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn(() => ({ status: 'SUBSCRIBED' })),
        unsubscribe: jest.fn(),
      };
      
      (supabase as any).channel = jest.fn(() => mockChannel);
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledWith(`conflicts:${mockTemplateId}`);
      });
      
      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          event: '*',
          schema: 'public',
          table: 'collaboration_conflicts',
        }),
        expect.any(Function)
      );
    });

    it('should display conflict notification when conflict occurs', async () => {
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Conflict Detected/i)).toBeInTheDocument();
      });
    });
  });

  describe('Conflict Resolution UI', () => {
    it('should show three-way merge view', async () => {
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Your Changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Their Changes/i)).toBeInTheDocument();
        expect(screen.getByText(/Original/i)).toBeInTheDocument();
      });
    });

    it('should allow selecting resolution strategy', async () => {
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Keep Mine/i)).toBeInTheDocument();
        expect(screen.getByText(/Keep Theirs/i)).toBeInTheDocument();
        expect(screen.getByText(/Merge Both/i)).toBeInTheDocument();
      });
    });

    it('should support manual merge editing', async () => {
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        const mergeButton = screen.getByText(/Manual Merge/i);
        fireEvent.click(mergeButton);
      });
      
      expect(screen.getByLabelText(/Merged Content/i)).toBeInTheDocument();
    });
  });

  describe('Resolution Actions', () => {
    it('should resolve conflict with "Keep Mine" strategy', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve({ data: null, error: null }));
      
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: mockUpdate,
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        const keepMineButton = screen.getByText(/Keep Mine/i);
        fireEvent.click(keepMineButton);
      });
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('conflict-1');
      });
    });

    it('should resolve conflict with "Keep Theirs" strategy', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve({ data: null, error: null }));
      
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: mockUpdate,
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        const keepTheirsButton = screen.getByText(/Keep Theirs/i);
        fireEvent.click(keepTheirsButton);
      });
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('conflict-1');
      });
    });

    it('should support custom merge resolution', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve({ data: null, error: null }));
      
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: [mockConflict], 
              error: null 
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: mockUpdate,
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        const manualMergeButton = screen.getByText(/Manual Merge/i);
        fireEvent.click(manualMergeButton);
      });
      
      const mergeTextarea = screen.getByLabelText(/Merged Content/i);
      fireEvent.change(mergeTextarea, { 
        target: { value: 'Custom merged content' } 
      });
      
      const saveButton = screen.getByText(/Save Merge/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith('conflict-1');
      });
    });
  });

  describe('Conflict History', () => {
    it('should display conflict resolution history', async () => {
      const resolvedConflict = {
        ...mockConflict,
        resolved: true,
        resolution: { strategy: 'keep_mine', content: 'Original text content' },
        resolved_at: '2025-01-01T01:00:00Z',
      };
      
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ 
              data: [resolvedConflict], 
              error: null 
            })),
          })),
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
          showHistory={true}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Resolution History/i)).toBeInTheDocument();
        expect(screen.getByText(/keep_mine/i)).toBeInTheDocument();
      });
    });

    it('should allow reverting a conflict resolution', async () => {
      const resolvedConflict = {
        ...mockConflict,
        resolved: true,
        resolution: { strategy: 'keep_mine', content: 'Original text content' },
        resolved_at: '2025-01-01T01:00:00Z',
      };
      
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ 
              data: [resolvedConflict], 
              error: null 
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      }));
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
          showHistory={true}
        />
      );
      
      await waitFor(() => {
        const revertButton = screen.getByText(/Revert/i);
        fireEvent.click(revertButton);
      });
      
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('collaboration_conflicts');
      });
    });
  });

  describe('Collaboration Features', () => {
    it('should show who is currently editing', async () => {
      const mockPresence = {
        user_id: 'other-user-id',
        user_name: 'John Doe',
        cursor_position: 100,
        active_section: 'introduction',
      };
      
      const mockChannel = {
        on: jest.fn((event, callback) => {
          if (event === 'presence') {
            setTimeout(() => callback({ presence: [mockPresence] }), 0);
          }
          return mockChannel;
        }),
        subscribe: jest.fn(() => ({ status: 'SUBSCRIBED' })),
        unsubscribe: jest.fn(),
        track: jest.fn(),
      };
      
      (supabase as any).channel = jest.fn(() => mockChannel);
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
          showPresence={true}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/John Doe is editing/i)).toBeInTheDocument();
      });
    });

    it('should highlight areas being edited by others', async () => {
      const mockPresence = {
        user_id: 'other-user-id',
        user_name: 'Jane Smith',
        cursor_position: 200,
        active_section: 'conclusion',
      };
      
      const mockChannel = {
        on: jest.fn((event, callback) => {
          if (event === 'presence') {
            setTimeout(() => callback({ presence: [mockPresence] }), 0);
          }
          return mockChannel;
        }),
        subscribe: jest.fn(() => ({ status: 'SUBSCRIBED' })),
        unsubscribe: jest.fn(),
        track: jest.fn(),
      };
      
      (supabase as any).channel = jest.fn(() => mockChannel);
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
          showPresence={true}
        />
      );
      
      await waitFor(() => {
        const highlightedSection = screen.getByTestId('editing-indicator-conclusion');
        expect(highlightedSection).toHaveClass('editing-by-others');
      });
    });
  });

  describe('Performance', () => {
    it('should handle multiple conflicts efficiently', async () => {
      const multipleConflicts = Array(10).fill(null).map((_, index) => ({
        ...mockConflict,
        id: `conflict-${index}`,
      }));
      
      (supabase as any).from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: multipleConflicts, 
              error: null 
            })),
          })),
        })),
      }));
      
      const startTime = performance.now();
      
      render(
        <ConflictResolution 
          templateId={mockTemplateId} 
          userId={mockUserId}
        />
      );
      
      await waitFor(() => {
        expect(screen.getAllByText(/Conflict Detected/i)).toHaveLength(10);
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
    });
  });
});