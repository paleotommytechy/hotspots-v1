import { UserProfile, CandidateProfile } from '@hotspots/types';
import { calculateMatchScore } from './score';
import { explainMatch } from './explain';

export interface RankOptions {
  blockedUserIds?: string[];
  connectedUserIds?: string[];
  campusIdFilter?: string;
  interestFilter?: string;
}

export function rankCandidates(
  currentUser: UserProfile,
  allProfiles: UserProfile[],
  options: RankOptions = {}
): CandidateProfile[] {
  const { blockedUserIds = [], connectedUserIds = [], campusIdFilter, interestFilter } = options;
  const excludedIds = new Set([currentUser.id, currentUser.user_id, ...blockedUserIds, ...connectedUserIds]);

  const eligibleCandidates = allProfiles.filter((candidate) => {
    if (excludedIds.has(candidate.id) || excludedIds.has(candidate.user_id)) {
      return false;
    }
    if (campusIdFilter && candidate.campus_id !== campusIdFilter) {
      return false;
    }
    if (interestFilter && !candidate.interests.some((i) => i.id === interestFilter || i.name.toLowerCase().includes(interestFilter.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const ranked: CandidateProfile[] = eligibleCandidates.map((candidate) => {
    const matchScore = calculateMatchScore(currentUser, candidate);
    const explanation = explainMatch(currentUser, candidate);
    return {
      profile: candidate,
      matchScore,
      explanation,
    };
  });

  // Sort descending by percentage
  return ranked.sort((a, b) => b.matchScore.percentage - a.matchScore.percentage);
}
