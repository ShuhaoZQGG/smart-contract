import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Check, Reply, MoreVertical, User } from 'lucide-react';
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
  onThreadResolved?: (commentId: string) => void;
}

export const TemplateComments: React.FC<TemplateCommentsProps> = ({
  templateId,
  lineNumber,
  onCommentAdded,
  onThreadResolved
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
    subscribeToComments();
  }, [templateId, lineNumber]);

  const loadComments = async () => {
    try {
      let query = supabase
        .from('template_comments')
        .select(`
          *,
          user:profiles!user_id(email, full_name, avatar_url)
        `)
        .eq('template_id', templateId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (lineNumber !== undefined) {
        query = query.eq('line_number', lineNumber);
      }

      if (!showResolved) {
        query = query.eq('resolved', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Load replies for each comment
      if (data) {
        const commentsWithReplies = await Promise.all(
          data.map(async (comment) => {
            const { data: replies } = await supabase
              .from('template_comments')
              .select(`
                *,
                user:profiles!user_id(email, full_name, avatar_url)
              `)
              .eq('parent_comment_id', comment.id)
              .order('created_at', { ascending: true });

            return {
              ...comment,
              replies: replies || []
            };
          })
        );
        setComments(commentsWithReplies as any);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
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
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('template_comments')
        .insert({
          template_id: templateId,
          user_id: user.id,
          content: newComment,
          line_number: lineNumber,
          resolved: false
        })
        .select(`
          *,
          user:profiles!user_id(email, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      if (data && onCommentAdded) {
        onCommentAdded(data as any);
      }

      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('template_comments')
        .insert({
          template_id: templateId,
          user_id: user.id,
          parent_comment_id: parentId,
          content: replyContent,
          resolved: false
        });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveThread = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('template_comments')
        .update({ resolved: true })
        .or(`id.eq.${commentId},parent_comment_id.eq.${commentId}`);

      if (error) throw error;

      if (onThreadResolved) {
        onThreadResolved(commentId);
      }

      await loadComments();
    } catch (error) {
      console.error('Error resolving thread:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('template_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffMs = now.getTime() - commentTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-12' : ''} mb-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {comment.user?.avatar_url ? (
            <img 
              src={comment.user.avatar_url} 
              alt={comment.user.full_name || comment.user.email}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user?.full_name || comment.user?.email || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.created_at)}
            </span>
            {comment.resolved && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                <Check className="w-3 h-3" />
                Resolved
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
          
          <div className="flex items-center gap-2">
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
            
            {!comment.resolved && !isReply && (
              <button
                onClick={() => handleResolveThread(comment.id)}
                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Resolve
              </button>
            )}
            
            {comment.user_id === user?.id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                disabled={!replyContent.trim() || loading}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
                className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments 
          {lineNumber !== undefined && (
            <span className="text-sm text-gray-500">on line {lineNumber}</span>
          )}
        </h3>
        
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {showResolved ? 'Hide' : 'Show'} resolved
        </button>
      </div>

      {/* New Comment Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim() || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post
        </button>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
              <CommentItem comment={comment} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No comments yet</p>
          <p className="text-sm">Be the first to comment on this template</p>
        </div>
      )}
    </div>
  );
};