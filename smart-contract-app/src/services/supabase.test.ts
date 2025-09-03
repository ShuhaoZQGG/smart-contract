import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          limit: jest.fn(),
        })),
        order: jest.fn(),
      })),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
    functions: {
      invoke: jest.fn(),
    },
  })),
}));

describe('Supabase Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create supabase client with correct URL and key', () => {
    expect(createClient).toHaveBeenCalledWith(
      expect.stringContaining('supabase.co'),
      expect.any(String)
    );
  });

  test('should have auth methods available', () => {
    expect(supabase.auth).toBeDefined();
    expect(supabase.auth.getSession).toBeDefined();
    expect(supabase.auth.signInWithPassword).toBeDefined();
    expect(supabase.auth.signOut).toBeDefined();
  });

  test('should have database methods available', () => {
    expect(supabase.from).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });

  test('should have storage methods available', () => {
    expect(supabase.storage).toBeDefined();
    expect(supabase.storage.from).toBeDefined();
  });

  test('should have functions methods available', () => {
    expect(supabase.functions).toBeDefined();
    expect(supabase.functions.invoke).toBeDefined();
  });
});