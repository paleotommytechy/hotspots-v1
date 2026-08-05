'use client';

import React, { useState } from 'react';
import { Post } from '@hotspots/types';
import { Avatar, Chip, Button } from '@hotspots/ui-web';
import { Heart, MessageSquare, Send, Sparkles, Building2 } from 'lucide-react';

interface FeedPostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <article className="glass-card rounded-[24px] p-5 md:p-6 space-y-4 shadow-sm border border-[#EAE3C3]/80 hover:shadow-md transition-all duration-200 text-left">
      {/* Post Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={post.author_avatar} name={post.author_name} size="md" />
          <div>
            <h3 className="font-extrabold text-sm text-[#2B2B2B]">{post.author_name}</h3>
            {post.author_campus && (
              <div className="flex items-center gap-1 text-[11px] text-[#619B8A]">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[180px]">{post.author_campus}</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-[10px] text-[#414643] font-semibold bg-[#FFF3C4]/60 px-2.5 py-1 rounded-full border border-[#EAE3C3]">
          {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Post Text Content */}
      <p className="text-xs md:text-sm text-[#2B2B2B] leading-relaxed font-normal">
        {post.content}
      </p>

      {/* Interest Tags */}
      {post.interest_tags && post.interest_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {post.interest_tags.map((tag) => (
            <Chip key={tag} label={tag} variant="interest" className="text-[10px] py-0.5 px-2.5" />
          ))}
        </div>
      )}

      {/* Optional Media Image Attachment */}
      {post.image_url && (
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-2xs max-h-80">
          <img src={post.image_url} alt="Post attachment" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Footer Interactions (Likes & Comments Count) */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
            post.liked_by_me
              ? 'bg-red-50 text-[#C62828] border border-red-200'
              : 'text-[#414643] hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.liked_by_me ? 'fill-[#C62828] text-[#C62828]' : ''}`} />
          <span>{post.likes_count}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#414643] hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-[#619B8A]" />
          <span>{post.comments.length} Comments</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="space-y-3 pt-3 border-t border-gray-100 bg-[#FAFAFA]/60 p-3 rounded-2xl">
          {/* Comment List */}
          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {post.comments.length > 0 ? (
              post.comments.map((cmt) => (
                <div key={cmt.id} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-gray-100 text-xs">
                  <Avatar src={cmt.author_avatar} name={cmt.author_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2B2B2B]">{cmt.author_name}</span>
                    </div>
                    <p className="text-[#414643] text-[11px] mt-0.5">{cmt.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-400 italic text-center py-1">No comments yet. Be the first to reply!</p>
            )}
          </div>

          {/* Comment Input Form */}
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 text-xs py-2 px-3 rounded-xl border border-gray-200 bg-white text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
            />
            <Button type="submit" variant="primary" size="sm" className="px-3 py-1.5 rounded-xl">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </article>
  );
};
