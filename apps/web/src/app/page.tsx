'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/auth-context';
import { DataService } from '@hotspots/database';
import { Post } from '@hotspots/types';
import { FeedPostCard } from '../components/feed-post-card';
import { CreatePostModal } from '../components/create-post-modal';
import { Button, Avatar, useToast, CardSkeleton } from '@hotspots/ui-web';
import { Flame, Compass, Sparkles, Plus, Zap, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export default function RootPage() {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      async function loadPosts() {
        setLoadingPosts(true);
        const allPosts = await DataService.getPosts();
        setPosts(allPosts);
        setLoadingPosts(false);
      }
      loadPosts();
    }
  }, [isAuthenticated]);

  const handleLikePost = async (postId: string) => {
    const updated = await DataService.toggleLikePost(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  };

  const handleAddComment = async (postId: string, content: string) => {
    await DataService.addPostComment(postId, content);
    const updatedPosts = await DataService.getPosts();
    setPosts(updatedPosts);
    toast.success('Comment added!');
  };

  const handleCreatePost = async (content: string, imageUrl?: string, interestTags?: string[]) => {
    const newPost = await DataService.createPost(content, imageUrl, interestTags);
    setPosts((prev) => [newPost, ...prev]);
    toast.success('Post published to campus feed!');
  };

  // 1. Authenticated Experience: Dynamic Community Activity Feed
  if (isAuthenticated && user) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 pb-6 text-left">
        {/* Create Post Header Banner */}
        <div className="glass-card p-4 md:p-5 rounded-[24px] flex items-center justify-between gap-4 border border-[#EAE3C3]/80 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={user.avatar_url} name={user.display_name} size="md" />
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-[#2B2B2B] truncate">Welcome back, {user.display_name}!</h3>
              <p className="text-[11px] text-[#619B8A] truncate">What's happening on campus today?</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPostModalOpen(true)}
            className="rounded-2xl px-4 py-2.5 shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3px]" /> Post Update
          </Button>
        </div>

        {/* Feed Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-extrabold text-[#2B2B2B] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C62828]" /> Community Activity Feed
          </h2>
          <span className="text-xs text-[#619B8A] font-bold">{posts.length} Active Posts</span>
        </div>

        {/* Feed List */}
        {loadingPosts ? (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onComment={handleAddComment}
              />
            ))}
          </div>
        )}

        {/* Post Creation Modal */}
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    );
  }

  // 2. Unauthenticated Experience: Public Marketing Landing Page
  return (
    <div className="w-full space-y-12 md:space-y-20 py-4 md:py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3C4] border border-[#FFC857] text-[#C62828] text-xs font-extrabold shadow-sm animate-bounce">
          <Sparkles className="w-4 h-4 fill-[#C62828]" />
          <span>The Campus & Community Matchmaking Platform</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2B2B2B] leading-tight">
            Stop Searching. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#C62828] via-[#F57C00] to-[#E06C00] bg-clip-text text-transparent">
              Find People Who Click With You.
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-[#414643] leading-relaxed max-w-2xl mx-auto font-medium">
            Hotspots pairs campus students and tech collaborators based on shared interests, complementary skills, and real collaboration goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <Link href="/auth" className="w-full sm:w-auto flex-1">
            <Button variant="primary" size="lg" fullWidth className="shadow-lg py-3.5 rounded-2xl">
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto flex-1">
            <Button variant="outline" size="lg" fullWidth className="py-3.5 rounded-2xl bg-white/80">
              <Compass className="w-4 h-4 mr-2 text-[#619B8A]" /> How It Works
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-[#414643] font-bold pt-3">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Free & Safe</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Students</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2B2B2B]">Why Students Choose Hotspots</h2>
          <p className="text-xs md:text-sm text-[#414643]">Designed specifically to solve cold-outreach & hackathon team discovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card p-6 rounded-[24px] space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#C62828]/10 text-[#C62828] flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2B2B]">90%+ Match Engine</h3>
            <p className="text-xs text-[#414643] leading-relaxed">
              Our deterministic algorithm weights shared interests (40%), skills (25%), and goals (20%) so you match with people you actually click with.
            </p>
          </div>

          <div className="glass-card p-6 rounded-[24px] space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#F57C00]/10 text-[#F57C00] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2B2B]">Zero-Awkwardness</h3>
            <p className="text-xs text-[#414643] leading-relaxed">
              Every profile displays exact match explanations before you connect, giving you built-in icebreakers for instant conversation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-[24px] space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#619B8A]/10 text-[#619B8A] flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2B2B2B]">Direct 1-on-1 Chat</h3>
            <p className="text-xs text-[#414643] leading-relaxed">
              Once a connection request is accepted, unlock direct 1-to-1 messaging to schedule meetups or start building projects together.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gradient-to-r from-[#C62828] via-[#D32F2F] to-[#F57C00] text-white p-8 md:p-12 rounded-[32px] space-y-8 shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest opacity-85">Simple 3-Step Process</span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">How Hotspots Connects You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-2">
            <span className="w-8 h-8 rounded-full bg-white text-[#C62828] font-black text-sm flex items-center justify-center shadow-xs">1</span>
            <h4 className="font-extrabold text-base">Select Your Passions</h4>
            <p className="text-xs opacity-90 leading-relaxed">Pick interests like React, UI/UX, AI, hardware, and study goals in 30 seconds.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-2">
            <span className="w-8 h-8 rounded-full bg-white text-[#C62828] font-black text-sm flex items-center justify-center shadow-xs">2</span>
            <h4 className="font-extrabold text-base">Explore Scored Cards</h4>
            <p className="text-xs opacity-90 leading-relaxed">View ordered candidate cards with match score percentages and shared interest chips.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-2">
            <span className="w-8 h-8 rounded-full bg-white text-[#C62828] font-black text-sm flex items-center justify-center shadow-xs">3</span>
            <h4 className="font-extrabold text-base">Connect & Collaborate</h4>
            <p className="text-xs opacity-90 leading-relaxed">Send connection requests and chat directly to build hackathon projects or study together.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="glass-card p-8 md:p-12 rounded-[32px] text-center space-y-5 border-2 border-[#C62828]/30 bg-gradient-to-b from-white/90 to-[#FFF3C4]/60 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C62828] to-[#F57C00] text-white flex items-center justify-center mx-auto shadow-md">
          <Flame className="w-8 h-8 fill-white" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2B2B2B]">Ready to Find Your People?</h2>
          <p className="text-xs md:text-sm text-[#414643]">Join hundreds of campus creators, developers, and designers on Hotspots today.</p>
        </div>
        <Link href="/auth" className="inline-block">
          <Button variant="primary" size="lg" className="px-8 py-3.5 rounded-2xl shadow-lg">
            Create Your Account <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
