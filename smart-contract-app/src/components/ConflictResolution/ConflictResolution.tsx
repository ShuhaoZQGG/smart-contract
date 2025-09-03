import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Users, Check, X, RotateCcw, Edit3, GitMerge } from 'lucide-react';

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
}

interface Presence {
  user_id: string;
  user_name: string;
  cursor_position?: number;
  active_section?: string;
}

interface ConflictResolutionProps {
  templateId: string;
  userId: string;
  showHistory?: boolean;
  showPresence?: boolean;
  onConflictResolved?: (conflictId: string, resolution: any) => void;
}

const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  templateId,
  userId,
  showHistory = false,
  showPresence = false,
  onConflictResolved,
}) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [resolvedConflicts, setResolvedConflicts] = useState<Conflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [resolutionStrategy, setResolutionStrategy] = useState<'keep_mine' | 'keep_theirs' | 'merge' | ''>('');
  const [mergedContent, setMergedContent] = useState('');
  const [showMergeEditor, setShowMergeEditor] = useState(false);
  const [presence, setPresence] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    fetchConflicts();
    subscribeToConflicts();
    
    if (showPresence) {
      subscribeToPresence();
    }
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (presenceChannelRef.current) {
        presenceChannelRef.current.unsubscribe();
      }
    };
  }, [templateId]);

  const fetchConflicts = async () => {
    try {
      // Fetch unresolved conflicts
      const { data: unresolvedData, error: unresolvedError } = await supabase
        .from('collaboration_conflicts')
        .select('*')
        .eq('template_id', templateId)
        .eq('resolved', false);
      
      if (unresolvedError) throw unresolvedError;
      setConflicts(unresolvedData || []);
      
      // Fetch resolved conflicts for history
      if (showHistory) {
        const { data: resolvedData, error: resolvedError } = await supabase
          .from('collaboration_conflicts')
          .select('*')
          .eq('template_id', templateId)
          .eq('resolved', true)
          .order('resolved_at', { ascending: false });
        
        if (resolvedError) throw resolvedError;
        setResolvedConflicts(resolvedData || []);
      }
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    }
  };

  const subscribeToConflicts = () => {
    channelRef.current = supabase
      .channel(`conflicts:${templateId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'collaboration_conflicts',
        filter: `template_id=eq.${templateId}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setConflicts(prev => [...prev, payload.new as Conflict]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Conflict;
          if (updated.resolved) {
            setConflicts(prev => prev.filter(c => c.id !== updated.id));
            if (showHistory) {
              setResolvedConflicts(prev => [updated, ...prev]);
            }
          }
        }
      })
      .subscribe();
  };

  const subscribeToPresence = () => {
    presenceChannelRef.current = supabase
      .channel(`presence:${templateId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannelRef.current.presenceState();
        const users: Presence[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            if (p.user_id !== userId) {
              users.push(p);
            }
          });
        });
        
        setPresence(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannelRef.current.track({
            user_id: userId,
            user_name: 'Current User',
            online_at: new Date().toISOString(),
          });
        }
      });
  };

  const handleResolveConflict = async (conflictId: string, strategy: string) => {
    setLoading(true);
    
    try {
      const conflict = conflicts.find(c => c.id === conflictId);
      if (!conflict) return;
      
      let resolution: any = { strategy };
      
      switch (strategy) {
        case 'keep_mine':
          resolution.content = conflict.original_content;
          break;
        case 'keep_theirs':
          resolution.content = conflict.conflicting_content;
          break;
        case 'merge':
          resolution.content = mergedContent || combineContent(
            conflict.original_content,
            conflict.conflicting_content
          );
          break;
      }
      
      const { error } = await supabase
        .from('collaboration_conflicts')
        .update({
          resolved: true,
          resolution,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', conflictId);
      
      if (error) throw error;
      
      // Update local state
      setConflicts(prev => prev.filter(c => c.id !== conflictId));
      setSelectedConflict(null);
      setResolutionStrategy('');
      setMergedContent('');
      setShowMergeEditor(false);
      
      // Callback
      if (onConflictResolved) {
        onConflictResolved(conflictId, resolution);
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
    } finally {
      setLoading(false);
    }
  };

  const combineContent = (original: any, conflicting: any) => {
    // Simple combination strategy - in production, use a proper merge algorithm
    const originalText = typeof original === 'string' ? original : original?.text || '';
    const conflictingText = typeof conflicting === 'string' ? conflicting : conflicting?.text || '';
    
    return `<<<<<<< Your Changes\n${originalText}\n=======\n${conflictingText}\n>>>>>>> Their Changes`;
  };

  const handleRevertResolution = async (conflictId: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('collaboration_conflicts')
        .update({
          resolved: false,
          resolution: null,
          resolved_at: null,
        })
        .eq('id', conflictId);
      
      if (error) throw error;
      
      await fetchConflicts();
    } catch (error) {
      console.error('Error reverting resolution:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentText = (content: any) => {
    if (typeof content === 'string') return content;
    if (content?.text) return content.text;
    return JSON.stringify(content, null, 2);
  };

  return (
    <div className="conflict-resolution">
      {/* Active Conflicts */}
      {conflicts.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Conflict Detected ({conflicts.length})
            </h3>
          </div>
          
          <div className="space-y-3">
            {conflicts.map(conflict => (
              <div
                key={conflict.id}
                className="p-3 bg-white border rounded cursor-pointer hover:shadow-md"
                onClick={() => setSelectedConflict(conflict)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">
                    {conflict.conflict_type} Conflict
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(conflict.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conflict Resolution Modal */}
      {selectedConflict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Resolve Conflict</h3>
              <button
                onClick={() => {
                  setSelectedConflict(null);
                  setResolutionStrategy('');
                  setShowMergeEditor(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Three-way merge view */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Original</h4>
                <div className="p-3 bg-gray-50 border rounded h-48 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {getContentText(selectedConflict.original_content)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Your Changes</h4>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded h-48 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {getContentText(selectedConflict.original_content)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Their Changes</h4>
                <div className="p-3 bg-green-50 border border-green-200 rounded h-48 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {getContentText(selectedConflict.conflicting_content)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Resolution Options */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => {
                  setResolutionStrategy('keep_mine');
                  handleResolveConflict(selectedConflict.id, 'keep_mine');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                Keep Mine
              </button>
              
              <button
                onClick={() => {
                  setResolutionStrategy('keep_theirs');
                  handleResolveConflict(selectedConflict.id, 'keep_theirs');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading}
              >
                Keep Theirs
              </button>
              
              <button
                onClick={() => {
                  const combined = combineContent(
                    selectedConflict.original_content,
                    selectedConflict.conflicting_content
                  );
                  setMergedContent(combined);
                  setResolutionStrategy('merge');
                  handleResolveConflict(selectedConflict.id, 'merge');
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                disabled={loading}
              >
                Merge Both
              </button>
              
              <button
                onClick={() => setShowMergeEditor(true)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={loading}
              >
                <Edit3 className="w-4 h-4 inline mr-1" />
                Manual Merge
              </button>
            </div>

            {/* Manual Merge Editor */}
            {showMergeEditor && (
              <div className="mt-4">
                <label htmlFor="merged-content" className="block text-sm font-medium mb-2">
                  Merged Content
                </label>
                <textarea
                  id="merged-content"
                  value={mergedContent}
                  onChange={(e) => setMergedContent(e.target.value)}
                  className="w-full h-48 p-3 border rounded"
                  placeholder="Enter your merged content here..."
                />
                <button
                  onClick={() => {
                    setResolutionStrategy('merge');
                    handleResolveConflict(selectedConflict.id, 'merge');
                  }}
                  className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  disabled={loading || !mergedContent}
                >
                  Save Merge
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Presence Indicators */}
      {showPresence && presence.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm">
              {presence.map(p => (
                <span key={p.user_id} className="mr-2">
                  {p.user_name} is editing
                  {p.active_section && (
                    <span
                      data-testid={`editing-indicator-${p.active_section}`}
                      className="editing-by-others ml-1 px-2 py-1 bg-blue-100 rounded text-xs"
                    >
                      {p.active_section}
                    </span>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}

      {/* Resolution History */}
      {showHistory && resolvedConflicts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Resolution History</h3>
          <div className="space-y-2">
            {resolvedConflicts.map(conflict => (
              <div key={conflict.id} className="p-3 bg-gray-50 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium capitalize">
                      {conflict.conflict_type} Conflict
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      Resolved: {conflict.resolution?.strategy || 'unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {conflict.resolved_at && new Date(conflict.resolved_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRevertResolution(conflict.id)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                      title="Revert resolution"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="sr-only">Revert</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictResolution;