'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataService } from '@hotspots/database';
import { Campus, Interest, Skill, Goal } from '@hotspots/types';
import { Button, Chip, useToast } from '@hotspots/ui-web';
import { useAuth } from '../../context/auth-context';
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  Sparkles,
  Award,
  Target,
  Plus,
  Compass,
  Smile,
  Layers,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Categories' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
  { id: 'arts', label: 'Arts & Design' },
  { id: 'crafts', label: 'Crafts & Making' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'sports', label: 'Sports' },
  { id: 'food', label: 'Food & Cooking' },
  { id: 'fandom', label: 'Fandom & Books' },
  { id: 'collecting', label: 'Collecting' },
  { id: 'technology', label: 'Tech & Science' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [taxonomy, setTaxonomy] = useState<{ interests: Interest[]; skills: Skill[]; goals: Goal[] }>({
    interests: [],
    skills: [],
    goals: [],
  });

  // Step 1: Interests
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [customInterest, setCustomInterest] = useState('');
  const [customInterestCategory, setCustomInterestCategory] = useState('general');

  // Step 2: About You
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Step 3: Location, Skills & Goals (All Optional)
  const [selectedCampusId, setSelectedCampusId] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    async function loadData() {
      const cList = await DataService.getCampuses();
      const tax = await DataService.getTaxonomy();
      setCampuses(cList);
      setTaxonomy(tax);

      if (user) {
        if (user.display_name) setDisplayName(user.display_name);
        if (user.username) setUsername(user.username);
        if (user.bio) setBio(user.bio);
        if (user.campus_id) setSelectedCampusId(user.campus_id);
        if (user.department) setDepartment(user.department);
        if (user.level) setLevel(user.level);
        if (user.avatar_url) setAvatarUrl(user.avatar_url);
        if (user.interests?.length) setSelectedInterestIds(user.interests.map((i) => i.id));
        if (user.skills?.length) setSelectedSkillIds(user.skills.map((s) => s.id));
        if (user.goals?.length) setSelectedGoalIds(user.goals.map((g) => g.id));
      }
    }
    loadData();
  }, [user]);

  const toggleSelection = (id: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleAddCustomInterest = async () => {
    if (!customInterest.trim()) return;
    try {
      const newInt = await DataService.proposeInterestTag(
        customInterest.trim(),
        selectedCategoryTab !== 'all' ? selectedCategoryTab : 'general'
      );
      setTaxonomy((prev) => ({
        ...prev,
        interests: prev.interests.some((i) => i.id === newInt.id) ? prev.interests : [...prev.interests, newInt],
      }));
      setSelectedInterestIds((prev) => (prev.includes(newInt.id) ? prev : [...prev, newInt.id]));
      setCustomInterest('');
      toast.success(`Added passion tag: "${newInt.name}"!`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add interest tag');
    }
  };

  const handleAddCustomSkill = async () => {
    if (!customSkill.trim()) return;
    try {
      const newSkl = await DataService.adminAddSkill({
        name: customSkill.trim(),
        category: 'Skill',
        level: 'intermediate',
      });
      setTaxonomy((prev) => ({ ...prev, skills: [...prev.skills, newSkl] }));
      setSelectedSkillIds((prev) => [...prev, newSkl.id]);
      setCustomSkill('');
      toast.success(`Added skill: "${newSkl.name}"!`);
    } catch (e: any) {
      toast.error('Failed to add skill');
    }
  };

  const validateStep1 = () => {
    if (selectedInterestIds.length === 0) {
      toast.error('Please select at least 1 interest or hobby to get started');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!displayName.trim()) {
      toast.error('Please enter your Display Name');
      return false;
    }
    if (!username.trim()) {
      toast.error('Please choose a Username');
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    const campusObj = campuses.find((c) => c.id === selectedCampusId);
    const chosenInterests = taxonomy.interests.filter((i) => selectedInterestIds.includes(i.id));
    const chosenSkills = taxonomy.skills.filter((s) => selectedSkillIds.includes(s.id));
    const chosenGoals = taxonomy.goals.filter((g) => selectedGoalIds.includes(g.id));

    const finalAvatar =
      avatarUrl ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`;

    await DataService.updateProfile({
      display_name: displayName.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      avatar_url: finalAvatar,
      bio: bio.trim(),
      campus_id: selectedCampusId || '',
      campus_name: campusObj?.name || '',
      department: department.trim(),
      level: level.trim(),
      interests: chosenInterests,
      skills: chosenSkills,
      goals: chosenGoals,
      is_onboarded: true,
    });

    await refreshUser();
    toast.success('Your profile is ready! Welcome to Hotspots!');
    router.push('/discover');
  };

  const filteredInterests = taxonomy.interests.filter((i) => {
    if (selectedCategoryTab === 'all') return true;
    if (selectedCategoryTab === 'fandom') return i.category === 'fandom' || i.category === 'reading';
    if (selectedCategoryTab === 'technology') return i.category === 'technology' || i.category === 'science';
    return i.category === selectedCategoryTab;
  });

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 px-2 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#C62828] to-[#F57C00] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Hotspots
          </span>
          <h1 className="text-2xl font-black tracking-tight">Discover People by Passion</h1>
          <p className="text-xs text-red-100 mt-1 max-w-md">
            Connect with tabletop gamers, musicians, climbers, artists, and creators who share what you love.
          </p>
        </div>
      </div>

      {/* Step Progress Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#414643] mb-2">
          <span>
            {step === 1 && 'Step 1: Your Interests & Passions'}
            {step === 2 && 'Step 2: Profile & Bio'}
            {step === 3 && 'Step 3: Location & Goals (Optional)'}
          </span>
          <span className="text-[#C62828] font-extrabold">Step {step} of 3</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#C62828] to-[#F57C00] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: INTERESTS & PASSIONS (PRIORITIZED FIRST) */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F57C00]" /> What are you into? <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-[#619B8A] mt-0.5">
              Select your favorite hobbies, creative outlets, or niche interests. Pick as many as you like!
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  selectedCategoryTab === tab.id
                    ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                    : 'bg-gray-50 text-[#414643] border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interest Chips with Category Colors */}
          <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-1 no-scrollbar">
            {filteredInterests.map((interest) => (
              <Chip
                key={interest.id}
                label={interest.name}
                category={interest.category}
                selected={selectedInterestIds.includes(interest.id)}
                onClick={() => toggleSelection(interest.id, selectedInterestIds, setSelectedInterestIds)}
              />
            ))}
          </div>

          {/* Selected count info */}
          <div className="flex items-center justify-between text-xs text-[#619B8A] font-semibold pt-1">
            <span>{selectedInterestIds.length} interests selected</span>
            {selectedInterestIds.length > 0 && (
              <span className="text-[#C62828]">Great picks!</span>
            )}
          </div>

          {/* Propose / Add Custom Interest Tag */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <label className="block text-[11px] font-bold text-[#414643]">
              Have a niche hobby not listed? Propose a new tag:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="e.g. Modular Synthesizers, Bonsai, Speedcubing..."
                className="text-xs p-2.5 rounded-xl border border-gray-200 flex-1 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomInterest();
                  }
                }}
              />
              <Button variant="outline" size="sm" onClick={handleAddCustomInterest}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Tag
              </Button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            className="mt-4"
          >
            Continue to Profile <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* STEP 2: PROFILE & BIO */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
              <User className="w-5 h-5 text-[#C62828]" /> How should people know you?
            </h3>
            <p className="text-xs text-[#619B8A] mt-0.5">Set up your display name and quick bio.</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="alex_rivera"
                className="w-full text-xs p-3 pl-7 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
              />
            </div>
          </div>

          {/* Bio (Optional) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#2B2B2B]">
                About You / Bio
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Optional</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What are you currently creating, playing, or exploring? Any fun projects or favorite gear..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 h-24 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            />
          </div>

          {/* Avatar Choice */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-2">
              Profile Avatar (Choose Preset or Enter URL)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_AVATARS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i}`}
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                    avatarUrl === url ? 'border-[#C62828] scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
                  }`}
                />
              ))}
            </div>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Or paste custom image URL (https://...)"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (validateStep2()) setStep(3);
              }}
            >
              Next: Location & Vibes <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION & GOALS (ALL OPTIONAL) */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#619B8A]" /> Location & Exploration Vibe
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                All Optional
              </span>
            </div>
            <p className="text-xs text-[#619B8A] mt-0.5">
              Optionally add your local community hub and collaboration style.
            </p>
          </div>

          {/* Regional Hub / Campus (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Local Hub / Community Area
            </label>
            <select
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            >
              <option value="">Select Local Hub (or leave blank for Global)</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city}, {c.region})
                </option>
              ))}
            </select>
          </div>

          {/* Creative Focus / Role (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Creative Focus / Craft (Optional)
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Visual Artist, Indie Dev, Sourdough Baker, Musician..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            />
          </div>

          {/* Goals (Optional) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2B2B2B]">
              What kind of connections are you looking for? (Optional)
            </label>
            <div className="space-y-2">
              {taxonomy.goals.map((g) => {
                const isSelected = selectedGoalIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleSelection(g.id, selectedGoalIds, setSelectedGoalIds)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#C62828] bg-[#FFF3C4]/50 font-bold shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs text-[#2B2B2B] font-extrabold">{g.name}</div>
                    <div className="text-[11px] text-[#414643] font-normal mt-0.5">{g.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills / Techniques (Optional) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2B2B2B]">
              Skills or techniques you can share (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {taxonomy.skills.map((s) => (
                <Chip
                  key={s.id}
                  label={s.name}
                  variant="skill"
                  selected={selectedSkillIds.includes(s.id)}
                  onClick={() => toggleSelection(s.id, selectedSkillIds, setSelectedSkillIds)}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="text-xs p-2 rounded-xl border border-gray-200 flex-1 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
              />
              <Button variant="outline" size="sm" onClick={handleAddCustomSkill}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={handleComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Complete & Discover People
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
