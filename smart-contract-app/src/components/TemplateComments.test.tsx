import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateComments } from './TemplateComments';
import { useAuth } from '../contexts/AuthContext';

// Mock dependencies
jest.mock('../contexts/AuthContext');
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          })),
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          error: null
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          error: null
        }))
      }))
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn()
      }))
    })),
    removeChannel: jest.fn()
  }
}));

describe('TemplateComments', () => {
  const mockTemplateId = 'test-template-123';
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders empty state when no comments', async () => {
    render(<TemplateComments templateId={mockTemplateId} />);

    await waitFor(() => {
      expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
    });
  });

  it('displays comment input when user is authenticated', async () => {
    render(<TemplateComments templateId={mockTemplateId} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    });
  });

  it('hides comment input when user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<TemplateComments templateId={mockTemplateId} />);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
    });
  });

  it('displays comments with user info', async () => {
    const mockComments = [
      {
        id: 'comment-1',
        template_id: mockTemplateId,
        user_id: 'user-1',
        content: 'This is a test comment',
        resolved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          email: 'commenter@example.com',
          full_name: 'John Doe'
        },
        replies: []
      }
    ];

    const { supabase } = require('../lib/supabase');
    supabase.from.mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockComments,
              error: null
            }))
          }))
        }))
      }))
    });

    // Mock replies fetch
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        }))
      }))
    });

    render(<TemplateComments templateId={mockTemplateId} />);

    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('displays line number when provided', async () => {
    render(<TemplateComments templateId={mockTemplateId} lineNumber={42} />);

    await waitFor(() => {
      expect(screen.getByText('Comments (Line 42)')).toBeInTheDocument();
    });
  });

  it('changes filter between all and unresolved', async () => {
    render(<TemplateComments templateId={mockTemplateId} />);

    await waitFor(() => {
      const filterSelect = screen.getByRole('combobox');
      expect(filterSelect).toHaveValue('unresolved');

      fireEvent.change(filterSelect, { target: { value: 'all' } });
      expect(filterSelect).toHaveValue('all');
    });
  });

  it('shows resolved badge for resolved comments', async () => {
    const mockComments = [
      {
        id: 'comment-1',
        template_id: mockTemplateId,
        user_id: 'user-1',
        content: 'Resolved comment',
        resolved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          email: 'user@example.com'
        },
        replies: []
      }
    ];

    const { supabase } = require('../lib/supabase');
    supabase.from.mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockComments,
              error: null
            }))
          }))
        }))
      }))
    });

    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        }))
      }))
    });

    render(<TemplateComments templateId={mockTemplateId} />);

    await waitFor(() => {
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });
  });
});