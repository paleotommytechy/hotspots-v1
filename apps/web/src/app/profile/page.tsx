'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@hotspots/database';
import { UserProfile, Interest, Skill, Goal } from '@hotspots/types';
import { Avatar, Chip, Button, BottomSheet } from '@hotspots/ui-web';
import { Edit3, Building2, BookOpen, Target, Sparkles, Check } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [taxonomy, setTaxonomy] = useState<{ interests: Interest[]; skills: Skill[]; goals: Goal[] }>({
    interests: [],
    skills: [],
    goals: [],
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const cur = await DataService.getCurrentProfile();
      const tax = await DataService.getTaxonomy();
      if (cur) {
        setProfile(cur);
        setBio(cur.bio || '');
      }
      setTaxonomy(tax);
    }
    load();
  }, []);

  const handleSaveBio = async () => {
    if (!profile) return;
    const updated = await DataService.updateProfile({ bio });
    setProfile(updated);
    setIsEditOpen(false);
    setToastMsg('Profile updated!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!profile) return null;

  return (
    <div className="space-y-4 py-2">
      {toastMsg && (
        <div className="bg-[#2E7D32] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg text-center animate-in fade-in">
          <Check className="w-4 h-4 inline mr-1" /> {toastMsg}
        </div>
      )}

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Hero Avatar Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] flex flex-col items-center text-center space-y-3 relative shadow-xs sticky top-4">
            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-[#C62828] bg-gray-50 rounded-full transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <Avatar src={profile.avatar_url} name={profile.display_name} size="xl" />

            <div>
              <h2 className="text-xl font-extrabold text-[#2B2B2B]">{profile.display_name}</h2>
              <p className="text-xs text-[#414643] font-medium">@{profile.username}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 text-xs text-[#619B8A] font-medium">
              <span className="flex items-center gap-1 bg-[#619B8A]/10 px-2.5 py-1 rounded-full">
                <Building2 className="w-3.5 h-3.5" /> {profile.campus_name}
              </span>
              <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5" /> {profile.department}
              </span>
            </div>

            {profile.bio && (
              <p className="text-xs text-[#2B2B2B] bg-[#FFF3C4]/40 p-3 rounded-xl max-w-xs leading-relaxed">
                "{profile.bio}"
              </p>
            )}

            <Button variant="outline" size="sm" fullWidth onClick={() => setIsEditOpen(true)} className="mt-2">
              Edit Bio & Info
            </Button>
          </div>
        </div>

        {/* Right Column: Interests, Skills, Goals */}
        <div className="md:col-span-2 space-y-4">
          {/* Interests */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F57C00]" /> Interests & Passions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((i) => (
                <Chip key={i.id} label={i.name} variant="interest" />
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#C62828]" /> Skills You Bring
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <Chip key={s.id} label={s.name} variant="skill" />
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#2E7D32]" /> Goals & Looking For
            </h3>
            <div className="space-y-2">
              {profile.goals.map((g) => (
                <div key={g.id} className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold">
                  {g.name} — <span className="font-normal text-emerald-700">{g.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <div className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Update Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 h-24"
            />
          </div>
          <Button variant="primary" size="md" fullWidth onClick={handleSaveBio}>
            Save Changes
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
