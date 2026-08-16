'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CandidateProfile } from '@hotspots/types';
import { Avatar, MatchBadge, Chip, Button, BottomSheet } from '@hotspots/ui-web';
import { Flame, Sparkles, UserPlus, Info, MapPin, ShieldCheck, Heart } from 'lucide-react';

export interface MatchCardProps {
  candidate: CandidateProfile;
  onConnect: (userId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ candidate, onConnect }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { profile, matchScore, explanation } = candidate;

  const primaryReason = explanation.summaryBullets?.[0] || 'Shared passions & creative vibe';

  return (
    <div className="glass-card rounded-[24px] p-5 space-y-4 relative transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-left flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <Link href={`/profile/${profile.id}`} className="flex items-center gap-3 group">
            <Avatar src={profile.avatar_url} name={profile.display_name} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-[#2B2B2B] group-hover:text-[#C62828] transition-colors truncate">
                  {profile.display_name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              {profile.department && (
                <p className="text-xs text-[#414643] font-medium truncate">{profile.department}</p>
              )}
              {profile.campus_name && (
                <div className="flex items-center gap-1 text-[11px] text-[#619B8A] mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{profile.campus_name}</span>
                </div>
              )}
            </div>
          </Link>

          {/* Match Percentage Badge */}
          <MatchBadge percentage={matchScore.percentage} />
        </div>

        {/* Bio excerpt if present */}
        {profile.bio && (
          <p className="text-xs text-[#414643] line-clamp-2 italic leading-relaxed">
            "{profile.bio}"
          </p>
        )}

        {/* Primary Match Highlight Reason */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FFF3C4]/80 to-[#FFC857]/30 border border-[#EAE3C3]/60 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#C62828] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Flame className="w-3.5 h-3.5 fill-white" />
          </div>
          <p className="text-xs text-[#2B2B2B] font-semibold leading-relaxed">
            {primaryReason}
          </p>
        </div>

        {/* Shared Interests Chips */}
        {explanation.sharedInterests.length > 0 ? (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-[#619B8A] uppercase tracking-wider block">
              Shared Passions ({explanation.sharedInterests.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {explanation.sharedInterests.slice(0, 3).map((interest) => (
                <Chip
                  key={interest.id || interest.name}
                  label={interest.name}
                  category={interest.category}
                  variant="interest"
                />
              ))}
            </div>
          </div>
        ) : profile.interests && profile.interests.length > 0 ? (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-[#619B8A] uppercase tracking-wider block">
              Interests
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.slice(0, 3).map((interest) => (
                <Chip
                  key={interest.id || interest.name}
                  label={interest.name}
                  category={interest.category}
                  variant="interest"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100/60">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onConnect(profile.id)}
          className="rounded-xl shadow-md font-bold"
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> Connect
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsDetailsOpen(true)}
          className="rounded-xl p-2.5 bg-gray-100 hover:bg-gray-200"
          title="Match Details"
        >
          <Info className="w-4 h-4 text-[#414643]" />
        </Button>
      </div>

      {/* Match Breakdown Modal */}
      <BottomSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Why you match with ${profile.display_name}`}
      >
        <div className="space-y-4 py-2 text-left">
          <div className="flex items-center justify-between bg-[#FFF3C4]/60 p-4 rounded-2xl border border-[#EAE3C3]">
            <span className="font-extrabold text-sm text-[#2B2B2B]">Passion Compatibility Score</span>
            <span className="font-extrabold text-lg text-[#C62828]">{matchScore.percentage}%</span>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#2B2B2B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F57C00]" /> Match Breakdown
            </h4>
            <ul className="space-y-2 bg-gray-50 p-3.5 rounded-2xl text-[#414643]">
              <li className="flex justify-between">
                <span>Shared Passions & Interests (Dominant)</span>
                <span className="font-bold text-[#2B2B2B]">{matchScore.breakdown.sharedInterestsScore} pts</span>
              </li>
              <li className="flex justify-between">
                <span>Mutual Collaboration Goals</span>
                <span className="font-bold text-[#2B2B2B]">{matchScore.breakdown.sharedGoalsScore} pts</span>
              </li>
              <li className="flex justify-between">
                <span>Complementary Skills & Crafts</span>
                <span className="font-bold text-[#2B2B2B]">{matchScore.breakdown.complementarySkillsScore} pts</span>
              </li>
              <li className="flex justify-between">
                <span>Same Local Hub / Area</span>
                <span className="font-bold text-[#2B2B2B]">{matchScore.breakdown.sameCampusScore} pts</span>
              </li>
            </ul>
          </div>

          {/* Explanation bullets */}
          {explanation.summaryBullets && explanation.summaryBullets.length > 0 && (
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-[#2B2B2B]">Key Match Insights</h4>
              <ul className="list-disc pl-4 text-[#414643] space-y-1">
                {explanation.summaryBullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          <Link href={`/profile/${profile.id}`} className="block pt-2">
            <Button variant="outline" size="md" fullWidth className="rounded-xl">
              View Full Profile
            </Button>
          </Link>
        </div>
      </BottomSheet>
    </div>
  );
};
