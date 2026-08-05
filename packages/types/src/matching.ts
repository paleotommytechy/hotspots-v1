import { UserProfile, Interest, Skill, Goal } from './user';

export interface MatchScore {
  totalScore: number;
  percentage: number;
  breakdown: {
    sharedInterestsScore: number;
    complementarySkillsScore: number;
    sharedGoalsScore: number;
    sameCampusScore: number;
    recentActivityScore: number;
  };
}

export interface MatchExplanation {
  sharedInterests: Interest[];
  complementarySkills: Skill[];
  sharedGoals: Goal[];
  sameCampus: boolean;
  campusName?: string;
  summaryBullets: string[];
}

export interface CandidateProfile {
  profile: UserProfile;
  matchScore: MatchScore;
  explanation: MatchExplanation;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_campus?: string;
  content: string;
  image_url?: string;
  interest_tags?: string[];
  likes_count: number;
  liked_by_me?: boolean;
  comments: PostComment[];
  created_at: string;
}
