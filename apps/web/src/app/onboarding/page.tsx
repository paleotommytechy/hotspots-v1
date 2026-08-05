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
  GraduationCap,
  Sparkles,
  Award,
  Target,
  Plus,
  Image as ImageIcon,
  BookOpen,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
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

  // NO assumed profile details - strictly unpopulated default states
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCampusId, setSelectedCampusId] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  // Custom additions
  const [customInterest, setCustomInterest] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    async function loadData() {
      const cList = await DataService.getCampuses();
      const tax = await DataService.getTaxonomy();
      setCampuses(cList);
      setTaxonomy(tax);

      // Pre-fill only if user already started filling out their profile (e.g. returning to edit)
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
    const newInt = await DataService.adminAddInterest({
      name: customInterest.trim(),
      category: 'technology',
    });
    setTaxonomy((prev) => ({ ...prev, interests: [...prev.interests, newInt] }));
    setSelectedInterestIds((prev) => [...prev, newInt.id]);
    setCustomInterest('');
    toast.success(`Added interest "${newInt.name}"`);
  };

  const handleAddCustomSkill = async () => {
    if (!customSkill.trim()) return;
    const newSkl = await DataService.adminAddSkill({
      name: customSkill.trim(),
      category: 'Custom',
      level: 'intermediate',
    });
    setTaxonomy((prev) => ({ ...prev, skills: [...prev.skills, newSkl] }));
    setSelectedSkillIds((prev) => [...prev, newSkl.id]);
    setCustomSkill('');
    toast.success(`Added skill "${newSkl.name}"`);
  };

  const validateStep1 = () => {
    if (!displayName.trim()) {
      toast.error('Please enter your Display Name');
      return false;
    }
    if (!username.trim()) {
      toast.error('Please choose a Username');
      return false;
    }
    if (!selectedCampusId) {
      toast.error('Please select your Campus or Community');
      return false;
    }
    if (!department.trim()) {
      toast.error('Please enter your Department or Field of Study');
      return false;
    }
    if (!level.trim()) {
      toast.error('Please select or specify your Academic Level');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (selectedInterestIds.length === 0) {
      toast.error('Please select at least 1 interest tag');
      return false;
    }
    if (selectedSkillIds.length === 0) {
      toast.error('Please select at least 1 skill');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!bio.trim() || bio.trim().length < 8) {
      toast.error('Please write a brief bio (at least 8 characters)');
      return false;
    }
    if (selectedGoalIds.length === 0) {
      toast.error('Please select at least 1 collaboration goal');
      return false;
    }
    return true;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleNextStep2 = () => {
    if (validateStep2()) setStep(3);
  };

  const handleComplete = async () => {
    if (!validateStep3()) return;

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
      campus_id: selectedCampusId,
      campus_name: campusObj?.name || 'Campus',
      department: department.trim(),
      level: level.trim(),
      interests: chosenInterests,
      skills: chosenSkills,
      goals: chosenGoals,
      is_onboarded: true,
    });

    await refreshUser();
    toast.success('Your profile is set up! Welcome to Hotspots!');
    router.push('/discover');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 px-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#C62828] to-[#F57C00] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Profile Setup
          </span>
          <h1 className="text-2xl font-black tracking-tight">Set Up Your Profile</h1>
          <p className="text-xs text-red-100 mt-1 max-w-md">
            Help fellow campus students find you by providing your real profile details and interests.
          </p>
        </div>
      </div>

      {/* Step Progress Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#414643] mb-2">
          <span>
            {step === 1 && 'Step 1: Academic & Personal Info'}
            {step === 2 && 'Step 2: Interests & Skills'}
            {step === 3 && 'Step 3: Bio & Collaboration Goals'}
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

      {/* STEP 1: BASIC INFO */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
              <User className="w-5 h-5 text-[#C62828]" /> Personal Details
            </h3>
            <p className="text-xs text-[#619B8A] mt-0.5">Please fill out your identity and campus location.</p>
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

          {/* Campus Select */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              Campus / Institution <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            >
              <option value="" disabled>
                -- Select Your Campus --
              </option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code}) - {c.city}, {c.region}
                </option>
              ))}
            </select>
          </div>

          {/* Department & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Department / Major <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
                Academic Level <span className="text-red-500">*</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C62828]"
              >
                <option value="" disabled>
                  -- Select Level --
                </option>
                <option value="Undergraduate Year 1">Undergraduate Year 1</option>
                <option value="Undergraduate Year 2">Undergraduate Year 2</option>
                <option value="Undergraduate Year 3">Undergraduate Year 3</option>
                <option value="Undergraduate Year 4">Undergraduate Year 4+</option>
                <option value="Masters Student">Masters Student</option>
                <option value="PhD Candidate">PhD Candidate</option>
                <option value="Alumni / Researcher">Alumni / Researcher</option>
              </select>
            </div>
          </div>

          {/* Avatar Choice */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-2">
              Profile Avatar (Select Preset or Enter URL)
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

          <Button variant="primary" size="lg" fullWidth onClick={handleNextStep1} className="mt-4">
            Continue to Interests <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* STEP 2: INTERESTS & SKILLS */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-xs space-y-6">
          {/* Interests Section */}
          <div>
            <div className="border-b border-gray-100 pb-2 mb-3">
              <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F57C00]" /> Select Your Interests <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-[#619B8A]">Pick at least 1 topic you love or want to work on.</p>
            </div>

            <div className="flex flex-wrap gap-2 my-3">
              {taxonomy.interests.map((i) => (
                <Chip
                  key={i.id}
                  label={i.name}
                  variant="interest"
                  selected={selectedInterestIds.includes(i.id)}
                  onClick={() => toggleSelection(i.id, selectedInterestIds, setSelectedInterestIds)}
                />
              ))}
            </div>

            {/* Custom Interest Input */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom interest tag..."
                className="text-xs p-2.5 rounded-xl border border-gray-200 flex-1 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
              />
              <Button variant="outline" size="sm" onClick={handleAddCustomInterest}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="border-b border-gray-100 pb-2 mb-3">
              <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#619B8A]" /> Your Skills <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-[#619B8A]">Select at least 1 technical or creative skill.</p>
            </div>

            <div className="flex flex-wrap gap-2 my-3">
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

            {/* Custom Skill Input */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="text-xs p-2.5 rounded-xl border border-gray-200 flex-1 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
              />
              <Button variant="outline" size="sm" onClick={handleAddCustomSkill}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={handleNextStep2}>
              Continue to Goals <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: BIO & GOALS */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-xs space-y-5">
          {/* Goals */}
          <div>
            <div className="border-b border-gray-100 pb-2 mb-3">
              <h3 className="text-base font-bold text-[#2B2B2B] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#C62828]" /> Primary Collaboration Goal <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-[#619B8A]">What are you hoping to build or achieve on Hotspots?</p>
            </div>

            <div className="space-y-2 mt-3">
              {taxonomy.goals.map((g) => {
                const isSelected = selectedGoalIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleSelection(g.id, selectedGoalIds, setSelectedGoalIds)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
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

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">
              About You / Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Introduce yourself! Mention your current projects, what you like working on, or what kind of collaborators you are looking for..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 h-28 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={handleComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Profile Setup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
