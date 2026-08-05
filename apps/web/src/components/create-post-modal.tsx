'use client';

import React, { useState } from 'react';
import { Button, Chip } from '@hotspots/ui-web';
import { X, Image as ImageIcon, Sparkles, Send } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, imageUrl?: string, interestTags?: string[]) => void;
}

const SAMPLE_TAGS = ['React & Next.js', 'UI/UX Design', 'Artificial Intelligence', 'Hackathon Project', 'Study Group'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), imageUrl.trim() || undefined, selectedTags);
    setContent('');
    setImageUrl('');
    setSelectedTags([]);
    setShowImageInput(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-[#EAE3C3] w-full max-w-lg p-6 shadow-2xl space-y-4 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#C62828]/10 text-[#C62828]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-base text-[#2B2B2B]">Create Community Post</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on campus? Share a project idea, question, or meetup goal..."
            className="w-full text-xs md:text-sm p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#C62828] resize-none"
          />

          {/* Interest Tags Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#414643] block">Add Interest Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="interest"
                  selected={selectedTags.includes(tag)}
                  onClick={() => handleToggleTag(tag)}
                  className="text-[10px] py-1 px-2.5"
                />
              ))}
            </div>
          </div>

          {/* Image URL Input Toggle */}
          {showImageInput ? (
            <div className="space-y-1">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#619B8A] font-bold hover:underline"
            >
              <ImageIcon className="w-4 h-4" /> Add Image Attachment
            </button>
          )}

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!content.trim()} className="rounded-xl px-5">
              Publish Post <Send className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
