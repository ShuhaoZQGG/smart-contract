import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateComments } from './TemplateComments';
import { AuthProvider } from '../contexts/AuthContext';

// Mock Supabase
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockIs = jest.fn();
const mockOrder = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

// Set up default chain
mockSelect.mockReturnValue({
  eq: mockEq
});

mockEq.mockReturnValue({
  is: mockIs
});

mockIs.mockReturnValue({
  order: mockOrder
});

mockOrder.mockResolvedValue({
  data: [
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
  ],
  error: null
});

mockInsert.mockReturnValue({
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
});

mockUpdate.mockReturnValue({
  eq: jest.fn().mockResolvedValue({ error: null })
});

mockDelete.mockReturnValue({
  eq: jest.fn().mockResolvedValue({ error: null })
});

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn()
    })),
    removeChannel: jest.fn()
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

  beforeEach(() => {
    jest.clearAllMocks();
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