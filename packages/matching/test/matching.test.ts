import { describe, it, expect } from 'vitest';
import { calculateMatchScore, explainMatch, rankCandidates } from '../src';
import { UserProfile } from '@hotspots/types';

const userA: UserProfile = {
  id: 'usr_1',
  user_id: 'u1',
  display_name: 'Alex Rivera',
  username: 'arivera',
  avatar_url: '',
  bio: 'CS Major & UI designer',
  campus_id: 'camp_1',
  campus_name: 'MIT',
  department: 'Computer Science',
  level: 'Undergraduate',
  interests: [
    { id: 'int_1', name: 'React', category: 'technology' },
    { id: 'int_2', name: 'UI/UX Design', category: 'design' },
    { id: 'int_3', name: 'Machine Learning', category: 'technology' },
  ],
  skills: [{ id: 'skl_1', name: 'TypeScript', category: 'Dev' }],
  goals: [{ id: 'gol_1', name: 'Build a Startup', description: 'Co-found tech product' }],
  is_onboarded: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const userB: UserProfile = {
  id: 'usr_2',
  user_id: 'u2',
  display_name: 'Sarah Chen',
  username: 'schen',
  avatar_url: '',
  bio: 'Design enthusiast',
  campus_id: 'camp_1',
  campus_name: 'MIT',
  department: 'Design',
  level: 'Graduate',
  interests: [
    { id: 'int_1', name: 'React', category: 'technology' },
    { id: 'int_2', name: 'UI/UX Design', category: 'design' },
  ],
  skills: [
    { id: 'skl_2', name: 'Figma', category: 'Design' },
    { id: 'skl_3', name: 'User Research', category: 'Design' },
  ],
  goals: [{ id: 'gol_1', name: 'Build a Startup', description: 'Co-found tech product' }],
  is_onboarded: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('Matching Engine', () => {
  it('calculates match score correctly with shared interests, goals, and campus', () => {
    const score = calculateMatchScore(userA, userB);
    expect(score.percentage).toBeGreaterThan(50);
    expect(score.breakdown.sameCampusScore).toBe(10);
    expect(score.breakdown.sharedGoalsScore).toBe(20);
  });

  it('generates clear match explanations', () => {
    const explanation = explainMatch(userA, userB);
    expect(explanation.sameCampus).toBe(true);
    expect(explanation.sharedInterests).toHaveLength(2);
    expect(explanation.summaryBullets.length).toBeGreaterThan(0);
    expect(explanation.summaryBullets[0]).toContain('React');
  });

  it('ranks candidates by match percentage and filters connected users', () => {
    const ranked = rankCandidates(userA, [userB], { connectedUserIds: [] });
    expect(ranked).toHaveLength(1);
    expect(ranked[0].profile.username).toBe('schen');

    const filtered = rankCandidates(userA, [userB], { connectedUserIds: ['usr_2'] });
    expect(filtered).toHaveLength(0);
  });
});
