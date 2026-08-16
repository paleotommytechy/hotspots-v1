import { UserProfile, MatchScore } from '@hotspots/types';
import { MATCH_WEIGHTS } from './weights';

export function calculateMatchScore(currentUser: UserProfile, candidate: UserProfile): MatchScore {
  // Shared interests calculation (dominant weight: up to 55 points)
  const currentInterestIds = new Set((currentUser.interests || []).map((i) => i.id));
  const currentCategories = new Set((currentUser.interests || []).map((i) => i.category));
  
  const candidateInterests = candidate.interests || [];
  const exactSharedInterests = candidateInterests.filter((i) => currentInterestIds.has(i.id));
  const sharedCategoryInterests = candidateInterests.filter(
    (i) => !currentInterestIds.has(i.id) && currentCategories.has(i.category)
  );

  const baseCount = Math.max(currentUser.interests?.length || 0, 1);
  const exactRatio = Math.min(exactSharedInterests.length / baseCount, 1);
  const categoryBonus = Math.min((sharedCategoryInterests.length * 0.5) / baseCount, 0.4);
  const sharedInterestsScore = Math.min(
    Math.round((exactRatio * 0.8 + categoryBonus * 0.2 + (exactSharedInterests.length > 0 ? 0.2 : 0)) * MATCH_WEIGHTS.SHARED_INTERESTS),
    MATCH_WEIGHTS.SHARED_INTERESTS
  );

  // Shared goals calculation (max 20 points)
  const currentGoalIds = new Set((currentUser.goals || []).map((g) => g.id));
  const candidateGoals = candidate.goals || [];
  const sharedGoals = candidateGoals.filter((g) => currentGoalIds.has(g.id));
  const maxGoals = Math.max(currentUser.goals?.length || 0, 1);
  const sharedGoalsRatio = currentUser.goals?.length ? Math.min(sharedGoals.length / maxGoals, 1) : 0.5;
  const sharedGoalsScore = Math.round(sharedGoalsRatio * MATCH_WEIGHTS.SHARED_GOALS);

  // Complementary or shared skills (optional signal, max 15 points)
  let complementarySkillsScore = 0;
  if (currentUser.skills?.length && candidate.skills?.length) {
    const currentSkillIds = new Set(currentUser.skills.map((s) => s.id));
    const complementarySkills = candidate.skills.filter((s) => !currentSkillIds.has(s.id));
    const maxSkills = Math.max(candidate.skills.length, 1);
    const complementaryRatio = Math.min(complementarySkills.length / maxSkills, 1);
    complementarySkillsScore = Math.round(complementaryRatio * MATCH_WEIGHTS.COMPLEMENTARY_SKILLS);
  } else {
    // If no skills are defined, give a neutral baseline so users without skills aren't heavily penalized
    complementarySkillsScore = Math.round(MATCH_WEIGHTS.COMPLEMENTARY_SKILLS * 0.5);
  }

  // Same campus / hub (soft bonus, max 5 points)
  const sameCampus = Boolean(
    currentUser.campus_id && candidate.campus_id && currentUser.campus_id === candidate.campus_id
  );
  const sameCampusScore = sameCampus ? MATCH_WEIGHTS.SAME_CAMPUS : 0;

  // Recent activity / base discovery score
  const recentActivityScore = MATCH_WEIGHTS.RECENT_ACTIVITY;

  const totalScore = sharedInterestsScore + sharedGoalsScore + complementarySkillsScore + sameCampusScore + recentActivityScore;
  const percentage = Math.min(Math.max(totalScore, 20), 98);

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
