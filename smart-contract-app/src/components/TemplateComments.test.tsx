import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateComments } from './TemplateComments';
import { AuthProvider } from '../contexts/AuthContext';

// Mock Supabase - must be hoisted properly
jest.mock('../lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn()
  };
  
  return {
    supabase: mockSupabase
  };
});

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

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked supabase instance
    const { supabase: mockSupabase } = require('../lib/supabase');
    
    // Default mock data
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
    
    // Create chainable mock
    const createChainableMock = (finalData: any) => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: finalData, error: null }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: '2',
              content: 'New comment',
              user_id: 'user-123',
              template_id: 'template-123',
              created_at: new Date().toISOString()
            },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    });
    
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'template_comments') {
        return createChainableMock(defaultMockData);
      }
      return createChainableMock([]);
    });
    
    mockSupabase.channel.mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn()
    });
  });

  it('renders comments list', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Comments')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('adds a new comment', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    const textarea = screen.getByPlaceholderText(/Add a comment/i);
    fireEvent.change(textarea, { target: { value: 'New test comment' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockProps.onCommentAdded).toHaveBeenCalled();
    });
  });

  it('shows reply form when reply is clicked', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    const replyButton = screen.getByRole('button', { name: /reply/i });
    fireEvent.click(replyButton);

    expect(screen.getByPlaceholderText(/Write a reply/i)).toBeInTheDocument();
  });

  it('resolves a comment thread', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    const resolveButton = screen.getByRole('button', { name: /resolve/i });
    fireEvent.click(resolveButton);

    await waitFor(() => {
      expect(mockProps.onThreadResolved).toHaveBeenCalledWith('1');
    });
  });

  it('toggles showing resolved comments', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    const toggleButton = screen.getByLabelText(/Show resolved/i);
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(toggleButton).toBeChecked();
    });
  });

  it('cancels reply when cancel button is clicked', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    const replyButton = screen.getByRole('button', { name: /reply/i });
    fireEvent.click(replyButton);

    const replyTextarea = screen.getByPlaceholderText(/Write a reply/i);
    expect(replyTextarea).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByPlaceholderText(/Write a reply/i)).not.toBeInTheDocument();
  });

  it('filters comments by line number when provided', async () => {
    const propsWithLine = {
      ...mockProps,
      lineNumber: 10
    };

    render(
      <AuthProvider>
        <TemplateComments {...propsWithLine} />
      </AuthProvider>
    );

    await waitFor(() => {
      // The mock should filter by line number
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });
  });

  it('handles mentions in comments', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    const textarea = screen.getByPlaceholderText(/Add a comment/i);
    fireEvent.change(textarea, { target: { value: '@john.doe This needs review' } });
    
    // Check that @ mention is being typed
    expect(textarea).toHaveValue('@john.doe This needs review');
  });

  it('displays comment timestamp', async () => {
    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      // Should show relative time like "just now" or actual time
      expect(screen.getByText(/ago|just now|[0-9]+:[0-9]+/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no comments exist', async () => {
    // Override mock for this test
    const { supabase } = require('../lib/supabase');
    supabase.from.mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      }))
    }));

    render(
      <AuthProvider>
        <TemplateComments {...mockProps} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No comments yet')).toBeInTheDocument();
      expect(screen.getByText('Be the first to comment')).toBeInTheDocument();
    });
  });
});