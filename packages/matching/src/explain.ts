import { UserProfile, MatchExplanation } from '@hotspots/types';

export function explainMatch(currentUser: UserProfile, candidate: UserProfile): MatchExplanation {
  const currentInterestIds = new Set(currentUser.interests.map((i) => i.id));
  const sharedInterests = candidate.interests.filter((i) => currentInterestIds.has(i.id));

  const currentSkillIds = new Set(currentUser.skills.map((s) => s.id));
  const complementarySkills = candidate.skills.filter((s) => !currentSkillIds.has(s.id));

  const currentGoalIds = new Set(currentUser.goals.map((g) => g.id));
  const sharedGoals = candidate.goals.filter((g) => currentGoalIds.has(g.id));

  const sameCampus = Boolean(currentUser.campus_id && candidate.campus_id && currentUser.campus_id === candidate.campus_id);
  const campusName = sameCampus ? candidate.campus_name || currentUser.campus_name : undefined;

  const summaryBullets: string[] = [];

  if (sharedInterests.length > 0) {
    summaryBullets.push(`You both like ${sharedInterests.map((i) => i.name).slice(0, 3).join(', ')}`);
  }

  if (complementarySkills.length > 0) {
    summaryBullets.push(`Can assist you with ${complementarySkills.map((s) => s.name).slice(0, 2).join(', ')}`);
  }

  if (sharedGoals.length > 0) {
    summaryBullets.push(`Shared goal: ${sharedGoals[0].name}`);
  }

  if (sameCampus && campusName) {
    summaryBullets.push(`Both at ${campusName}`);
  }

  if (summaryBullets.length === 0) {
    summaryBullets.push('Active member in your community');
  }

  return {
    sharedInterests,
    complementarySkills,
    sharedGoals,
    sameCampus,
    campusName,
    summaryBullets,
  };
}
