'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
}

interface CommentsProps {
  videoId: string;
}

export default function Comments({ videoId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const response = await api.get(`/videos/${videoId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await api.post(`/videos/${videoId}/comments`, {
        content: newComment,
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;

    try {
      await api.post(`/videos/${videoId}/comments`, {
        content: replyContent,
        parentId,
      });
      setReplyContent('');
      setReplyTo(null);
      loadComments();
    } catch (error) {
      alert('Failed to post reply');
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await api.put(`/videos/comments/${commentId}`, {
        content: editContent,
      });
      setEditingId(null);
      setEditContent('');
      loadComments();
    } catch (error) {
      alert('Failed to edit comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/videos/comments/${commentId}`);
      loadComments();
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getUserName = (comment: Comment) => {
    if (comment.user.firstName || comment.user.lastName) {
      return `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim();
    }
    return comment.user.email.split('@')[0];
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = user?.id === comment.user.id;
    const isEditing = editingId === comment.id;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-12' : ''} mb-4`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.user.avatarUrl ? (
              <img
                src={comment.user.avatarUrl}
                alt={getUserName(comment)}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-salmon-100 flex items-center justify-center">
                <span className="text-salmon-600 font-medium">
                  {getUserName(comment)[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{getUserName(comment)}</span>
                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>

              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-salmon-400 focus:border-transparent"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="px-3 py-1 bg-salmon-500 text-white rounded-md text-sm hover:bg-salmon-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-800">{comment.content}</p>
              )}
            </div>

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-4 mt-2 text-sm">
                {user && !isReply && (
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="text-gray-600 hover:text-salmon-600 font-medium"
                  >
                    Reply
                  </button>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-gray-600 hover:text-salmon-600 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-600 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Reply Form */}
            {replyTo === comment.id && (
              <div className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-salmon-400 focus:border-transparent"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    className="px-4 py-2 bg-salmon-500 text-white rounded-md text-sm hover:bg-salmon-600"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {comments.length} Comments
      </h3>

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="You"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-salmon-100 flex items-center justify-center">
                  <span className="text-salmon-600 font-medium">
                    {user.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-salmon-400 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setNewComment('')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-salmon-500 hover:bg-salmon-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">
            Please{' '}
            <a href="/login" className="text-salmon-600 hover:text-salmon-700 font-medium">
              sign in
            </a>{' '}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-salmon-600 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
