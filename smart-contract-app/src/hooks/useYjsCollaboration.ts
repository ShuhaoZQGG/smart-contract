import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CollaborationState {
  isConnected: boolean;
  peers: string[];
  conflicts: any[];
  doc: Y.Doc | null;
}

export const useYjsCollaboration = (templateId: string, roomName: string) => {
  const { user } = useAuth();
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    peers: [],
    conflicts: [],
    doc: null
  });

  useEffect(() => {
    if (!templateId || !user) return;

    // Initialize Yjs document
    const doc = new Y.Doc();
    docRef.current = doc;

    // Get WebSocket URL from Supabase Realtime
    const wsUrl = process.env.REACT_APP_YJS_WEBSOCKET_URL || 'ws://localhost:1234';
    
    // Create WebSocket provider for Yjs
    const provider = new WebsocketProvider(
      wsUrl,
      `template-${templateId}`,
      doc,
      {
        params: {
          userId: user.id,
          templateId
        }
      }
    );
    providerRef.current = provider;

    // Handle connection status
    provider.on('status', (event: any) => {
      setState(prev => ({
        ...prev,
        isConnected: event.status === 'connected'
      }));
    });

    // Track awareness (other users)
    const awareness = provider.awareness;
    awareness.setLocalState({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email
      },
      cursor: null
    });

    awareness.on('change', () => {
      const peers = Array.from(awareness.getStates().values())
        .filter((state: any) => state.user && state.user.id !== user.id)
        .map((state: any) => state.user.email);
      
      setState(prev => ({
        ...prev,
        peers
      }));
    });

    // Handle document updates with conflict detection
    doc.on('update', (update, origin) => {
      // Only process remote updates
      if (origin !== provider) return;

      // If multiple users are editing the same area, track as potential conflict
      if (state.peers.length > 0) {
        detectConflicts(doc, update);
      }
    });

    setState(prev => ({
      ...prev,
      doc
    }));

    // Cleanup
    return () => {
      awareness.setLocalState(null);
      provider.destroy();
      doc.destroy();
      docRef.current = null;
      providerRef.current = null;
    };
  }, [templateId, user]);

  const detectConflicts = (doc: Y.Doc, update: Uint8Array) => {
    // Simple conflict detection based on concurrent edits
    const text = doc.getText('content');
    const snapshot = Y.snapshot(doc);
    
    // Store snapshot for potential rollback
    const conflictData = {
      snapshot,
      timestamp: Date.now(),
      userId: user?.id
    };

    // Here we would normally send conflict data to Supabase
    // For now, just track locally
    setState(prev => ({
      ...prev,
      conflicts: [...prev.conflicts, conflictData]
    }));
  };

  const resolveConflict = async (
    conflictId: string,
    resolution: 'mine' | 'theirs' | 'merge',
    mergedContent?: string
  ) => {
    if (!docRef.current) return;

    const doc = docRef.current;
    const text = doc.getText('content');

    doc.transact(() => {
      if (resolution === 'merge' && mergedContent) {
        text.delete(0, text.length);
        text.insert(0, mergedContent);
      }
      // Handle other resolution strategies
    });

    // Clear resolved conflict from state
    setState(prev => ({
      ...prev,
      conflicts: prev.conflicts.filter((c: any) => c.id !== conflictId)
    }));
  };

  const getDocument = () => docRef.current;

  const getText = (key: string = 'content') => {
    return docRef.current?.getText(key);
  };

  const getArray = (key: string) => {
    return docRef.current?.getArray(key);
  };

  const getMap = (key: string) => {
    return docRef.current?.getMap(key);
  };

  return {
    ...state,
    getDocument,
    getText,
    getArray,
    getMap,
    resolveConflict
  };
};