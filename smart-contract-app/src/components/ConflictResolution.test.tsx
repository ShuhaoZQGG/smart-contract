import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConflictResolution } from './ConflictResolution';
import { supabase } from '../lib/supabase';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: null
            }))
          }))
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

describe('ConflictResolution', () => {
  const mockTemplateId = 'test-template-123';
  const mockOnResolution = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without conflicts', async () => {
    render(
      <ConflictResolution 
        templateId={mockTemplateId} 
        onResolution={mockOnResolution}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No Conflicts')).toBeInTheDocument();
      expect(screen.getByText(/All collaborators are in sync/)).toBeInTheDocument();
    });
  });

  it('displays conflicts when present', async () => {
    const mockConflicts = [
      {
        id: 'conflict-1',
        template_id: mockTemplateId,
        user_id: 'user-1',
        conflict_type: 'edit',
        original_content: { text: 'Original text' },
        conflicting_content: { text: 'Conflicting text' },
        resolved: false,
        created_at: new Date().toISOString(),
        user: {
          email: 'user@example.com'
        }
      }
    ];

    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: mockConflicts,
              error: null
            }))
          }))
        }))
      }))
    });

    render(
      <ConflictResolution 
        templateId={mockTemplateId} 
        onResolution={mockOnResolution}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Conflict Resolution/)).toBeInTheDocument();
      expect(screen.getByText('edit Conflict')).toBeInTheDocument();
      expect(screen.getByText('by user@example.com')).toBeInTheDocument();
    });
  });

  it('allows reviewing conflict details', async () => {
    const mockConflict = {
      id: 'conflict-1',
      template_id: mockTemplateId,
      user_id: 'user-1',
      conflict_type: 'edit',
      original_content: { text: 'Original text' },
      conflicting_content: { text: 'Conflicting text' },
      resolved: false,
      created_at: new Date().toISOString(),
      user: {
        email: 'user@example.com'
      }
    };

    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({
              data: [mockConflict],
              error: null
            }))
          }))
        }))
      }))
    });

    render(
      <ConflictResolution 
        templateId={mockTemplateId} 
        onResolution={mockOnResolution}
      />
    );

    await waitFor(() => {
      const reviewButton = screen.getByText('Review');
      fireEvent.click(reviewButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Original Content')).toBeInTheDocument();
      expect(screen.getByText('Conflicting Content')).toBeInTheDocument();
      expect(screen.getByText('Keep Original')).toBeInTheDocument();
      expect(screen.getByText('Keep Conflicting')).toBeInTheDocument();
      expect(screen.getByText('Auto Merge')).toBeInTheDocument();
    });
  });

  it('changes merge strategy', async () => {
    render(
      <ConflictResolution 
        templateId={mockTemplateId} 
        onResolution={mockOnResolution}
      />
    );

    await waitFor(() => {
      const strategySelect = screen.getByRole('combobox');
      expect(strategySelect).toHaveValue('manual');
      
      fireEvent.change(strategySelect, { target: { value: 'mine' } });
      expect(strategySelect).toHaveValue('mine');
      
      fireEvent.change(strategySelect, { target: { value: 'theirs' } });
      expect(strategySelect).toHaveValue('theirs');
    });
  });
});