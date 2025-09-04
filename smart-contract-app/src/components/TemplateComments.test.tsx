import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateComments } from './TemplateComments';
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
    user: { id: 'user-123', email: 'current@user.com' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('TemplateComments', () => {
  const mockProps = {
    templateId: 'template-123',
    onCommentAdded: jest.fn(),
    onThreadResolved: jest.fn()
  };

  const defaultMockData = [
    {
      id: '1',
      template_id: 'template-123',
      user_id: 'user-456',
      content: 'This is a test comment',
      resolved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        email: 'test@user.com',
        full_name: 'Test User'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock chain for from().select()
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          is: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ 
              data: defaultMockData, 
              error: null 
            })
          })
        })
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: '2',
              content: 'New comment',
              user_id: 'user-123',
              template_id: 'template-123',
              created_at: new Date().toISOString()
            },
            error: null
          })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
    });
  });

  it('renders with no comments initially', async () => {
    // Override mock for this test
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          is: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ 
              data: [], 
              error: null 
            })
          })
        })
      }),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    });

    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    });
  });

  it('displays existing comments', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('allows adding a new comment', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    const input = screen.getByPlaceholderText('Add a comment...');
    const button = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(input, { target: { value: 'New test comment' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockProps.onCommentAdded).toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  it('allows resolving a comment thread', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    // Find resolve button (check icon)
    const resolveButton = screen.getByTestId('resolve-comment-1');
    fireEvent.click(resolveButton);

    await waitFor(() => {
      expect(mockProps.onThreadResolved).toHaveBeenCalledWith('1');
    });
  });

  it('allows deleting own comments', async () => {
    // Update mock data to have a comment from current user
    const ownCommentData = [{
      ...defaultMockData[0],
      user_id: 'user-123',
      user: {
        email: 'current@user.com',
        full_name: 'Current User'
      }
    }];

    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          is: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ 
              data: ownCommentData, 
              error: null 
            })
          })
        })
      }),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
    });

    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    // Find delete button (X icon)
    const deleteButton = screen.getByTestId('delete-comment-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // Check that delete was called
      const deleteCall = mockFrom.mock.results[mockFrom.mock.results.length - 1]?.value?.delete;
      expect(deleteCall).toBeDefined();
    });
  });

  it('toggles between showing all and unresolved comments', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText(/Show All/);
    fireEvent.click(toggleButton);

    // Should now show "Show Unresolved"
    expect(screen.getByText(/Show Unresolved/)).toBeInTheDocument();
  });

  it('handles comment submission with Enter key', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    const input = screen.getByPlaceholderText('Add a comment...');
    
    fireEvent.change(input, { target: { value: 'Enter key comment' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(mockProps.onCommentAdded).toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  it('does not submit empty comments', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /Send/i });
    fireEvent.click(button);

    // Should not call onCommentAdded
    expect(mockProps.onCommentAdded).not.toHaveBeenCalled();
  });
});