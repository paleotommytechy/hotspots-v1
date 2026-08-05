'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@hotspots/database';
import { rankCandidates } from '@hotspots/matching';
import { UserProfile, CandidateProfile, ConnectionRequest, Interest } from '@hotspots/types';
import { MatchCard } from '../../components/match-card';
import { CardSkeleton, EmptyState, Chip, Avatar, useToast } from '@hotspots/ui-web';
import { Compass, Sparkles, SlidersHorizontal, Plus } from 'lucide-react';

export default function DiscoverPage() {
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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

        setCandidates(ranked);
      } else {
        setCandidates([]);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedInterestId]);

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

  return (
    <div className="space-y-6 pb-4 w-full">
      
      {/* Reference Image 1: Stories & Live Matches Top Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-extrabold text-[#2B2B2B]">Discover</h2>
          <span className="text-xs text-[#619B8A] font-bold">Active Campus Peers</span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar px-1">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#F57C00] flex items-center justify-center bg-[#FFF3C4]/60 group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6 text-[#C62828]" />
            </div>
            <span className="text-[11px] text-[#414643] font-medium">Add story</span>
          </div>

          {/* Live Candidates Avatars */}
          {candidates.slice(0, 5).map((cand, idx) => (
            <div key={cand.profile.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#C62828] via-[#F57C00] to-[#FFC857] group-hover:scale-105 transition-transform">
                <Avatar src={cand.profile.avatar_url} name={cand.profile.display_name} size="md" className="border-2 border-white" />
                {idx === 0 && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#C62828] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                    Live
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
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">People You May Click With</h2>
        <p className="text-xs md:text-sm opacity-90 max-w-xl">
          Matched by shared campus interests, complementary skills, and collaboration goals.
        </p>
      </div>

      {/* Interest Filter Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#2B2B2B]">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#619B8A]" /> Filter by Interest
          </span>
          {selectedInterestId && (
            <button onClick={() => setSelectedInterestId(null)} className="text-[11px] text-[#C62828] hover:underline font-bold">
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {interests.map((interest) => (
            <Chip
              key={interest.id}
              label={interest.name}
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

      {/* Candidate Feed List (Dynamic Responsive Grid) */}
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
          title="No more matches in this category"
          description="You've explored all recommended candidates for now. Try clearing your filters or adding new interests to your profile!"
          actionLabel="Clear Filter"
          onAction={() => setSelectedInterestId(null)}
        />
      )}
    </div>
  );
}
