import { UserProfile, MatchScore } from '@hotspots/types';
import { MATCH_WEIGHTS } from './weights';

export function calculateMatchScore(currentUser: UserProfile, candidate: UserProfile): MatchScore {
  // Shared interests calculation (max 40 points)
  const currentInterestIds = new Set(currentUser.interests.map((i) => i.id));
  const sharedInterests = candidate.interests.filter((i) => currentInterestIds.has(i.id));
  const maxInterests = Math.max(currentUser.interests.length, 1);
  const sharedInterestsRatio = Math.min(sharedInterests.length / maxInterests, 1);
  const sharedInterestsScore = Math.round(sharedInterestsRatio * MATCH_WEIGHTS.SHARED_INTERESTS);

  // Complementary/different skills (max 25 points)
  // Complementary = candidate has skills that current user does NOT have, promoting skill sharing
  const currentSkillIds = new Set(currentUser.skills.map((s) => s.id));
  const complementarySkills = candidate.skills.filter((s) => !currentSkillIds.has(s.id));
  const maxSkills = Math.max(candidate.skills.length, 1);
  const complementaryRatio = Math.min(complementarySkills.length / maxSkills, 1);
  const complementarySkillsScore = Math.round(complementaryRatio * MATCH_WEIGHTS.COMPLEMENTARY_SKILLS);

  // Shared goals calculation (max 20 points)
  const currentGoalIds = new Set(currentUser.goals.map((g) => g.id));
  const sharedGoals = candidate.goals.filter((g) => currentGoalIds.has(g.id));
  const maxGoals = Math.max(currentUser.goals.length, 1);
  const sharedGoalsRatio = Math.min(sharedGoals.length / maxGoals, 1);
  const sharedGoalsScore = Math.round(sharedGoalsRatio * MATCH_WEIGHTS.SHARED_GOALS);

  // Same campus (max 10 points)
  const sameCampus = Boolean(currentUser.campus_id && candidate.campus_id && currentUser.campus_id === candidate.campus_id);
  const sameCampusScore = sameCampus ? MATCH_WEIGHTS.SAME_CAMPUS : 0;

  // Recent activity score (default 5 points if active)
  const recentActivityScore = MATCH_WEIGHTS.RECENT_ACTIVITY;

  const totalScore = sharedInterestsScore + complementarySkillsScore + sharedGoalsScore + sameCampusScore + recentActivityScore;
  const percentage = Math.min(Math.max(totalScore, 10), 99); // Normalized UX percentage (10% - 99%)

  return {
    totalScore,
    percentage,
    breakdown: {
      sharedInterestsScore,
      complementarySkillsScore,
      sharedGoalsScore,
      sameCampusScore,
      recentActivityScore,
    },
  };
}
