import { Campus, Interest, Skill, Goal, UserProfile, ConnectionRequest, Conversation, Message, Post, PostComment } from '@hotspots/types';
import { supabase, isSupabaseConfigured } from './client';
import { MOCK_CAMPUSES, MOCK_INTERESTS, MOCK_SKILLS, MOCK_GOALS } from './mockData';

let inMemoryProfiles: UserProfile[] = [];
let inMemoryPosts: Post[] = [];
let inMemoryConnections: ConnectionRequest[] = [];
let inMemoryConversations: Conversation[] = [];
let inMemoryMessages: Record<string, Message[]> = {};
let currentActiveUserId = 'usr_guest';

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function sanitizeProfileForDb(profile: Partial<UserProfile>): Record<string, any> {
  const { interests, skills, goals, campus_name, role, is_blocked, ...dbFields } = profile as any;
  if (dbFields.campus_id && !isValidUuid(dbFields.campus_id)) {
    delete dbFields.campus_id;
  }
  return dbFields;
}

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
          display_name: '',
          username: '',
          avatar_url: '',
          bio: '',
          campus_id: '',
          campus_name: '',
          department: '',
          level: '',
          interests: [],
          skills: [],
          goals: [],
          is_onboarded: false,
          role: 'user',
          is_blocked: false,
          created_at: now,
          updated_at: now,
        };
        await supabase.from('profiles').upsert(sanitizeProfileForDb(newProfile));
        currentActiveUserId = newProfile.id;
        inMemoryProfiles = inMemoryProfiles.filter((p) => p.user_id !== newProfile.user_id);
        inMemoryProfiles.push(newProfile);
        return newProfile;
      }
    }

    throw new Error('Supabase Auth is not configured. Please check environment variables.');
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

        currentActiveUserId = data.user.id;

        if (profileData) {
          const cached = inMemoryProfiles.find((p) => p.user_id === data.user.id || p.id === data.user.id);
          const raw = profileData as any;
          const merged: UserProfile = {
            id: raw.id || data.user.id,
            user_id: raw.user_id || data.user.id,
            display_name: raw.display_name || cached?.display_name || '',
            username: raw.username || cached?.username || '',
            avatar_url: raw.avatar_url || cached?.avatar_url || '',
            bio: raw.bio || cached?.bio || '',
            campus_id: raw.campus_id || cached?.campus_id || '',
            campus_name: cached?.campus_name || raw.campus_name || '',
            department: raw.department || cached?.department || '',
            level: raw.level || cached?.level || '',
            interests: cached?.interests || raw.interests || [],
            skills: cached?.skills || raw.skills || [],
            goals: cached?.goals || raw.goals || [],
            social_links: raw.social_links || cached?.social_links,
            is_onboarded: Boolean(raw.is_onboarded ?? cached?.is_onboarded),
            role: raw.role || cached?.role || 'user',
            is_blocked: Boolean(raw.is_blocked ?? cached?.is_blocked),
            created_at: raw.created_at || cached?.created_at || new Date().toISOString(),
            updated_at: raw.updated_at || cached?.updated_at || new Date().toISOString(),
          };
          return merged;
        }

        // Create clean profile without assumed dummy data
        const newProfile: UserProfile = {
          id: data.user.id,
          user_id: data.user.id,
          display_name: '',
          username: '',
          avatar_url: '',
          bio: '',
          campus_id: '',
          campus_name: '',
          department: '',
          level: '',
          interests: [],
          skills: [],
          goals: [],
          is_onboarded: false,
          role: 'user',
          is_blocked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from('profiles').upsert(sanitizeProfileForDb(newProfile));
        inMemoryProfiles = inMemoryProfiles.filter((p) => p.user_id !== newProfile.user_id);
        inMemoryProfiles.push(newProfile);
        return newProfile;
      }
    }

    throw new Error('Supabase Auth is not configured. Please check environment variables.');
  },

  async signInWithGoogle(): Promise<UserProfile | null> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/discover` : undefined,
        },
      });
      if (error) throw new Error(error.message);
      return null;
    }

    throw new Error('Supabase Auth is not configured. Please check environment variables.');
  },

  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    currentActiveUserId = '';
    inMemoryProfiles = [];
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
          currentActiveUserId = user.id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          const cached = inMemoryProfiles.find((p) => p.user_id === user.id || p.id === user.id);

          if (profile) {
            const raw = profile as any;
            const merged: UserProfile = {
              id: raw.id || user.id,
              user_id: raw.user_id || user.id,
              display_name: raw.display_name || cached?.display_name || '',
              username: raw.username || cached?.username || '',
              avatar_url: raw.avatar_url || cached?.avatar_url || '',
              bio: raw.bio || cached?.bio || '',
              campus_id: raw.campus_id || cached?.campus_id || '',
              campus_name: cached?.campus_name || raw.campus_name || '',
              department: raw.department || cached?.department || '',
              level: raw.level || cached?.level || '',
              interests: cached?.interests || raw.interests || [],
              skills: cached?.skills || raw.skills || [],
              goals: cached?.goals || raw.goals || [],
              social_links: raw.social_links || cached?.social_links,
              is_onboarded: Boolean(raw.is_onboarded ?? cached?.is_onboarded),
              role: raw.role || cached?.role || 'user',
              is_blocked: Boolean(raw.is_blocked ?? cached?.is_blocked),
              created_at: raw.created_at || cached?.created_at || new Date().toISOString(),
              updated_at: raw.updated_at || cached?.updated_at || new Date().toISOString(),
            };
            return merged;
          }

          // If authenticated but profile doesn't exist yet, create a clean unpopulated profile
          const now = new Date().toISOString();
          const newProfile: UserProfile = {
            id: user.id,
            user_id: user.id,
            display_name: '',
            username: '',
            avatar_url: '',
            bio: '',
            campus_id: '',
            campus_name: '',
            department: '',
            level: '',
            interests: [],
            skills: [],
            goals: [],
            is_onboarded: false,
            role: 'user',
            is_blocked: false,
            created_at: now,
            updated_at: now,
          };
          await supabase.from('profiles').upsert(sanitizeProfileForDb(newProfile));
          inMemoryProfiles = inMemoryProfiles.filter((p) => p.user_id !== newProfile.user_id);
          inMemoryProfiles.push(newProfile);
          return newProfile;
        }
        return null;
      } catch (e) {
        console.warn('Supabase getCurrentProfile error:', e);
        return null;
      }
    }

    const current = inMemoryProfiles.find((p) => p.id === currentActiveUserId || p.user_id === currentActiveUserId);
    if (current) return current;
    return null;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const activeId = currentActiveUserId;
    const updated_at = new Date().toISOString();

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = user?.id || activeId;
        if (targetUserId) {
          const dbPayload = sanitizeProfileForDb({ ...profileData, user_id: targetUserId, updated_at });
          const { data, error } = await supabase
            .from('profiles')
            .upsert(dbPayload, { onConflict: 'user_id' })
            .select()
            .single();

          if (error) {
            console.warn('Supabase updateProfile DB error:', error);
          }

          const existingIdx = inMemoryProfiles.findIndex((p) => p.id === targetUserId || p.user_id === targetUserId);
          const existing = existingIdx !== -1 ? inMemoryProfiles[existingIdx] : null;

          const updatedFullObj: UserProfile = {
            id: targetUserId,
            user_id: targetUserId,
            display_name: data?.display_name ?? profileData.display_name ?? existing?.display_name ?? '',
            username: data?.username ?? profileData.username ?? existing?.username ?? '',
            avatar_url: data?.avatar_url ?? profileData.avatar_url ?? existing?.avatar_url ?? '',
            bio: data?.bio ?? profileData.bio ?? existing?.bio ?? '',
            campus_id: data?.campus_id ?? profileData.campus_id ?? existing?.campus_id ?? '',
            campus_name: profileData.campus_name ?? existing?.campus_name ?? '',
            department: data?.department ?? profileData.department ?? existing?.department ?? '',
            level: data?.level ?? profileData.level ?? existing?.level ?? '',
            interests: profileData.interests ?? existing?.interests ?? [],
            skills: profileData.skills ?? existing?.skills ?? [],
            goals: profileData.goals ?? existing?.goals ?? [],
            is_onboarded: data?.is_onboarded ?? profileData.is_onboarded ?? existing?.is_onboarded ?? true,
            role: data?.role ?? profileData.role ?? existing?.role ?? 'user',
            is_blocked: data?.is_blocked ?? profileData.is_blocked ?? existing?.is_blocked ?? false,
            created_at: data?.created_at ?? existing?.created_at ?? new Date().toISOString(),
            updated_at,
          };

          if (existingIdx !== -1) {
            inMemoryProfiles[existingIdx] = updatedFullObj;
          } else {
            inMemoryProfiles.push(updatedFullObj);
          }

          return updatedFullObj;
        }
      } catch (e) {
        console.warn('Supabase updateProfile error:', e);
      }
    }

    const idx = inMemoryProfiles.findIndex((p) => p.id === activeId || p.user_id === activeId);
    if (idx !== -1) {
      inMemoryProfiles[idx] = { ...inMemoryProfiles[idx], ...profileData, updated_at };
      return inMemoryProfiles[idx];
    }
    const newProf: UserProfile = {
      id: activeId,
      user_id: activeId,
      display_name: '',
      username: '',
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
      role: 'user',
      is_blocked: false,
      created_at: new Date().toISOString(),
      updated_at,
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

  // Admin Management APIs
  async adminUpdateUserProfile(targetUserId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const updated_at = new Date().toISOString();
    if (supabase) {
      try {
        const dbPayload = sanitizeProfileForDb({ ...updates, updated_at });
        const { data, error } = await supabase
          .from('profiles')
          .update(dbPayload)
          .eq('id', targetUserId)
          .select()
          .single();
        if (!error && data) return data as unknown as UserProfile;
      } catch (e) {
        console.warn('Supabase adminUpdateUserProfile error:', e);
      }
    }

    const idx = inMemoryProfiles.findIndex((p) => p.id === targetUserId || p.user_id === targetUserId);
    if (idx !== -1) {
      inMemoryProfiles[idx] = { ...inMemoryProfiles[idx], ...updates, updated_at };
      return inMemoryProfiles[idx];
    }
    throw new Error('Target user profile not found');
  },

  async adminDeleteUserProfile(targetUserId: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('profiles').delete().eq('id', targetUserId);
      } catch (e) {
        console.warn('Supabase adminDeleteUserProfile error:', e);
      }
    }
    inMemoryProfiles = inMemoryProfiles.filter((p) => p.id !== targetUserId && p.user_id !== targetUserId);
  },

  async adminAddCampus(campus: Omit<Campus, 'id'>): Promise<Campus> {
    const newCampus: Campus = { id: `camp_${Date.now()}`, ...campus };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('campuses').insert(newCampus).select().single();
        if (!error && data) return data as Campus;
      } catch (e) {
        console.warn('Supabase adminAddCampus error:', e);
      }
    }
    MOCK_CAMPUSES.push(newCampus);
    return newCampus;
  },

  async adminDeleteCampus(campusId: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('campuses').delete().eq('id', campusId);
      } catch (e) {
        console.warn('Supabase adminDeleteCampus error:', e);
      }
    }
    const idx = MOCK_CAMPUSES.findIndex((c) => c.id === campusId);
    if (idx !== -1) MOCK_CAMPUSES.splice(idx, 1);
  },

  async adminAddInterest(interest: Omit<Interest, 'id'>): Promise<Interest> {
    const newInterest: Interest = { id: `int_${Date.now()}`, ...interest };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('interests').insert(newInterest).select().single();
        if (!error && data) return data as Interest;
      } catch (e) {
        console.warn('Supabase adminAddInterest error:', e);
      }
    }
    MOCK_INTERESTS.push(newInterest);
    return newInterest;
  },

  async adminDeleteInterest(interestId: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('interests').delete().eq('id', interestId);
      } catch (e) {
        console.warn('Supabase adminDeleteInterest error:', e);
      }
    }
    const idx = MOCK_INTERESTS.findIndex((i) => i.id === interestId);
    if (idx !== -1) MOCK_INTERESTS.splice(idx, 1);
  },

  async adminAddSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = { id: `skl_${Date.now()}`, ...skill };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('skills').insert(newSkill).select().single();
        if (!error && data) return data as Skill;
      } catch (e) {
        console.warn('Supabase adminAddSkill error:', e);
      }
    }
    MOCK_SKILLS.push(newSkill);
    return newSkill;
  },

  async adminDeleteSkill(skillId: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('skills').delete().eq('id', skillId);
      } catch (e) {
        console.warn('Supabase adminDeleteSkill error:', e);
      }
    }
    const idx = MOCK_SKILLS.findIndex((s) => s.id === skillId);
    if (idx !== -1) MOCK_SKILLS.splice(idx, 1);
  },

  async adminAddGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    const newGoal: Goal = { id: `gol_${Date.now()}`, ...goal };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('goals').insert(newGoal).select().single();
        if (!error && data) return data as Goal;
      } catch (e) {
        console.warn('Supabase adminAddGoal error:', e);
      }
    }
    MOCK_GOALS.push(newGoal);
    return newGoal;
  },

  async adminDeleteGoal(goalId: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('goals').delete().eq('id', goalId);
      } catch (e) {
        console.warn('Supabase adminDeleteGoal error:', e);
      }
    }
    const idx = MOCK_GOALS.findIndex((g) => g.id === goalId);
    if (idx !== -1) MOCK_GOALS.splice(idx, 1);
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
