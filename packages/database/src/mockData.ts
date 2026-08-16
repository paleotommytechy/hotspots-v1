import { Campus, Interest, Skill, Goal, UserProfile, ConnectionRequest, Conversation, Message, Post } from '@hotspots/types';

export const MOCK_CAMPUSES: Campus[] = [
  { id: 'camp_1', name: 'Greater Boston & Cambridge Hub', code: 'BOS', city: 'Cambridge', region: 'MA' },
  { id: 'camp_2', name: 'Austin Creative District', code: 'ATX', city: 'Austin', region: 'TX' },
  { id: 'camp_3', name: 'Pacific Northwest & Seattle Hub', code: 'SEA', city: 'Seattle', region: 'WA' },
  { id: 'camp_4', name: 'San Francisco Bay Area Hub', code: 'SFB', city: 'San Francisco', region: 'CA' },
  { id: 'camp_5', name: 'Online & Global Community', code: 'GLB', city: 'Global', region: 'Remote' },
];

export const MOCK_INTERESTS: Interest[] = [
  // Gaming
  { id: 'int_game_1', name: 'Board Games & Tabletop', category: 'gaming', icon_slug: 'dice' },
  { id: 'int_game_2', name: 'Dungeons & Dragons', category: 'gaming', icon_slug: 'shield' },
  { id: 'int_game_3', name: 'PC & Console Gaming', category: 'gaming', icon_slug: 'gamepad' },
  { id: 'int_game_4', name: 'Indie Game Dev', category: 'gaming', icon_slug: 'sparkles' },
  { id: 'int_game_5', name: 'Retro Gaming & Emulation', category: 'gaming', icon_slug: 'tv' },
  { id: 'int_game_6', name: 'Competitive Esports', category: 'gaming', icon_slug: 'trophy' },

  // Music
  { id: 'int_mus_1', name: 'Indie Rock & Guitar', category: 'music', icon_slug: 'music' },
  { id: 'int_mus_2', name: 'Electronic Music & Synth', category: 'music', icon_slug: 'sliders' },
  { id: 'int_mus_3', name: 'Vinyl & Record Collecting', category: 'music', icon_slug: 'disc' },
  { id: 'int_mus_4', name: 'Piano & Classical', category: 'music', icon_slug: 'headphones' },
  { id: 'int_mus_5', name: 'Songwriting & Vocals', category: 'music', icon_slug: 'mic' },
  { id: 'int_mus_6', name: 'DJing & Audio Mixing', category: 'music', icon_slug: 'radio' },

  // Arts & Design
  { id: 'int_art_1', name: 'Digital Illustration', category: 'arts', icon_slug: 'pen-tool' },
  { id: 'int_art_2', name: 'Ceramics & Pottery', category: 'arts', icon_slug: 'heart' },
  { id: 'int_art_3', name: 'Photography & 35mm Film', category: 'arts', icon_slug: 'camera' },
  { id: 'int_art_4', name: 'Oil Painting & Watercolor', category: 'arts', icon_slug: 'brush' },
  { id: 'int_art_5', name: '3D Modeling & Blender', category: 'arts', icon_slug: 'box' },
  { id: 'int_art_6', name: 'Comics & Manga Art', category: 'arts', icon_slug: 'book-open' },

  // Crafts & Making
  { id: 'int_crf_1', name: 'Mechanical Keyboards', category: 'crafts', icon_slug: 'keyboard' },
  { id: 'int_crf_2', name: 'Cosplay & Prop Making', category: 'crafts', icon_slug: 'scissors' },
  { id: 'int_crf_3', name: 'Knitting & Fiber Arts', category: 'crafts', icon_slug: 'feather' },
  { id: 'int_crf_4', name: '3D Printing & CAD', category: 'crafts', icon_slug: 'printer' },
  { id: 'int_crf_5', name: 'Woodworking & Carpentry', category: 'crafts', icon_slug: 'tool' },
  { id: 'int_crf_6', name: 'Electronics & Arduino', category: 'crafts', icon_slug: 'cpu' },

  // Outdoors & Sports
  { id: 'int_out_1', name: 'Rock Climbing & Bouldering', category: 'outdoors', icon_slug: 'mountain' },
  { id: 'int_out_2', name: 'Hiking & Trail Running', category: 'outdoors', icon_slug: 'compass' },
  { id: 'int_out_3', name: 'Skateboarding & Longboarding', category: 'sports', icon_slug: 'wind' },
  { id: 'int_out_4', name: 'Biking & Cycling', category: 'sports', icon_slug: 'activity' },
  { id: 'int_out_5', name: 'Gardening & Urban Farming', category: 'outdoors', icon_slug: 'sun' },
  { id: 'int_out_6', name: 'Kayaking & Water Sports', category: 'outdoors', icon_slug: 'anchor' },

  // Food & Culinary
  { id: 'int_fod_1', name: 'Specialty Coffee & Espresso', category: 'food', icon_slug: 'coffee' },
  { id: 'int_fod_2', name: 'Sourdough & Baking', category: 'food', icon_slug: 'cake' },
  { id: 'int_fod_3', name: 'Fermentation & Home Cooking', category: 'food', icon_slug: 'utensils' },
  { id: 'int_fod_4', name: 'Tea Brewing & Culture', category: 'food', icon_slug: 'cup-soda' },

  // Fandom & Entertainment
  { id: 'int_fan_1', name: 'Anime & Manga', category: 'fandom', icon_slug: 'tv' },
  { id: 'int_fan_2', name: 'Sci-Fi & Fantasy Novels', category: 'reading', icon_slug: 'book' },
  { id: 'int_fan_3', name: 'Film & Cinema Analysis', category: 'fandom', icon_slug: 'film' },
  { id: 'int_fan_4', name: 'Book Clubs & Literature', category: 'reading', icon_slug: 'bookmark' },

  // Collecting & Lifestyle
  { id: 'int_col_1', name: 'Vintage Fashion & Thrifting', category: 'collecting', icon_slug: 'shopping-bag' },
  { id: 'int_col_2', name: 'Trading Cards (Pokemon/MTG)', category: 'collecting', icon_slug: 'layers' },
  { id: 'int_col_3', name: 'Fountain Pens & Stationery', category: 'collecting', icon_slug: 'edit' },

  // Technology & Science
  { id: 'int_tch_1', name: 'Creative Coding & Gen Art', category: 'technology', icon_slug: 'code' },
  { id: 'int_tch_2', name: 'Astronomy & Stargazing', category: 'science', icon_slug: 'moon' },
  { id: 'int_tch_3', name: 'Open Source & Web Dev', category: 'technology', icon_slug: 'globe' },
];

export const MOCK_SKILLS: Skill[] = [
  { id: 'skl_1', name: 'Tabletop Game Mastering (DM)', category: 'Gaming', level: 'expert' },
  { id: 'skl_2', name: 'Guitar & Bass Playing', category: 'Music', level: 'advanced' },
  { id: 'skl_3', name: 'Digital Illustration & Procreate', category: 'Arts', level: 'expert' },
  { id: 'skl_4', name: '3D Modeling & Blender', category: 'Design', level: 'intermediate' },
  { id: 'skl_5', name: 'Sourdough Baking & Fermentation', category: 'Culinary', level: 'advanced' },
  { id: 'skl_6', name: 'Bouldering & Route Reading', category: 'Outdoors', level: 'intermediate' },
  { id: 'skl_7', name: 'Prop Making & Foam Crafting', category: 'Crafts', level: 'advanced' },
  { id: 'skl_8', name: 'Espresso Dialing & Latte Art', category: 'Culinary', level: 'expert' },
  { id: 'skl_9', name: 'Creative Coding & TypeScript', category: 'Development', level: 'advanced' },
  { id: 'skl_10', name: '35mm Film Photography', category: 'Media', level: 'advanced' },
];

export const MOCK_GOALS: Goal[] = [
  { id: 'gol_1', name: 'Casual Hangouts & Meetups', description: 'Meet local hobbyists for coffee, walks, or casual hangouts' },
  { id: 'gol_2', name: 'Creative Collaboration', description: 'Collaborate on art, zines, games, music, or DIY projects' },
  { id: 'gol_3', name: 'Jamming & Gaming Sessions', description: 'Play music, run tabletop campaigns, or queue up for game nights' },
  { id: 'gol_4', name: 'Skill Exchange & Learning', description: 'Share knowledge, give tips, and learn new crafts together' },
  { id: 'gol_5', name: 'Outdoor & Activity Partner', description: 'Explore trails, climb routes, skate, or attend local events together' },
];

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'usr_me',
    user_id: 'usr_me',
    display_name: 'Alex Rivera',
    username: 'arivera',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Tabletop campaign master, indie game tinkerer, and electronic synthesizer hobbyist. Always down for coffee and a D&D one-shot!',
    campus_id: 'camp_1',
    campus_name: 'Greater Boston & Cambridge Hub',
    department: 'Creative Tech & Media',
    level: 'Community Member',
    interests: [
      MOCK_INTERESTS[1], // Dungeons & Dragons
      MOCK_INTERESTS[0], // Board Games
      MOCK_INTERESTS[3], // Indie Game Dev
      MOCK_INTERESTS[7], // Electronic Music & Synth
      MOCK_INTERESTS[24], // Specialty Coffee
    ],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[8]],
    goals: [MOCK_GOALS[1], MOCK_GOALS[2]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'usr_2',
    user_id: 'usr_2',
    display_name: 'Maya Chen',
    username: 'mayapottery',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Ceramicist throwing stoneware bowls and capturing analog moments on 35mm film. Weekend sourdough baker and community garden volunteer.',
    campus_id: 'camp_1',
    campus_name: 'Greater Boston & Cambridge Hub',
    department: 'Ceramics & Visual Arts',
    level: 'Studio Artist',
    interests: [
      MOCK_INTERESTS[13], // Ceramics & Pottery
      MOCK_INTERESTS[14], // Photography & 35mm Film
      MOCK_INTERESTS[25], // Sourdough & Baking
      MOCK_INTERESTS[22], // Gardening & Urban Farming
      MOCK_INTERESTS[27], // Tea Brewing
    ],
    skills: [MOCK_SKILLS[4], MOCK_SKILLS[9]],
    goals: [MOCK_GOALS[0], MOCK_GOALS[3]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-02-15T12:00:00Z',
    updated_at: '2026-08-02T12:00:00Z',
  },
  {
    id: 'usr_3',
    user_id: 'usr_3',
    display_name: 'Jordan Patel',
    username: 'jordanclimb',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Bouldering problem-solver (V4-V6), custom mechanical keyboard enthusiast, and retro game preservation geek.',
    campus_id: 'camp_2',
    campus_name: 'Austin Creative District',
    department: 'Industrial Design',
    level: 'Hobbyist Maker',
    interests: [
      MOCK_INTERESTS[18], // Rock Climbing & Bouldering
      MOCK_INTERESTS[16], // Mechanical Keyboards
      MOCK_INTERESTS[4],  // Retro Gaming
      MOCK_INTERESTS[19], // Hiking & Trail Running
      MOCK_INTERESTS[24], // Specialty Coffee
    ],
    skills: [MOCK_SKILLS[5], MOCK_SKILLS[8]],
    goals: [MOCK_GOALS[0], MOCK_GOALS[4]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-03-01T09:30:00Z',
    updated_at: '2026-08-05T09:30:00Z',
  },
  {
    id: 'usr_4',
    user_id: 'usr_4',
    display_name: 'Elena Rostova',
    username: 'elenasynth',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    bio: 'Bassist and synth-pop composer. I love collecting Japanese city-pop vinyl, illustrating indie zines, and playing cozy tabletop games.',
    campus_id: 'camp_1',
    campus_name: 'Greater Boston & Cambridge Hub',
    department: 'Audio Production',
    level: 'Musician & Illustrator',
    interests: [
      MOCK_INTERESTS[6],  // Indie Rock & Guitar
      MOCK_INTERESTS[7],  // Electronic Music & Synth
      MOCK_INTERESTS[8],  // Vinyl & Record Collecting
      MOCK_INTERESTS[12], // Digital Illustration
      MOCK_INTERESTS[0],  // Board Games & Tabletop
    ],
    skills: [MOCK_SKILLS[1], MOCK_SKILLS[2]],
    goals: [MOCK_GOALS[1], MOCK_GOALS[2]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-03-12T14:20:00Z',
    updated_at: '2026-08-10T14:20:00Z',
  },
  {
    id: 'usr_5',
    user_id: 'usr_5',
    display_name: 'Marcus Vance',
    username: 'marcus_crafts',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Cosplayer, prop builder, and 3D printing nerd. Huge fan of anime conventions, dark fantasy worldbuilding, and sci-fi books.',
    campus_id: 'camp_3',
    campus_name: 'Pacific Northwest & Seattle Hub',
    department: 'Maker Community',
    level: 'Prop Fabricator',
    interests: [
      MOCK_INTERESTS[17], // Cosplay & Prop Making
      MOCK_INTERESTS[20], // 3D Printing & CAD
      MOCK_INTERESTS[28], // Anime & Manga
      MOCK_INTERESTS[29], // Sci-Fi & Fantasy Novels
      MOCK_INTERESTS[1],  // D&D
    ],
    skills: [MOCK_SKILLS[6], MOCK_SKILLS[3]],
    goals: [MOCK_GOALS[1], MOCK_GOALS[3]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-04-05T16:00:00Z',
    updated_at: '2026-08-08T16:00:00Z',
  },
  {
    id: 'usr_6',
    user_id: 'usr_6',
    display_name: 'Chloe Dubois',
    username: 'chloetea',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Gongfu tea brewing practitioner, amateur stargazer with a 8" Dobsonian telescope, and avid speculative fiction reader.',
    campus_id: 'camp_4',
    campus_name: 'San Francisco Bay Area Hub',
    department: 'Astronomy & Literature',
    level: 'Stargazer',
    interests: [
      MOCK_INTERESTS[27], // Tea Brewing
      MOCK_INTERESTS[35], // Astronomy & Stargazing
      MOCK_INTERESTS[29], // Sci-Fi & Fantasy Novels
      MOCK_INTERESTS[31], // Book Clubs & Literature
      MOCK_INTERESTS[33], // Fountain Pens
    ],
    skills: [MOCK_SKILLS[7], MOCK_SKILLS[9]],
    goals: [MOCK_GOALS[0], MOCK_GOALS[3]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-04-20T11:15:00Z',
    updated_at: '2026-08-11T11:15:00Z',
  },
  {
    id: 'usr_7',
    user_id: 'usr_7',
    display_name: 'Kai Tanaka',
    username: 'kaicodesart',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    bio: 'Creative coder building generative canvas shaders and modular audio patches. Love collaborating on interactive installations.',
    campus_id: 'camp_5',
    campus_name: 'Online & Global Community',
    department: 'Digital Arts',
    level: 'Creative Technologist',
    interests: [
      MOCK_INTERESTS[34], // Creative Coding
      MOCK_INTERESTS[7],  // Electronic Music & Synth
      MOCK_INTERESTS[15], // 3D Modeling & Blender
      MOCK_INTERESTS[3],  // Indie Game Dev
      MOCK_INTERESTS[36], // Open Source
    ],
    skills: [MOCK_SKILLS[8], MOCK_SKILLS[3]],
    goals: [MOCK_GOALS[1], MOCK_GOALS[4]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-05-01T15:45:00Z',
    updated_at: '2026-08-12T15:45:00Z',
  },
  {
    id: 'usr_8',
    user_id: 'usr_8',
    display_name: 'Sarah Jenkins',
    username: 'sarahskates',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    bio: 'Longboard cruiser, vintage denim thrifter, and specialty coffee hunter. Looking for friends to cruise the waterfront trails.',
    campus_id: 'camp_2',
    campus_name: 'Austin Creative District',
    department: 'Urban Culture',
    level: 'Local Explorer',
    interests: [
      MOCK_INTERESTS[20], // Skateboarding
      MOCK_INTERESTS[19], // Hiking & Trail Running
      MOCK_INTERESTS[24], // Specialty Coffee
      MOCK_INTERESTS[31], // Vintage Fashion & Thrifting
      MOCK_INTERESTS[8],  // Vinyl & Record Collecting
    ],
    skills: [MOCK_SKILLS[7], MOCK_SKILLS[5]],
    goals: [MOCK_GOALS[0], MOCK_GOALS[4]],
    is_onboarded: true,
    role: 'user',
    is_blocked: false,
    created_at: '2026-05-18T18:10:00Z',
    updated_at: '2026-08-14T18:10:00Z',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    author_id: 'usr_me',
    author_name: 'Alex Rivera',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    author_campus: 'Greater Boston & Cambridge Hub',
    content: 'Running a casual D&D 5e one-shot adventure this Saturday afternoon! Looking for 2 more players (beginners warmly welcomed). We will have warm tea and snacks ready.',
    interest_tags: ['Dungeons & Dragons', 'Board Games & Tabletop', 'Tea Brewing & Culture'],
    likes_count: 7,
    liked_by_me: true,
    comments: [
      {
        id: 'cmt_1',
        post_id: 'post_1',
        author_id: 'usr_4',
        author_name: 'Elena Rostova',
        author_avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
        content: 'I would love to join! I have a Level 3 bard character rolled up and ready.',
        created_at: '2026-08-14T11:00:00Z',
      },
    ],
    created_at: '2026-08-14T10:15:00Z',
  },
  {
    id: 'post_2',
    author_id: 'usr_2',
    author_name: 'Maya Chen',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    author_campus: 'Greater Boston & Cambridge Hub',
    content: 'Just unloaded a fresh kiln firing of speckled stoneware matcha bowls and coffee drippers! Happy to swap pottery tips for sourdough or espresso dialing tips.',
    interest_tags: ['Ceramics & Pottery', 'Specialty Coffee & Espresso', 'Sourdough & Baking'],
    likes_count: 14,
    liked_by_me: false,
    comments: [],
    created_at: '2026-08-13T16:40:00Z',
  },
  {
    id: 'post_3',
    author_id: 'usr_3',
    author_name: 'Jordan Patel',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    author_campus: 'Austin Creative District',
    content: 'Heading to the local bouldering gym tomorrow evening for a chill session on some new V4 slab problems. Anyone want to partner up and work the routes together?',
    interest_tags: ['Rock Climbing & Bouldering', 'Hiking & Trail Running'],
    likes_count: 9,
    liked_by_me: false,
    comments: [],
    created_at: '2026-08-12T19:20:00Z',
  },
  {
    id: 'post_4',
    author_id: 'usr_4',
    author_name: 'Elena Rostova',
    author_avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    author_campus: 'Greater Boston & Cambridge Hub',
    content: 'Looking for an indie rock guitarist or modular synth explorer to jam on some dreamy melodies this weekend. Influences: Alvvays, Japanese Breakfast, Men I Trust.',
    interest_tags: ['Indie Rock & Guitar', 'Electronic Music & Synth', 'Vinyl & Record Collecting'],
    likes_count: 12,
    liked_by_me: true,
    comments: [],
    created_at: '2026-08-11T14:00:00Z',
  },
];

export const MOCK_CONNECTIONS: ConnectionRequest[] = [
  {
    id: 'conn_1',
    requester_id: 'usr_me',
    recipient_id: 'usr_4',
    status: 'accepted',
    message: 'Hey Elena! Saw your interest in tabletop games and synthesizer music, would love to connect and jam sometime!',
    created_at: '2026-08-10T15:00:00Z',
    updated_at: '2026-08-10T16:00:00Z',
  },
  {
    id: 'conn_2',
    requester_id: 'usr_2',
    recipient_id: 'usr_me',
    status: 'pending',
    message: 'Hey Alex! Would love to try out a tabletop game and talk coffee brewing methods!',
    created_at: '2026-08-15T09:30:00Z',
    updated_at: '2026-08-15T09:30:00Z',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participant: MOCK_PROFILES[3], // Elena Rostova
    lastMessage: {
      id: 'msg_2',
      conversation_id: 'conv_1',
      sender_id: 'usr_4',
      content: 'That sounds amazing! I can bring over my mini synthesizer setup.',
      created_at: '2026-08-14T12:00:00Z',
    },
    unreadCount: 0,
    updated_at: '2026-08-14T12:00:00Z',
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_1',
      conversation_id: 'conv_1',
      sender_id: 'usr_me',
      content: 'Hey Elena! Excited to connect. Are you free to jam or talk music synthesis sometime this week?',
      created_at: '2026-08-14T11:45:00Z',
    },
    {
      id: 'msg_2',
      conversation_id: 'conv_1',
      sender_id: 'usr_4',
      content: 'That sounds amazing! I can bring over my mini synthesizer setup.',
      created_at: '2026-08-14T12:00:00Z',
    },
  ],
};
