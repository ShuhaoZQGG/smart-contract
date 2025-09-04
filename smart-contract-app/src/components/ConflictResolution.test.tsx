import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConflictResolution } from './ConflictResolution';
import { AuthProvider } from '../contexts/AuthContext';

// Mock Supabase
jest.mock('../lib/supabase', () => {
  const mockConflicts = [
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

  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ 
                data: mockConflicts, 
                error: null 
              }))
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null }))
        }))
      })),
      channel: jest.fn(() => ({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn()
      })),
      removeChannel: jest.fn()
    }
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
  });

  it('renders without crashing', () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );
    expect(screen.getByText(/Conflicts/i)).toBeInTheDocument();
  });

  it('displays conflicts when they exist', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/edit conflict/i)).toBeInTheDocument();
      expect(screen.getByText(/other@user.com/i)).toBeInTheDocument();
    });
  });

  it('shows no conflicts message when empty', async () => {
    // Override mock to return empty data
    const { supabase } = require('../lib/supabase');
    supabase.from.mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ 
              data: [], 
              error: null 
            }))
          }))
        }))
      }))
    }));

    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No conflicts found/i)).toBeInTheDocument();
    });
  });

  it('handles conflict resolution', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      const viewButton = screen.getByText(/View Details/i);
      fireEvent.click(viewButton);
    });

    await waitFor(() => {
      const resolveButton = screen.getByText(/Keep Mine/i);
      expect(resolveButton).toBeInTheDocument();
      fireEvent.click(resolveButton);
    });

    await waitFor(() => {
      expect(mockProps.onConflictResolved).toHaveBeenCalled();
    });
  });

  it('allows switching between resolution strategies', async () => {
    render(
      <AuthProvider>
        <ConflictResolution {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      const viewButton = screen.getByText(/View Details/i);
      fireEvent.click(viewButton);
    });

    // Check resolution options are available
    await waitFor(() => {
      expect(screen.getByText(/Keep Mine/i)).toBeInTheDocument();
      expect(screen.getByText(/Keep Theirs/i)).toBeInTheDocument();
      expect(screen.getByText(/Merge Both/i)).toBeInTheDocument();
    });

    // Switch to "theirs" resolution
    const theirsOption = screen.getByLabelText(/Keep Theirs/i);
    fireEvent.click(theirsOption);

    // Verify the option is selected
    expect(theirsOption).toBeChecked();
  });
});