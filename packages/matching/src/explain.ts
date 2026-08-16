import { UserProfile, MatchExplanation } from '@hotspots/types';

export function explainMatch(currentUser: UserProfile, candidate: UserProfile): MatchExplanation {
  const currentInterestIds = new Set((currentUser.interests || []).map((i) => i.id));
  const sharedInterests = (candidate.interests || []).filter((i) => currentInterestIds.has(i.id));

  const currentSkillIds = new Set((currentUser.skills || []).map((s) => s.id));
  const complementarySkills = (candidate.skills || []).filter((s) => !currentSkillIds.has(s.id));

  const currentGoalIds = new Set((currentUser.goals || []).map((g) => g.id));
  const sharedGoals = (candidate.goals || []).filter((g) => currentGoalIds.has(g.id));

  const sameCampus = Boolean(
    currentUser.campus_id && candidate.campus_id && currentUser.campus_id === candidate.campus_id
  );
  const campusName = sameCampus ? candidate.campus_name || currentUser.campus_name : undefined;

  const summaryBullets: string[] = [];

  if (sharedInterests.length > 0) {
    if (sharedInterests.length === 1) {
      summaryBullets.push(`Both passionate about ${sharedInterests[0].name}`);
    } else {
      summaryBullets.push(`Shared interests: ${sharedInterests.map((i) => i.name).slice(0, 3).join(', ')}`);
    }
  }

  if (sharedGoals.length > 0) {
    summaryBullets.push(`Mutual focus: ${sharedGoals[0].name}`);
  }

  if (complementarySkills.length > 0 && candidate.skills?.length) {
    summaryBullets.push(`Can share tips on ${complementarySkills[0].name}`);
  }

  if (sameCampus && campusName) {
    summaryBullets.push(`Connected in ${campusName}`);
  }

  if (summaryBullets.length === 0) {
    summaryBullets.push('Active member with overlapping creative vibes');
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
