import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConflictResolution } from './ConflictResolution';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the supabase module
const mockFrom = jest.fn();
const mockRemoveChannel = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockFrom()),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn()
    })),
    removeChannel: mockRemoveChannel
  }
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock chain for from().select()
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ 
              data: defaultMockData, 
              error: null 
            })
          })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
    });
  });

  it('renders no conflicts state when empty', async () => {
    // Override mock for this test
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ 
              data: [], 
              error: null 
            })
          })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
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
      expect(screen.getByText('Edit Conflict')).toBeInTheDocument();
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