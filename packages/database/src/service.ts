import { Campus, Interest, Skill, Goal, UserProfile, ConnectionRequest, Conversation, Message, Post, PostComment } from '@hotspots/types';
import { supabase, isSupabaseConfigured } from './client';
import { MOCK_CAMPUSES, MOCK_INTERESTS, MOCK_SKILLS, MOCK_GOALS } from './mockData';

let inMemoryProfiles: UserProfile[] = [];
let inMemoryPosts: Post[] = [];
let inMemoryConnections: ConnectionRequest[] = [];
let inMemoryConversations: Conversation[] = [];
let inMemoryMessages: Record<string, Message[]> = {};
let currentActiveUserId = 'usr_guest';

export const DataService = {
  isLiveMode(): boolean {
    return isSupabaseConfigured;
  },

  getCurrentUserId(): string {
    return currentActiveUserId;
  },

  setCurrentUserId(id: string) {
    currentActiveUserId = id;
  },

  async getPosts(): Promise<Post[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data as Post[];
        }
      } catch (e) {
        console.warn('Supabase getPosts error:', e);
      }
    }
    return inMemoryPosts;
  },

  async createPost(content: string, image_url?: string, interest_tags?: string[]): Promise<Post> {
    const cur = await this.getCurrentProfile();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author_id: cur ? cur.id : 'anon',
      author_name: cur ? cur.display_name : 'Anonymous Student',
      author_avatar: cur ? cur.avatar_url : '',
      author_campus: cur ? cur.campus_name : '',
      content,
      image_url: image_url || undefined,
      interest_tags: interest_tags || [],
      likes_count: 0,
      liked_by_me: false,
      comments: [],
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('posts').insert(newPost).select().single();
        if (!error && data) {
          return data as Post;
        }
      } catch (e) {
        console.warn('Supabase createPost error:', e);
      }
    }

    inMemoryPosts = [newPost, ...inMemoryPosts];
    return newPost;
  },

  async toggleLikePost(postId: string): Promise<Post> {
    if (supabase) {
      try {
        const { data: post } = await supabase.from('posts').select('*').eq('id', postId).single();
        if (post) {
          const currentlyLiked = Boolean(post.liked_by_me);
          const likesCount = currentlyLiked ? Math.max(0, (post.likes_count || 1) - 1) : (post.likes_count || 0) + 1;
          const { data: updated } = await supabase
            .from('posts')
            .update({ liked_by_me: !currentlyLiked, likes_count: likesCount })
            .eq('id', postId)
            .select()
            .single();
          if (updated) return updated as Post;
        }
      } catch (e) {
        console.warn('Supabase toggleLikePost error:', e);
      }
    }

    const idx = inMemoryPosts.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      const post = inMemoryPosts[idx];
      const currentlyLiked = Boolean(post.liked_by_me);
      inMemoryPosts[idx] = {
        ...post,
        liked_by_me: !currentlyLiked,
        likes_count: currentlyLiked ? Math.max(0, post.likes_count - 1) : post.likes_count + 1,
      };
      return inMemoryPosts[idx];
    }
    throw new Error('Post not found');
  },

  async addPostComment(postId: string, content: string): Promise<PostComment> {
    const cur = await this.getCurrentProfile();
    const comment: PostComment = {
      id: `cmt_${Date.now()}`,
      post_id: postId,
      author_id: cur ? cur.id : 'anon',
      author_name: cur ? cur.display_name : 'Anonymous Student',
      author_avatar: cur ? cur.avatar_url : '',
      content,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data: post } = await supabase.from('posts').select('comments').eq('id', postId).single();
        const existing = Array.isArray(post?.comments) ? post.comments : [];
        const updatedComments = [...existing, comment];
        await supabase.from('posts').update({ comments: updatedComments }).eq('id', postId);
        return comment;
      } catch (e) {
        console.warn('Supabase addPostComment error:', e);
      }
    }

    const idx = inMemoryPosts.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      inMemoryPosts[idx] = {
        ...inMemoryPosts[idx],
        comments: [...inMemoryPosts[idx].comments, comment],
      };
      return comment;
    }
    throw new Error('Post not found');
  },

  async signUpWithSupabase(email: string, password: string): Promise<UserProfile> {
    const now = new Date().toISOString();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        const newProfile: UserProfile = {
          id: data.user.id,
          user_id: data.user.id,
          display_name: email.split('@')[0],
          username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
          avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
          bio: 'New student on Hotspots!',
          campus_id: MOCK_CAMPUSES[0].id,
          campus_name: MOCK_CAMPUSES[0].name,
          department: 'Computer Science',
          level: 'Undergraduate',
          interests: [],
          skills: [],
          goals: [],
          is_onboarded: false,
          created_at: now,
          updated_at: now,
        };
        await supabase.from('profiles').upsert(newProfile);
        currentActiveUserId = newProfile.id;
        return newProfile;
      }
    }

    const localProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      user_id: `usr_${Date.now()}`,
      display_name: email.split('@')[0],
      username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
      bio: 'New student on Hotspots!',
      campus_id: MOCK_CAMPUSES[0].id,
      campus_name: MOCK_CAMPUSES[0].name,
      department: 'Computer Science',
      level: 'Undergraduate',
      interests: [],
      skills: [],
      goals: [],
      is_onboarded: false,
      created_at: now,
      updated_at: now,
    };
    inMemoryProfiles.unshift(localProfile);
    currentActiveUserId = localProfile.id;
    return localProfile;
  },

  async signInWithSupabase(email: string, password: string): Promise<UserProfile> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileData) {
          currentActiveUserId = profileData.id;
          return profileData as unknown as UserProfile;
        }

        // Create profile if missing
        const newProfile: UserProfile = {
          id: data.user.id,
          user_id: data.user.id,
          display_name: email.split('@')[0],
          username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
          avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
          bio: 'Campus student on Hotspots!',
          campus_id: MOCK_CAMPUSES[0].id,
          campus_name: MOCK_CAMPUSES[0].name,
          department: 'General Studies',
          level: 'Undergraduate',
          interests: [],
          skills: [],
          goals: [],
          is_onboarded: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from('profiles').upsert(newProfile);
        currentActiveUserId = newProfile.id;
        return newProfile;
      }
    }

    const current = inMemoryProfiles.find((p) => p.id === currentActiveUserId);
    if (current) return current;
    throw new Error('User account not found');
  },

  async signInWithGoogle(): Promise<UserProfile> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/discover` : undefined,
        },
      });
      if (error) throw new Error(error.message);
    }

    const googleProfile: UserProfile = {
      id: 'usr_google',
      user_id: 'usr_google',
      display_name: 'Google Student',
      username: 'googlestudent',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      bio: 'Signed in via Google',
      campus_id: MOCK_CAMPUSES[0].id,
      campus_name: MOCK_CAMPUSES[0].name,
      department: 'Software Engineering',
      level: 'Undergraduate',
      interests: [],
      skills: [],
      goals: [],
      is_onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const idx = inMemoryProfiles.findIndex((p) => p.id === googleProfile.id);
    if (idx === -1) {
      inMemoryProfiles.unshift(googleProfile);
    }
    currentActiveUserId = googleProfile.id;
    return googleProfile;
  },

  async getCampuses(): Promise<Campus[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('campuses').select('*');
        if (!error && data && data.length > 0) return data as Campus[];
      } catch (e) {
        console.warn('Supabase getCampuses error:', e);
      }
    }
    return MOCK_CAMPUSES;
  },

  async getTaxonomy(): Promise<{ interests: Interest[]; skills: Skill[]; goals: Goal[] }> {
    if (supabase) {
      try {
        const [intRes, sklRes, golRes] = await Promise.all([
          supabase.from('interests').select('*'),
          supabase.from('skills').select('*'),
          supabase.from('goals').select('*'),
        ]);
        if (!intRes.error && intRes.data && intRes.data.length > 0) {
          return {
            interests: intRes.data as Interest[],
            skills: (sklRes.data || MOCK_SKILLS) as Skill[],
            goals: (golRes.data || MOCK_GOALS) as Goal[],
          };
        }
      } catch (e) {
        console.warn('Supabase getTaxonomy error:', e);
      }
    }
    return { interests: MOCK_INTERESTS, skills: MOCK_SKILLS, goals: MOCK_GOALS };
  },

  async getCurrentProfile(): Promise<UserProfile | null> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profile) return profile as unknown as UserProfile;
        }
      } catch (e) {
        console.warn('Supabase getCurrentProfile error:', e);
      }
    }

    const current = inMemoryProfiles.find((p) => p.id === currentActiveUserId);
    if (current) return current;
    if (inMemoryProfiles.length > 0) return inMemoryProfiles[0];
    return null;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const updated_at = new Date().toISOString();
          const { data, error } = await supabase
            .from('profiles')
            .update({ ...profileData, updated_at })
            .eq('user_id', user.id)
            .select()
            .single();

          if (!error && data) return data as unknown as UserProfile;
        }
      } catch (e) {
        console.warn('Supabase updateProfile error:', e);
      }
    }

    const idx = inMemoryProfiles.findIndex((p) => p.id === currentActiveUserId);
    if (idx !== -1) {
      inMemoryProfiles[idx] = { ...inMemoryProfiles[idx], ...profileData, updated_at: new Date().toISOString() };
      return inMemoryProfiles[idx];
    }
    const newProf: UserProfile = {
      id: currentActiveUserId,
      user_id: currentActiveUserId,
      display_name: 'Student',
      username: 'student',
      avatar_url: '',
      bio: '',
      campus_id: '',
      campus_name: '',
      department: '',
      level: '',
      interests: [],
      skills: [],
      goals: [],
      is_onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...profileData,
    };
    inMemoryProfiles.push(newProf);
    return newProf;
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data) return data as unknown as UserProfile[];
      } catch (e) {
        console.warn('Supabase getAllProfiles error:', e);
      }
    }
    return inMemoryProfiles;
  },

  async getConnections(): Promise<ConnectionRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('connections').select('*');
        if (!error && data) return data as ConnectionRequest[];
      } catch (e) {
        console.warn('Supabase getConnections error:', e);
      }
    }
    return inMemoryConnections;
  },

  async sendConnectionRequest(recipientId: string, message?: string): Promise<ConnectionRequest> {
    const cur = await this.getCurrentProfile();
    const newReq: ConnectionRequest = {
      id: `conn_${Date.now()}`,
      requester_id: cur ? cur.id : currentActiveUserId,
      recipient_id: recipientId,
      status: 'pending',
      message: message || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('connections').insert(newReq).select().single();
        if (!error && data) return data as ConnectionRequest;
      } catch (e) {
        console.warn('Supabase sendConnectionRequest error:', e);
      }
    }

    inMemoryConnections = [...inMemoryConnections, newReq];
    return newReq;
  },

  async updateConnectionStatus(connectionId: string, status: 'accepted' | 'rejected' | 'blocked'): Promise<ConnectionRequest> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('connections')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', connectionId)
          .select()
          .single();
        if (!error && data) return data as ConnectionRequest;
      } catch (e) {
        console.warn('Supabase updateConnectionStatus error:', e);
      }
    }

    const idx = inMemoryConnections.findIndex((c) => c.id === connectionId);
    if (idx !== -1) {
      inMemoryConnections[idx] = {
        ...inMemoryConnections[idx],
        status,
        updated_at: new Date().toISOString(),
      };
      return inMemoryConnections[idx];
    }
    throw new Error('Connection request not found');
  },

  async getConversations(): Promise<Conversation[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('conversations').select('*');
        if (!error && data) return data as unknown as Conversation[];
      } catch (e) {
        console.warn('Supabase getConversations error:', e);
      }
    }
    return inMemoryConversations;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        if (!error && data) return data as Message[];
      } catch (e) {
        console.warn('Supabase getMessages error:', e);
      }
    }
    return inMemoryMessages[conversationId] || [];
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const cur = await this.getCurrentProfile();
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: cur ? cur.id : currentActiveUserId,
      content,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('messages').insert(newMsg).select().single();
        if (!error && data) return data as Message;
      } catch (e) {
        console.warn('Supabase sendMessage error:', e);
      }
    }

    inMemoryMessages[conversationId] = [...(inMemoryMessages[conversationId] || []), newMsg];
    return newMsg;
  },
};
