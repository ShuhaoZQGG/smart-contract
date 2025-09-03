import { useState, useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { supabase } from '../lib/supabase';

export interface Conflict {
  id: string;
  templateId: string;
  userId: string;
  type: 'merge' | 'edit' | 'delete';
  localVersion: string;
  remoteVersion: string;
  baseVersion: string;
  conflictData: any;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
}

export interface YjsCollaborationState {
  doc: Y.Doc | null;
  provider: WebsocketProvider | null;
  isConnected: boolean;
  conflicts: Conflict[];
  addConflict: (conflict: Omit<Conflict, 'id' | 'createdAt'>) => void;
  resolveConflict: (conflictId: string, resolution: string) => void;
  detectConflicts: () => void;
}

export const useYjsCollaboration = (
  templateId: string,
  userId: string
): YjsCollaborationState => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const addConflict = useCallback((conflict: Omit<Conflict, 'id' | 'createdAt'>) => {
    const newConflict: Conflict = {
      ...conflict,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    setConflicts(prev => [...prev, newConflict]);
    
    // Save to Supabase
    supabase
      .from('collaboration_conflicts')
      .insert({
        template_id: conflict.templateId,
        user_id: conflict.userId,
        conflict_type: conflict.type,
        local_version: conflict.localVersion,
        remote_version: conflict.remoteVersion,
        base_version: conflict.baseVersion,
        conflict_data: conflict.conflictData
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error saving conflict to database:', error);
        }
      });
  }, []);

  const resolveConflict = useCallback((conflictId: string, resolution: string) => {
    setConflicts(prev => 
      prev.map(c => 
        c.id === conflictId 
          ? { ...c, resolvedAt: new Date().toISOString(), resolution }
          : c
      )
    );

    // Update in Supabase
    supabase
      .from('collaboration_conflicts')
      .update({ 
        resolved_at: new Date().toISOString(),
        resolution 
      })
      .eq('id', conflictId)
      .then(({ error }) => {
        if (error) {
          console.error('Error resolving conflict in database:', error);
        }
      });
  }, []);

  const detectConflicts = useCallback(() => {
    if (!doc) return;

    const yText = doc.getText('content');
    const content = yText.toString();
    
    // Simple conflict detection based on concurrent edits
    doc.on('update', (update: Uint8Array, origin: any) => {
      if (origin !== providerRef.current) {
        // This is a remote update
        const state = Y.encodeStateAsUpdate(doc);
        const stateVector = Y.encodeStateVector(doc);
        
        // Check for potential conflicts
        // This is a simplified version - in production you'd use more sophisticated algorithms
        if (update.length > 0 && state.length > 0) {
          // Detect if there are concurrent changes to the same region
          const localChanges = doc.getSubdocs();
          
          // If we detect a conflict, add it
          if (localChanges.size > 0) {
            addConflict({
              templateId,
              userId,
              type: 'edit',
              localVersion: content,
              remoteVersion: content, // In real scenario, this would be different
              baseVersion: content,
              conflictData: {
                update: Array.from(update),
                stateVector: Array.from(stateVector)
              }
            });
          }
        }
      }
    });
  }, [doc, templateId, userId, addConflict]);

  useEffect(() => {
    // Initialize Yjs document
    const ydoc = new Y.Doc();
    docRef.current = ydoc;
    setDoc(ydoc);

    // Initialize WebSocket provider for real-time collaboration
    // Using a local WebSocket server for development
    // In production, this would connect to your actual collaboration server
    const wsProvider = new WebsocketProvider(
      process.env.REACT_APP_YJS_WEBSOCKET_URL || 'ws://localhost:1234',
      `template-${templateId}`,
      ydoc
    );
    
    providerRef.current = wsProvider;
    setProvider(wsProvider);

    // Connection status handlers
    wsProvider.on('status', (event: { status: string }) => {
      setIsConnected(event.status === 'connected');
    });

    // Load existing conflicts from Supabase
    const loadConflicts = async () => {
      const { data, error } = await supabase
        .from('collaboration_conflicts')
        .select('*')
        .eq('template_id', templateId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setConflicts(data.map((c: any) => ({
          id: c.id,
          templateId: c.template_id,
          userId: c.user_id,
          type: c.conflict_type,
          localVersion: c.local_version,
          remoteVersion: c.remote_version,
          baseVersion: c.base_version,
          conflictData: c.conflict_data,
          resolvedAt: c.resolved_at,
          resolution: c.resolution,
          createdAt: c.created_at
        })));
      }
    };

    loadConflicts();

    // Set up conflict detection
    detectConflicts();

    // Cleanup
    return () => {
      if (wsProvider) {
        wsProvider.disconnect();
        wsProvider.destroy();
      }
      if (ydoc) {
        ydoc.destroy();
      }
    };
  }, [templateId, userId, detectConflicts]);

  return {
    doc,
    provider,
    isConnected,
    conflicts,
    addConflict,
    resolveConflict,
    detectConflicts
  };
};