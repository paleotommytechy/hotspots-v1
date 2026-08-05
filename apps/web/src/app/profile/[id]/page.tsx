'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataService } from '@hotspots/database';
import { calculateMatchScore, explainMatch } from '@hotspots/matching';
import { UserProfile, MatchScore, MatchExplanation } from '@hotspots/types';
import { Avatar, Chip, MatchBadge, Button } from '@hotspots/ui-web';
import { ArrowLeft, UserPlus, Sparkles, Building2, BookOpen } from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);
  const [explanation, setExplanation] = useState<MatchExplanation | null>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    async function load() {
      const cur = await DataService.getCurrentProfile();
      const all = await DataService.getAllProfiles();
      const found = all.find((p) => p.id === profileId);

      if (found) {
        setProfile(found);
        if (cur) {
          const score = calculateMatchScore(cur, found);
          const exp = explainMatch(cur, found);
          setMatchScore(score);
          setExplanation(exp);
        } else {
          setMatchScore({
            totalScore: 50,
            percentage: 50,
            breakdown: {
              sharedInterestsScore: 0,
              complementarySkillsScore: 0,
              sharedGoalsScore: 0,
              sameCampusScore: 0,
              recentActivityScore: 0,
            },
          });
          setExplanation({
            sharedInterests: [],
            complementarySkills: [],
            sharedGoals: [],
            sameCampus: false,
            summaryBullets: ['Sign in to calculate match score'],
          });
        }
      }
    }
    load();
  }, [profileId]);

  const handleConnect = async () => {
    if (!profile) return;
    await DataService.sendConnectionRequest(profile.id, 'Would love to connect!');
    setRequested(true);
  };

  if (!profile || !matchScore || !explanation) return null;

  return (
    <div className="space-y-4 py-2">
      {/* Back button */}
      <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-xs font-bold text-[#619B8A] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </button>

      {/* Hero Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] flex flex-col items-center text-center space-y-3 relative shadow-xs">
        <Avatar src={profile.avatar_url} name={profile.display_name} size="xl" />

        <div>
          <h2 className="text-xl font-extrabold text-[#2B2B2B]">{profile.display_name}</h2>
          <p className="text-xs text-[#414643] font-medium">{profile.department} • {profile.level}</p>
        </div>

        <MatchBadge percentage={matchScore.percentage} />

        <div className="flex flex-wrap justify-center gap-1.5 text-xs text-[#619B8A] font-medium">
          <span className="flex items-center gap-1 bg-[#619B8A]/10 px-2.5 py-1 rounded-full">
            <Building2 className="w-3.5 h-3.5" /> {profile.campus_name}
          </span>
        </div>

        {profile.bio && (
          <p className="text-xs text-[#2B2B2B] bg-[#FFF3C4]/40 p-3 rounded-xl max-w-xs leading-relaxed">
            "{profile.bio}"
          </p>
        )}

        <div className="w-full pt-2">
          {requested ? (
            <Button variant="outline" size="md" fullWidth className="bg-amber-50 text-amber-800 border-amber-200">
              Connection Request Sent
            </Button>
          ) : (
            <Button variant="primary" size="md" fullWidth onClick={handleConnect}>
              <UserPlus className="w-4 h-4 mr-2" /> Connect with {profile.display_name.split(' ')[0]}
            </Button>
          )}
        </div>
      </div>

      {/* Why You Match Breakdown */}
      <div className="bg-[#619B8A]/10 p-4 rounded-2xl border border-[#619B8A]/30 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#203C3B]">
          <Sparkles className="w-4 h-4 text-[#F57C00]" />
          <span>Match Breakdown ({matchScore.percentage}%)</span>
        </div>

        <ul className="space-y-1">
          {explanation.summaryBullets.map((bullet, idx) => (
            <li key={idx} className="text-xs text-[#203C3B] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F57C00]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interests */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] space-y-2 shadow-xs">
        <h3 className="font-bold text-xs text-[#2B2B2B]">Interests</h3>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((i) => (
            <Chip key={i.id} label={i.name} variant="interest" />
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] space-y-2 shadow-xs">
        <h3 className="font-bold text-xs text-[#2B2B2B]">Skills</h3>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((s) => (
            <Chip key={s.id} label={s.name} variant="skill" />
          ))}
        </div>
      </div>
    </div>
  );
}
