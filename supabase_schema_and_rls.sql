-- ==========================================
-- HOTSPOTS — COMPLETE SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==========================================
-- Paste and execute this entire script in your Supabase SQL Editor.

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. TABLES DEFINITION
-- ------------------------------------------

-- Campuses
CREATE TABLE IF NOT EXISTS public.campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interests Taxonomy
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    icon_slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Catalog
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Goals
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    department TEXT DEFAULT '',
    level TEXT DEFAULT '',
    social_links JSONB DEFAULT '{}'::jsonb,
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Interests Junction
CREATE TABLE IF NOT EXISTS public.user_interests (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- User Skills Junction
CREATE TABLE IF NOT EXISTS public.user_skills (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    level TEXT DEFAULT 'intermediate',
    PRIMARY KEY (user_id, skill_id)
);

-- User Goals Junction
CREATE TABLE IF NOT EXISTS public.user_goals (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, goal_id)
);

-- Connections & Requests
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_connection_pair UNIQUE (requester_id, recipient_id)
);

-- 1-to-1 Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation Members
CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

-- Direct Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts Feed
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT DEFAULT '',
    author_campus TEXT DEFAULT '',
    content TEXT NOT NULL,
    image_url TEXT,
    interest_tags TEXT[] DEFAULT '{}',
    likes_count INT DEFAULT 0,
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reported_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety Blocks
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_block_pair UNIQUE (blocker_id, blocked_id)
);

-- ------------------------------------------
-- 2. INDEXES FOR PERFORMANCE
-- ------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_campus_id ON public.profiles(campus_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest ON public.user_interests(interest_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_goal ON public.user_goals(goal_id);
CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_recipient ON public.connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);

-- ------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Taxonomy & Profile Read Access (Public for Discovery)
CREATE POLICY "Allow public read on campuses" ON public.campuses FOR SELECT USING (true);
CREATE POLICY "Allow public read on interests" ON public.interests FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on goals" ON public.goals FOR SELECT USING (true);
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read on user_interests" ON public.user_interests FOR SELECT USING (true);
CREATE POLICY "Allow public read on user_skills" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on user_goals" ON public.user_goals FOR SELECT USING (true);
CREATE POLICY "Allow public read on posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow auth users to create posts" ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authors to update own posts" ON public.posts FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

-- Authenticated User Write Permissions for Profiles
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Connections Security
CREATE POLICY "Read connections involved" ON public.connections FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = requester_id OR id = recipient_id)
);
CREATE POLICY "Insert connections requester" ON public.connections FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = requester_id)
);
CREATE POLICY "Update connections status" ON public.connections FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = recipient_id OR id = requester_id)
);

-- Messaging Security
CREATE POLICY "Read conversations member" ON public.conversations FOR SELECT USING (
    id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Read messages member" ON public.messages FOR SELECT USING (
    conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Insert messages member" ON public.messages FOR INSERT WITH CHECK (
    conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

-- ------------------------------------------
-- 4. INITIAL TAXONOMY SEED DATA
-- ------------------------------------------
INSERT INTO public.campuses (name, code, city, region) VALUES
('Tech Institute of Technology', 'TIT', 'Cambridge', 'MA'),
('State University Campus', 'SUC', 'Austin', 'TX'),
('Metropolitan Community College', 'MCC', 'Seattle', 'WA')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.interests (name, category, icon_slug) VALUES
('React & Next.js', 'technology', 'code'),
('UI/UX Design', 'design', 'figma'),
('Artificial Intelligence', 'technology', 'cpu'),
('Product Management', 'business', 'briefcase'),
('Robotics & Hardware', 'technology', 'zap'),
('Mobile App Dev', 'technology', 'smartphone'),
('Digital Art & Motion', 'arts', 'image'),
('Basketball & Fitness', 'sports', 'activity')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.skills (name, category) VALUES
('TypeScript', 'Development'),
('Figma & Prototyping', 'Design'),
('Python & PyTorch', 'Data Science'),
('User Interviewing', 'Research'),
('Tailwind CSS', 'Development'),
('System Architecture', 'Engineering')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.goals (name, description) VALUES
('Build a Hackathon Project', 'Co-found a team for upcoming hackathon'),
('Find a Co-Founder', 'Looking for technical or design co-founder'),
('Peer Mentorship & Learning', 'Exchange skills and code review'),
('Casual Study Group', 'Meet up regularly to study and collaborate')
ON CONFLICT (name) DO NOTHING;
