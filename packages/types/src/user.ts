export interface Campus {
  id: string;
  name: string;
  code: string;
  city: string;
  region: string;
}

export interface Interest {
  id: string;
  name: string;
  category:
    | 'gaming'
    | 'music'
    | 'arts'
    | 'crafts'
    | 'outdoors'
    | 'sports'
    | 'food'
    | 'fandom'
    | 'technology'
    | 'collecting'
    | 'lifestyle'
    | 'science'
    | 'reading'
    | 'design'
    | 'business'
    | 'general';
  icon_slug?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Goal {
  id: string;
  name: string;
  description: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  campus_id: string;
  campus_name?: string;
  department: string;
  level: string;
  interests: Interest[];
  skills: Skill[];
  goals: Goal[];
  social_links?: SocialLinks;
  is_onboarded: boolean;
  role?: 'admin' | 'user';
  is_blocked?: boolean;
  created_at: string;
  updated_at: string;
}
