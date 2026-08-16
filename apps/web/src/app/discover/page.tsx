'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@hotspots/database';
import { rankCandidates } from '@hotspots/matching';
import { UserProfile, CandidateProfile, ConnectionRequest, Interest } from '@hotspots/types';
import { MatchCard } from '../../components/match-card';
import { CardSkeleton, EmptyState, Chip, Avatar, Button, useToast } from '@hotspots/ui-web';
import { Compass, Sparkles, SlidersHorizontal, Plus, Tag, Flame } from 'lucide-react';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Passions' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
  { id: 'arts', label: 'Arts & Design' },
  { id: 'crafts', label: 'Crafts & DIY' },
  { id: 'outdoors', label: 'Outdoors & Sports' },
  { id: 'food', label: 'Food & Culinary' },
  { id: 'fandom', label: 'Fandom & Books' },
  { id: 'collecting', label: 'Collecting' },
  { id: 'technology', label: 'Tech & Science' },
];

export default function DiscoverPage() {
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Propose custom tag modal/input state
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('gaming');

  const loadData = async () => {
    setLoading(true);
    const cur = await DataService.getCurrentProfile();
    const all = await DataService.getAllProfiles();
    const conns = await DataService.getConnections();
    const tax = await DataService.getTaxonomy();

    setCurrentUser(cur);
    setConnections(conns);
    setInterests(tax.interests);

    if (cur) {
      const connectedUserIds = conns
        .filter((c) => c.status === 'accepted' || c.status === 'pending')
        .map((c) => (c.requester_id === cur.id ? c.recipient_id : c.requester_id));

      const ranked = rankCandidates(cur, all, {
        connectedUserIds,
        interestFilter: selectedInterestId || undefined,
      });

      // Also apply category filter if specific category chosen
      let finalRanked = ranked;
      if (selectedCategory !== 'all' && !selectedInterestId) {
        finalRanked = ranked.filter((cand) =>
          cand.profile.interests.some((i) => {
            if (selectedCategory === 'outdoors') return i.category === 'outdoors' || i.category === 'sports';
            if (selectedCategory === 'fandom') return i.category === 'fandom' || i.category === 'reading';
            if (selectedCategory === 'technology') return i.category === 'technology' || i.category === 'science';
            return i.category === selectedCategory;
          })
        );
      }

      setCandidates(finalRanked);
    } else {
      setCandidates([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedInterestId, selectedCategory]);

  const handleConnect = async (userId: string) => {
    await DataService.sendConnectionRequest(userId, 'Hey! I saw your profile on Hotspots and would love to connect!');
    const updatedConns = await DataService.getConnections();
    setConnections(updatedConns);

    if (currentUser) {
      const all = await DataService.getAllProfiles();
      const connectedUserIds = updatedConns
        .filter((c) => c.status === 'accepted' || c.status === 'pending')
        .map((c) => (c.requester_id === currentUser.id ? c.recipient_id : c.requester_id));

      const ranked = rankCandidates(currentUser, all, {
        connectedUserIds,
        interestFilter: selectedInterestId || undefined,
      });
      setCandidates(ranked);
    }

    toast.success('Connection request sent!');
  };

  const handleProposeTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      const newTag = await DataService.proposeInterestTag(newTagName.trim(), newTagCategory);
      setInterests((prev) => (prev.some((i) => i.id === newTag.id) ? prev : [...prev, newTag]));
      setSelectedInterestId(newTag.id);
      setNewTagName('');
      setIsProposeOpen(false);
      toast.success(`Tag "${newTag.name}" created and applied!`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add tag');
    }
  };

  const visibleInterests = interests.filter((i) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'outdoors') return i.category === 'outdoors' || i.category === 'sports';
    if (selectedCategory === 'fandom') return i.category === 'fandom' || i.category === 'reading';
    if (selectedCategory === 'technology') return i.category === 'technology' || i.category === 'science';
    return i.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-6 w-full text-left">
      {/* Top Carousel: Featured Active Creators / Hobbyists */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black text-[#2B2B2B] tracking-tight">Discover</h2>
          <span className="text-xs text-[#619B8A] font-bold">Active Hobbyists & Creators</span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar px-1">
          {/* Add / Propose Tag Button */}
          <div
            onClick={() => setIsProposeOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#F57C00] flex items-center justify-center bg-[#FFF3C4]/60 group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6 text-[#C62828]" />
            </div>
            <span className="text-[11px] text-[#414643] font-bold">Add Tag</span>
          </div>

          {/* Candidates Avatars */}
          {candidates.slice(0, 7).map((cand, idx) => (
            <div key={cand.profile.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#C62828] via-[#F57C00] to-[#FFC857] group-hover:scale-105 transition-transform">
                <Avatar src={cand.profile.avatar_url} name={cand.profile.display_name} size="md" className="border-2 border-white" />
                {idx === 0 && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#C62828] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                    Top
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#2B2B2B] font-bold truncate max-w-[64px]">
                {cand.profile.display_name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#C62828] via-[#D32F2F] to-[#F57C00] text-white p-6 md:p-8 rounded-[28px] shadow-md space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold opacity-95">
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Recommended For You</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">People Who Share Your Passions</h2>
        <p className="text-xs md:text-sm opacity-90 max-w-xl">
          Ranked by mutual interests, favorite activities, and creative collaboration styles.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#2B2B2B]">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#619B8A]" /> Browse by Category
          </span>
          <button
            onClick={() => setIsProposeOpen(true)}
            className="text-[11px] text-[#C62828] hover:underline font-bold flex items-center gap-1"
          >
            <Tag className="w-3 h-3" /> Propose New Tag
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedInterestId(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                  : 'bg-white text-[#414643] border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specific Interest Filter Chips Carousel */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#414643]">
          <span>Specific Passion Tags</span>
          {selectedInterestId && (
            <button
              onClick={() => setSelectedInterestId(null)}
              className="text-[#C62828] hover:underline font-bold"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {visibleInterests.map((interest) => (
            <Chip
              key={interest.id}
              label={interest.name}
              category={interest.category}
              variant="interest"
              selected={selectedInterestId === interest.id}
              onClick={() =>
                setSelectedInterestId(selectedInterestId === interest.id ? null : interest.id)
              }
              className="shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Propose Tag Modal */}
      {isProposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE3C3] max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-[#2B2B2B] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C62828]" /> Propose a New Interest Tag
              </h3>
              <button
                onClick={() => setIsProposeOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleProposeTag} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Tag Name</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g. Mechanical Keyboards, Dark Fantasy, Bonsai..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Category</label>
                <select
                  value={newTagCategory}
                  onChange={(e) => setNewTagCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                >
                  <option value="gaming">Gaming</option>
                  <option value="music">Music</option>
                  <option value="arts">Arts & Design</option>
                  <option value="crafts">Crafts & Making</option>
                  <option value="outdoors">Outdoors</option>
                  <option value="sports">Sports</option>
                  <option value="food">Food & Culinary</option>
                  <option value="fandom">Fandom & Books</option>
                  <option value="collecting">Collecting</option>
                  <option value="technology">Technology & Science</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsProposeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={!newTagName.trim()}>
                  Create Tag
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Feed List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {candidates.map((cand) => (
            <MatchCard key={cand.profile.id} candidate={cand} onConnect={handleConnect} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Compass className="w-6 h-6" />}
          title="No candidates found for this filter"
          description="Try selecting a different category or clearing your tags to see all discoverable members!"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedCategory('all');
            setSelectedInterestId(null);
          }}
        />
      )}
    </div>
  );
}
