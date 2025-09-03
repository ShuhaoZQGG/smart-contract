// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: any) => children,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock Supabase client with complete implementation
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      onAuthStateChange: jest.fn((callback) => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
    from: jest.fn((table: string) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      limit: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
      upsert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    storage: {
      from: jest.fn((bucket: string) => ({
        upload: jest.fn(() => Promise.resolve({ data: { path: 'test-path' }, error: null })),
        download: jest.fn(() => Promise.resolve({ data: new Blob(), error: null })),
        getPublicUrl: jest.fn((path: string) => ({ 
          data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/${bucket}/${path}` },
        })),
        remove: jest.fn(() => Promise.resolve({ data: [], error: null })),
        list: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    },
    functions: {
      invoke: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    },
    channel: jest.fn((channelName: string) => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
      unsubscribe: jest.fn(),
      track: jest.fn().mockReturnThis(),
    })),
    removeChannel: jest.fn(),
    getChannels: jest.fn(() => []),
    removeAllChannels: jest.fn(),
    rpc: jest.fn(() => Promise.resolve({ data: true, error: null })),
  })),
}));

// Mock environment variables
process.env.REACT_APP_SUPABASE_URL = 'https://test.supabase.co';
process.env.REACT_APP_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as any;
