import React, { useState, useEffect } from 'react';
import { MessageSquare, Reply, CheckCircle, Clock, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  template_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  line_number?: number;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

interface TemplateCommentsProps {
  templateId: string;
  lineNumber?: number;
  onCommentAdded?: (comment: Comment) => void;
}

export const TemplateComments: React.FC<TemplateCommentsProps> = ({
  templateId,
  lineNumber,
  onCommentAdded
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [templateId, filter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('template_comments')
        .select(`
          *,
          user:user_id(email, full_name, avatar_url)
        `)
        .eq('template_id', templateId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (filter === 'unresolved') {
        query = query.eq('resolved', false);
      }

      if (lineNumber !== undefined) {
        query = query.eq('line_number', lineNumber);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('template_comments')
            .select(`
              *,
              user:user_id(email, full_name, avatar_url)
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return { ...comment, replies: replies || [] };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`comments:${templateId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'template_comments',
          filter: `template_id=eq.${templateId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('template_comments')
        .insert({
          template_id: templateId,
          user_id: user.id,
          parent_comment_id: parentId,
          content: content.trim(),
          line_number: lineNumber
        })
        .select(`
          *,
          user:user_id(email, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }

      if (onCommentAdded && data) {
        onCommentAdded(data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleResolved = async (commentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('template_comments')
        .update({ 
          resolved: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('template_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12' : ''} mb-4`}>
      <div className={`rounded-lg border ${
        comment.resolved ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-background border-border'
      } p-4`}>
        <div className="flex items-start space-x-3">
          {comment.user?.avatar_url ? (
            <img
              src={comment.user.avatar_url}
              alt={comment.user.full_name || comment.user.email}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium">
                {(comment.user?.full_name || comment.user?.email || '?')[0].toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {comment.user?.full_name || comment.user?.email}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
                {comment.line_number && (
                  <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                    Line {comment.line_number}
                  </span>
                )}
                {comment.resolved && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolved
                  </span>
                )}
              </div>
              
              {user?.id === comment.user_id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleResolved(comment.id, comment.resolved)}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    {comment.resolved ? 'Unresolve' : 'Resolve'}
                  </button>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-xs text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <p className="mt-2 text-sm text-foreground">{comment.content}</p>
            
            <div className="mt-2 flex items-center space-x-2">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-primary hover:text-primary/80 flex items-center"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </button>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-3 flex space-x-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-1 text-sm border border-border rounded-md bg-background"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addComment(replyContent, comment.id);
                    }
                  }}
                />
                <button
                  onClick={() => addComment(replyContent, comment.id)}
                  disabled={!replyContent.trim() || submitting}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 border border-border rounded-md hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-2 space-y-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">
            Comments {lineNumber !== undefined && `(Line ${lineNumber})`}
          </h3>
          <span className="text-sm text-muted-foreground">
            ({comments.length})
          </span>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-1 text-sm border border-border rounded-md bg-background"
        >
          <option value="all">All Comments</option>
          <option value="unresolved">Unresolved Only</option>
        </select>
      </div>
      
      {user && (
        <div className="flex space-x-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background resize-none"
            rows={2}
          />
          <button
            onClick={() => addComment(newComment)}
            disabled={!newComment.trim() || submitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};