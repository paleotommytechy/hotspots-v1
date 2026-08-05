import { Campus, Interest, Skill, Goal, UserProfile, ConnectionRequest, Conversation, Message, Post } from '@hotspots/types';

export const MOCK_CAMPUSES: Campus[] = [
  { id: 'camp_1', name: 'Tech Institute of Technology', code: 'TIT', city: 'Cambridge', region: 'MA' },
  { id: 'camp_2', name: 'State University Campus', code: 'SUC', city: 'Austin', region: 'TX' },
  { id: 'camp_3', name: 'Metropolitan Community College', code: 'MCC', city: 'Seattle', region: 'WA' },
];

export const MOCK_INTERESTS: Interest[] = [
  { id: 'int_1', name: 'React & Next.js', category: 'technology', icon_slug: 'code' },
  { id: 'int_2', name: 'UI/UX Design', category: 'design', icon_slug: 'figma' },
  { id: 'int_3', name: 'Artificial Intelligence', category: 'technology', icon_slug: 'cpu' },
  { id: 'int_4', name: 'Product Management', category: 'business', icon_slug: 'briefcase' },
  { id: 'int_5', name: 'Robotics & Hardware', category: 'technology', icon_slug: 'zap' },
  { id: 'int_6', name: 'Mobile App Dev', category: 'technology', icon_slug: 'smartphone' },
  { id: 'int_7', name: 'Digital Art & Motion', category: 'arts', icon_slug: 'image' },
  { id: 'int_8', name: 'Basketball & Fitness', category: 'sports', icon_slug: 'activity' },
];

export const MOCK_SKILLS: Skill[] = [
  { id: 'skl_1', name: 'TypeScript', category: 'Development', level: 'advanced' },
  { id: 'skl_2', name: 'Figma & Prototyping', category: 'Design', level: 'expert' },
  { id: 'skl_3', name: 'Python & PyTorch', category: 'Data Science', level: 'intermediate' },
  { id: 'skl_4', name: 'User Interviewing', category: 'Research', level: 'advanced' },
  { id: 'skl_5', name: 'Tailwind CSS', category: 'Development', level: 'expert' },
  { id: 'skl_6', name: 'System Architecture', category: 'Engineering', level: 'intermediate' },
];

export const MOCK_GOALS: Goal[] = [
  { id: 'gol_1', name: 'Build a Hackathon Project', description: 'Co-found a team for upcoming hackathon' },
  { id: 'gol_2', name: 'Find a Co-Founder', description: 'Looking for technical or design co-founder' },
  { id: 'gol_3', name: 'Peer Mentorship & Learning', description: 'Exchange skills and code review' },
  { id: 'gol_4', name: 'Casual Study Group', description: 'Meet up regularly to study and collaborate' },
];

export const MOCK_PROFILES: UserProfile[] = [];

export const MOCK_POSTS: Post[] = [];

export const MOCK_CONNECTIONS: ConnectionRequest[] = [];

export const MOCK_CONVERSATIONS: Conversation[] = [];

export const MOCK_MESSAGES: Record<string, Message[]> = {};

