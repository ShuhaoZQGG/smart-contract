import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, GitBranch } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  onResolution?: (conflict: Conflict) => void;
}

export const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  templateId,
  onResolution
}) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [resolving, setResolving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mergeStrategy, setMergeStrategy] = useState<'mine' | 'theirs' | 'manual'>('manual');

  useEffect(() => {
    fetchConflicts();
    subscribeToConflicts();
  }, [templateId]);

  const fetchConflicts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaboration_conflicts')
        .select(`
          *,
          user:user_id(email, full_name)
        `)
        .eq('template_id', templateId)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConflicts(data || []);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    } finally {
      setLoading(false);
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
            fetchConflicts();
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

  const resolveConflict = async (conflictId: string, resolution: any) => {
    setResolving(true);
    try {
      const { data, error } = await supabase
        .from('collaboration_conflicts')
        .update({
          resolved: true,
          resolution,
          resolved_at: new Date().toISOString()
        })
        .eq('id', conflictId)
        .select()
        .single();

      if (error) throw error;

      setConflicts(prev => prev.filter(c => c.id !== conflictId));
      setSelectedConflict(null);
      
      if (onResolution && data) {
        onResolution(data);
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
    } finally {
      setResolving(false);
    }
  };

  const autoMerge = (conflict: Conflict) => {
    let resolution;
    
    switch (mergeStrategy) {
      case 'mine':
        resolution = conflict.original_content;
        break;
      case 'theirs':
        resolution = conflict.conflicting_content;
        break;
      case 'manual':
        resolution = mergeManually(conflict.original_content, conflict.conflicting_content);
        break;
    }
    
    return resolution;
  };

  const mergeManually = (original: any, conflicting: any) => {
    if (typeof original === 'string' && typeof conflicting === 'string') {
      return {
        merged: true,
        content: `<<<<<<< ORIGINAL\n${original}\n=======\n${conflicting}\n>>>>>>> CONFLICTING`,
        requiresReview: true
      };
    }
    
    if (typeof original === 'object' && typeof conflicting === 'object') {
      const merged: any = {};
      const allKeys = new Set([...Object.keys(original), ...Object.keys(conflicting)]);
      
      for (const key of allKeys) {
        if (original[key] === conflicting[key]) {
          merged[key] = original[key];
        } else {
          merged[key] = {
            original: original[key],
            conflicting: conflicting[key],
            requiresReview: true
          };
        }
      }
      
      return merged;
    }
    
    return { original, conflicting, requiresReview: true };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (conflicts.length === 0) {
    return (
      <div className="text-center py-12 bg-background rounded-lg border border-border">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-foreground">No Conflicts</h3>
        <p className="text-muted-foreground mt-2">
          All collaborators are in sync. No conflicts to resolve.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-semibold text-foreground">
            Conflict Resolution ({conflicts.length})
          </h2>
        </div>
        
        <select
          value={mergeStrategy}
          onChange={(e) => setMergeStrategy(e.target.value as any)}
          className="px-3 py-1 border border-border rounded-md bg-background"
        >
          <option value="manual">Manual Merge</option>
          <option value="mine">Keep Mine</option>
          <option value="theirs">Keep Theirs</option>
        </select>
      </div>

      <div className="grid gap-4">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium capitalize">
                    {conflict.conflict_type} Conflict
                  </span>
                  <span className="text-sm text-muted-foreground">
                    by {conflict.user?.email}
                  </span>
                </div>
                
                <div className="mt-2 text-sm text-muted-foreground">
                  {new Date(conflict.created_at).toLocaleString()}
                </div>
                
                {selectedConflict?.id === conflict.id && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                        <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">
                          Original Content
                        </h4>
                        <pre className="text-xs overflow-auto max-h-40">
                          {JSON.stringify(conflict.original_content, null, 2)}
                        </pre>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                        <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">
                          Conflicting Content
                        </h4>
                        <pre className="text-xs overflow-auto max-h-40">
                          {JSON.stringify(conflict.conflicting_content, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => resolveConflict(conflict.id, conflict.original_content)}
                        disabled={resolving}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        Keep Original
                      </button>
                      <button
                        onClick={() => resolveConflict(conflict.id, conflict.conflicting_content)}
                        disabled={resolving}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                      >
                        Keep Conflicting
                      </button>
                      <button
                        onClick={() => resolveConflict(conflict.id, autoMerge(conflict))}
                        disabled={resolving}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        Auto Merge
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedConflict(
                  selectedConflict?.id === conflict.id ? null : conflict
                )}
                className="ml-4 text-primary hover:text-primary/80"
              >
                {selectedConflict?.id === conflict.id ? 'Hide' : 'Review'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};