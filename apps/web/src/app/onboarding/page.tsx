'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataService } from '@hotspots/database';
import { Campus, Interest, Skill, Goal } from '@hotspots/types';
import { Button, Chip } from '@hotspots/ui-web';
import { ArrowRight, CheckCircle2, Building, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [taxonomy, setTaxonomy] = useState<{ interests: Interest[]; skills: Skill[]; goals: Goal[] }>({
    interests: [],
    skills: [],
    goals: [],
  });

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCampusId, setSelectedCampusId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [level, setLevel] = useState('Undergraduate');

  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const cList = await DataService.getCampuses();
      const tax = await DataService.getTaxonomy();
      setCampuses(cList);
      setTaxonomy(tax);
      if (cList.length > 0) setSelectedCampusId(cList[0].id);
      if (tax.interests.length > 0) setSelectedInterestIds([tax.interests[0].id, tax.interests[1]?.id].filter(Boolean));
      if (tax.skills.length > 0) setSelectedSkillIds([tax.skills[0].id]);
      if (tax.goals.length > 0) setSelectedGoalIds([tax.goals[0].id]);
    }
    loadData();
  }, []);

  const toggleSelection = (id: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleComplete = async () => {
    const campusObj = campuses.find((c) => c.id === selectedCampusId);
    const chosenInterests = taxonomy.interests.filter((i) => selectedInterestIds.includes(i.id));
    const chosenSkills = taxonomy.skills.filter((s) => selectedSkillIds.includes(s.id));
    const chosenGoals = taxonomy.goals.filter((g) => selectedGoalIds.includes(g.id));

    await DataService.updateProfile({
      display_name: displayName || 'New User',
      username: username || `user_${Date.now()}`,
      bio: bio || 'Excited to connect and build projects!',
      campus_id: selectedCampusId,
      campus_name: campusObj?.name || 'Campus',
      department,
      level,
      interests: chosenInterests,
      skills: chosenSkills,
      goals: chosenGoals,
      is_onboarded: true,
    });

    router.push('/discover');
  };

  return (
    <div className="flex flex-col space-y-5 py-3">
      {/* Step Progress Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3]">
        <div className="flex items-center justify-between text-xs font-bold text-[#414643] mb-2">
          <span>Profile Onboarding</span>
          <span className="text-[#C62828]">Step {step} of 3</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#C62828] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Info & Campus */}
      {step === 1 && (
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] space-y-4">
          <h3 className="text-lg font-bold text-[#2B2B2B]">Basic Information</h3>
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full text-xs p-3 rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alexj"
              className="w-full text-xs p-3 rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Campus / Community</label>
            <select
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white"
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Department & Level</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department"
                className="w-full text-xs p-3 rounded-xl border border-gray-200"
              />
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="Level / Year"
                className="w-full text-xs p-3 rounded-xl border border-gray-200"
              />
            </div>
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={() => setStep(2)}>
            Next: Select Interests <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Interests & Skills */}
      {step === 2 && (
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#2B2B2B]">Interests & Passions</h3>
            <p className="text-xs text-[#414643]">Pick topics you love working on or learning</p>
            <div className="flex flex-wrap gap-2 mt-3">
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
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#2B2B2B] pt-2">Skills You Bring</h3>
            <p className="text-xs text-[#414643]">What are your super powers?</p>
            <div className="flex flex-wrap gap-2 mt-3">
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
          </div>

          <div className="flex gap-2 pt-3">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={() => setStep(3)}>
              Next: Select Goals
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Goals & Bio */}
      {step === 3 && (
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#2B2B2B]">What are you looking for?</h3>
            <p className="text-xs text-[#414643]">Select your primary collaboration goals</p>
            <div className="space-y-2 mt-3">
              {taxonomy.goals.map((g) => {
                const isSelected = selectedGoalIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleSelection(g.id, selectedGoalIds, setSelectedGoalIds)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#C62828] bg-[#FFF3C4]/40 font-bold'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs text-[#2B2B2B] font-bold">{g.name}</div>
                    <div className="text-[11px] text-[#414643] font-normal">{g.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others what you are excited about..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 h-20"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={handleComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
