import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, X, Users, GitBranch, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useYjsCollaboration } from '../hooks/useYjsCollaboration';

interface Conflict {
  id: string;
  template_id: string;
  user_id: string;
  conflict_type: 'edit' | 'delete' | 'merge';
  original_content: any;
  conflicting_content: any;
  resolved: boolean;
  resolution?: any;
  created_at: string;
  resolved_at?: string;
  user?: {
    email: string;
    full_name?: string;
  };
}

interface ConflictResolutionProps {
  templateId: string;
  onConflictResolved?: (conflictId: string, resolution: any) => void;
}

export const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  templateId,
  onConflictResolved
}) => {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [activeConflict, setActiveConflict] = useState<Conflict | null>(null);
  const [resolution, setResolution] = useState<'mine' | 'theirs' | 'merge'>('mine');
  const [mergedContent, setMergedContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Yjs CRDT integration
  const {
    isConnected,
    peers,
    conflicts: yjsConflicts,
    resolveConflict: resolveYjsConflict
  } = useYjsCollaboration(templateId, `template-${templateId}`);

  useEffect(() => {
    loadConflicts();
    const unsubscribe = subscribeToConflicts();
    return () => {
      unsubscribe();
    };
  }, [templateId]);
  
  // Monitor Yjs conflicts
  useEffect(() => {
    if (yjsConflicts.length > 0) {
      // Convert Yjs conflicts to our conflict format
      const newConflicts = yjsConflicts.map((c: any) => ({
        id: `yjs-${c.timestamp}`,
        template_id: templateId,
        user_id: c.userId,
        conflict_type: 'edit' as const,
        original_content: c.snapshot,
        conflicting_content: c.snapshot,
        resolved: false,
        created_at: new Date(c.timestamp).toISOString()
      }));
      setConflicts(prev => [...prev, ...newConflicts]);
    }
  }, [yjsConflicts, templateId]);

  const loadConflicts = async () => {
    try {
      const { data, error } = await supabase
        .from('collaboration_conflicts')
        .select(`
          *,
          user:profiles!user_id(email, full_name)
        `)
        .eq('template_id', templateId)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setConflicts(data as any);
      }
    } catch (error) {
      console.error('Error loading conflicts:', error);
    }
  };

  const subscribeToConflicts = () => {
    const channel = supabase
      .channel(`conflicts:${templateId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaboration_conflicts',
          filter: `template_id=eq.${templateId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            loadConflicts();
          } else if (payload.eventType === 'UPDATE') {
            setConflicts(prev => 
              prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleResolveConflict = async () => {
    if (!activeConflict || !user) return;

    setLoading(true);
    try {
      let resolvedContent;
      
      if (resolution === 'mine') {
        resolvedContent = activeConflict.original_content;
      } else if (resolution === 'theirs') {
        resolvedContent = activeConflict.conflicting_content;
      } else {
        resolvedContent = mergedContent || combineContents(
          activeConflict.original_content,
          activeConflict.conflicting_content
        );
      }
      
      // If this is a Yjs conflict, resolve it through CRDT
      if (activeConflict.id.startsWith('yjs-')) {
        await resolveYjsConflict(activeConflict.id, resolution, resolvedContent);
        setConflicts(prev => prev.filter(c => c.id !== activeConflict.id));
        setActiveConflict(null);
        setMergedContent('');
        return;
      }

      const { error } = await supabase
        .from('collaboration_conflicts')
        .update({
          resolved: true,
          resolution: {
            type: resolution,
            content: resolvedContent,
            resolved_by: user.id
          },
          resolved_at: new Date().toISOString()
        })
        .eq('id', activeConflict.id);

      if (error) throw error;

      if (onConflictResolved) {
        onConflictResolved(activeConflict.id, resolvedContent);
      }

      setActiveConflict(null);
      setMergedContent('');
      await loadConflicts();
    } catch (error) {
      console.error('Error resolving conflict:', error);
    } finally {
      setLoading(false);
    }
  };

  const combineContents = (original: any, conflicting: any) => {
    // Simple merge strategy - in production, use a proper diff/merge algorithm
    if (typeof original === 'string' && typeof conflicting === 'string') {
      return `${original}\n--- MERGED WITH ---\n${conflicting}`;
    }
    return { ...original, ...conflicting };
  };

  const formatContent = (content: any) => {
    if (typeof content === 'string') {
      return content;
    }
    return JSON.stringify(content, null, 2);
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'edit':
        return <GitBranch className="w-4 h-4" />;
      case 'delete':
        return <X className="w-4 h-4" />;
      case 'merge':
        return <Users className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (conflicts.length === 0) {
    return (
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-700">No conflicts detected</span>
          </div>
          {isConnected && peers.length > 0 && (
            <div className="text-sm text-gray-500">
              {peers.length} collaborator{peers.length !== 1 ? 's' : ''} online
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Edit Conflicts ({conflicts.length})
        </h3>
      </div>

      {/* Conflicts List */}
      <div className="space-y-2">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            onClick={() => setActiveConflict(conflict)}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              activeConflict?.id === conflict.id
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getConflictIcon(conflict.conflict_type)}
                <span className="font-medium capitalize">
                  {conflict.conflict_type} Conflict
                </span>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(conflict.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Conflicting edit from{' '}
              <span className="font-medium">
                {conflict.user?.full_name || conflict.user?.email || 'Unknown user'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Conflict Resolution Modal */}
      {activeConflict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Resolve Conflict</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Your Version */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="text-blue-600">Your Version</span>
                  {new Date(activeConflict.created_at).toLocaleTimeString()}
                </h3>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {formatContent(activeConflict.original_content)}
                  </pre>
                </div>
              </div>

              {/* Their Version */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="text-orange-600">Their Version</span>
                  {new Date(activeConflict.created_at).toLocaleTimeString()}
                </h3>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {formatContent(activeConflict.conflicting_content)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Resolution Options */}
            <div className="space-y-4">
              <h3 className="font-medium">Resolution Options:</h3>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setResolution('mine')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    resolution === 'mine'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Keep Yours
                </button>
                <button
                  onClick={() => setResolution('theirs')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    resolution === 'theirs'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Keep Theirs
                </button>
                <button
                  onClick={() => setResolution('merge')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    resolution === 'merge'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Merge Both
                </button>
              </div>

              {/* Manual Merge Editor */}
              {resolution === 'merge' && (
                <div className="space-y-2">
                  <h4 className="font-medium">Manual Merge:</h4>
                  <textarea
                    value={mergedContent || combineContents(
                      activeConflict.original_content,
                      activeConflict.conflicting_content
                    )}
                    onChange={(e) => setMergedContent(e.target.value)}
                    className="w-full p-3 border rounded-lg font-mono text-sm"
                    rows={10}
                    placeholder="Edit the merged content..."
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setActiveConflict(null);
                  setMergedContent('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveConflict}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Resolving...' : 'Resolve Conflict'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};