import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConflictResolution } from './ConflictResolution';
import { AuthProvider } from '../contexts/AuthContext';

// Default mock data
const defaultMockData = [
  {
    id: '1',
    template_id: 'template-123',
    user_id: 'user-456',
    conflict_type: 'edit',
    original_content: { text: 'Original content' },
    conflicting_content: { text: 'Conflicting content' },
    resolved: false,
    created_at: new Date().toISOString(),
    user: {
      email: 'other@user.com',
      full_name: 'Other User'
    }
  }
];

// Mock Supabase - moved inside jest.mock to fix initialization issue
jest.mock('../lib/supabase', () => {
  const mockData = [
    {
      id: '1',
      template_id: 'template-123',
      user_id: 'user-456',
      conflict_type: 'edit',
      original_content: { text: 'Original content' },
      conflicting_content: { text: 'Conflicting content' },
      resolved: false,
      created_at: new Date().toISOString(),
      user: {
        email: 'other@user.com',
        full_name: 'Other User'
      }
    }
  ];
  
  // Create proper chainable mock
  const createQueryChain = (data: any) => {
    const chain = {
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data, error: null }))
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data, error: null }))
      }))
    };
    
    return chain;
  };
  
  const mockSupabaseClient = {
    from: jest.fn((table: string) => {
      if (table === 'collaboration_conflicts') {
        return createQueryChain(mockData);
      }
      return createQueryChain([]);
    }),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn()
    })),
    removeChannel: jest.fn()
  };
  
  return {
    supabase: mockSupabaseClient
  };
});

// Mock useAuth
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123', email: 'test@user.com' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('ConflictResolution', () => {
  const mockProps = {
    templateId: 'template-123',
    onConflictResolved: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked supabase and configure it
    const { supabase } = require('../lib/supabase');
    
    const mockData = [
      {
        id: '1',
        template_id: 'template-123',
        user_id: 'user-456',
        conflict_type: 'edit',
        original_content: { text: 'Original content' },
        conflicting_content: { text: 'Conflicting content' },
        resolved: false,
        created_at: new Date().toISOString(),
        user: {
          email: 'other@user.com',
          full_name: 'Other User'
        }
      }
    ];
    
    // Setup the from method to return the proper chain
    supabase.from.mockImplementation((table: string) => {
      if (table === 'collaboration_conflicts') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ data: mockData, error: null }))
              }))
            }))
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: mockData, error: null }))
          }))
        };
      }
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
    });
    
    // Setup channel mock
    supabase.channel.mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn()
    });
  });

  it('renders no conflicts state when empty', async () => {
    // Override mock for this test
    const { supabase } = require('../lib/supabase');
    supabase.from.mockImplementationOnce((table: string) => {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      };
    });

    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No conflicts detected')).toBeInTheDocument();
    });
  });

  it('displays conflicts list when conflicts exist', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Edit Conflicts/)).toBeInTheDocument();
      // Check for the conflict type text - it's rendered as "edit Conflict" with capitalize
      expect(screen.getByText(/edit Conflict/i)).toBeInTheDocument();
      expect(screen.getByText(/Other User/)).toBeInTheDocument();
    });
  });

  it('opens conflict resolution modal when conflict is clicked', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Conflict')).toBeInTheDocument();
    });

    const conflictItem = screen.getByText('Edit Conflict').closest('div')?.parentElement;
    if (conflictItem) {
      fireEvent.click(conflictItem);
    }

    await waitFor(() => {
      expect(screen.getByText('Resolve Conflict')).toBeInTheDocument();
      expect(screen.getByText('Your Version')).toBeInTheDocument();
      expect(screen.getByText('Their Version')).toBeInTheDocument();
    });
  });

  it('switches between resolution options', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      const conflictItem = screen.getByText('Edit Conflict').closest('div')?.parentElement;
      if (conflictItem) {
        fireEvent.click(conflictItem);
      }
    });

    await waitFor(() => {
      expect(screen.getByText('Keep Yours')).toBeInTheDocument();
    });

    const keepTheirsButton = screen.getByText('Keep Theirs');
    fireEvent.click(keepTheirsButton);
    expect(keepTheirsButton.className).toContain('bg-orange-600');

    const mergeButton = screen.getByText('Merge Both');
    fireEvent.click(mergeButton);
    expect(mergeButton.className).toContain('bg-purple-600');
    
    // Manual merge editor should appear
    expect(screen.getByText('Manual Merge:')).toBeInTheDocument();
  });

  it('resolves conflict when clicking resolve button', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      const conflictItem = screen.getByText('Edit Conflict').closest('div')?.parentElement;
      if (conflictItem) {
        fireEvent.click(conflictItem);
      }
    });

    await waitFor(() => {
      expect(screen.getByText('Resolve Conflict')).toBeInTheDocument();
    });

    const resolveButton = screen.getByRole('button', { name: /Resolve Conflict/i });
    fireEvent.click(resolveButton);

    await waitFor(() => {
      expect(mockProps.onConflictResolved).toHaveBeenCalledWith(
        '1',
        { text: 'Original content' }
      );
    });
  });

  it('allows editing merged content in merge mode', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      const conflictItem = screen.getByText('Edit Conflict').closest('div')?.parentElement;
      if (conflictItem) {
        fireEvent.click(conflictItem);
      }
    });

    await waitFor(() => {
      const mergeButton = screen.getByText('Merge Both');
      fireEvent.click(mergeButton);
    });

    const textarea = screen.getByPlaceholderText('Edit the merged content...');
    fireEvent.change(textarea, { target: { value: 'Custom merged content' } });
    expect(textarea).toHaveValue('Custom merged content');
  });

  it('closes modal when cancel is clicked', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      const conflictItem = screen.getByText('Edit Conflict').closest('div')?.parentElement;
      if (conflictItem) {
        fireEvent.click(conflictItem);
      }
    });

    await waitFor(() => {
      expect(screen.getByText('Resolve Conflict')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Resolve Conflict')).not.toBeInTheDocument();
    });
  });
});