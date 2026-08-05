'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataService } from '@hotspots/database';
import { UserProfile, Campus, Interest, Skill, Goal, Post } from '@hotspots/types';
import { Button, Avatar, useToast } from '@hotspots/ui-web';
import { useAuth } from '../../context/auth-context';
import {
  ShieldAlert,
  Users,
  Building2,
  Sparkles,
  Award,
  Target,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Edit3,
  ShieldCheck,
  Plus,
  Radio,
  FileText,
  Activity,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'taxonomy' | 'posts'>('users');
  const [loading, setLoading] = useState(true);

  // Data states
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [taxonomy, setTaxonomy] = useState<{ interests: Interest[]; skills: Skill[]; goals: Goal[] }>({
    interests: [],
    skills: [],
    goals: [],
  });
  const [posts, setPosts] = useState<Post[]>([]);

  // User management filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // Modal edit user state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    display_name: '',
    username: '',
    bio: '',
    department: '',
    level: '',
    campus_id: '',
  });

  // Taxonomy forms
  const [newCampus, setNewCampus] = useState({ name: '', code: '', city: '', region: '' });
  const [newInterest, setNewInterest] = useState({ name: '', category: 'technology' as Interest['category'] });
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Development', level: 'intermediate' as Skill['level'] });
  const [newGoal, setNewGoal] = useState({ name: '', description: '' });

  // Load all admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [profs, camps, tax, psts] = await Promise.all([
        DataService.getAllProfiles(),
        DataService.getCampuses(),
        DataService.getTaxonomy(),
        DataService.getPosts(),
      ]);
      setProfiles(profs);
      setCampuses(camps);
      setTaxonomy(tax);
      setPosts(psts);
    } catch (e) {
      console.error('Failed to load admin data:', e);
      toast.error('Failed to load admin records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Grant admin role to current user for demo testing
  const handleToggleCurrentAdmin = async () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await DataService.updateProfile({ role: newRole });
    await refreshUser();
    toast.success(`Your role updated to: ${newRole.toUpperCase()}`);
    loadAdminData();
  };

  // User actions
  const handleToggleUserRole = async (targetUser: UserProfile) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await DataService.adminUpdateUserProfile(targetUser.id, { role: nextRole });
      toast.success(`Updated ${targetUser.display_name || 'User'} role to ${nextRole}`);
      loadAdminData();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update user role');
    }
  };

  const handleToggleUserBlock = async (targetUser: UserProfile) => {
    const nextBlocked = !targetUser.is_blocked;
    try {
      await DataService.adminUpdateUserProfile(targetUser.id, { is_blocked: nextBlocked });
      toast.info(`${targetUser.display_name || 'User'} is now ${nextBlocked ? 'BLOCKED' : 'UNBLOCKED'}`);
      loadAdminData();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (targetUser: UserProfile) => {
    if (!confirm(`Are you sure you want to delete profile for "${targetUser.display_name || targetUser.username || targetUser.id}"?`)) {
      return;
    }
    try {
      await DataService.adminDeleteUserProfile(targetUser.id);
      toast.success('User profile deleted.');
      loadAdminData();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete user.');
    }
  };

  const handleStartEditUser = (u: UserProfile) => {
    setEditingUser(u);
    setEditForm({
      display_name: u.display_name || '',
      username: u.username || '',
      bio: u.bio || '',
      department: u.department || '',
      level: u.level || '',
      campus_id: u.campus_id || '',
    });
  };

  const handleSaveEditUser = async () => {
    if (!editingUser) return;
    try {
      const camp = campuses.find((c) => c.id === editForm.campus_id);
      await DataService.adminUpdateUserProfile(editingUser.id, {
        ...editForm,
        campus_name: camp?.name || editingUser.campus_name,
      });
      toast.success('User profile updated successfully.');
      setEditingUser(null);
      loadAdminData();
    } catch (e: any) {
      toast.error('Failed to save user changes.');
    }
  };

  // Add Campus
  const handleAddCampus = async () => {
    if (!newCampus.name || !newCampus.code) {
      toast.error('Campus name and code are required.');
      return;
    }
    await DataService.adminAddCampus(newCampus);
    setNewCampus({ name: '', code: '', city: '', region: '' });
    toast.success('New campus added.');
    loadAdminData();
  };

  const handleDeleteCampus = async (id: string) => {
    await DataService.adminDeleteCampus(id);
    toast.success('Campus removed.');
    loadAdminData();
  };

  // Add Interest
  const handleAddInterest = async () => {
    if (!newInterest.name) {
      toast.error('Interest name is required.');
      return;
    }
    await DataService.adminAddInterest(newInterest);
    setNewInterest({ name: '', category: 'technology' });
    toast.success('Interest tag created.');
    loadAdminData();
  };

  const handleDeleteInterest = async (id: string) => {
    await DataService.adminDeleteInterest(id);
    toast.success('Interest removed.');
    loadAdminData();
  };

  // Add Skill
  const handleAddSkill = async () => {
    if (!newSkill.name) {
      toast.error('Skill name is required.');
      return;
    }
    await DataService.adminAddSkill(newSkill);
    setNewSkill({ name: '', category: 'Development', level: 'intermediate' });
    toast.success('Skill created.');
    loadAdminData();
  };

  const handleDeleteSkill = async (id: string) => {
    await DataService.adminDeleteSkill(id);
    toast.success('Skill removed.');
    loadAdminData();
  };

  // Add Goal
  const handleAddGoal = async () => {
    if (!newGoal.name) {
      toast.error('Goal name is required.');
      return;
    }
    await DataService.adminAddGoal(newGoal);
    setNewGoal({ name: '', description: '' });
    toast.success('Goal created.');
    loadAdminData();
  };

  const handleDeleteGoal = async (id: string) => {
    await DataService.adminDeleteGoal(id);
    toast.success('Goal removed.');
    loadAdminData();
  };

  // Filtered users list
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const nameMatch =
      p.display_name?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q) ||
      p.campus_name?.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q);

    const roleMatch =
      roleFilter === 'all' ||
      (roleFilter === 'admin' && p.role === 'admin') ||
      (roleFilter === 'user' && p.role !== 'admin');

    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'blocked' && Boolean(p.is_blocked)) ||
      (statusFilter === 'active' && !p.is_blocked);

    return nameMatch && roleMatch && statusMatch;
  });

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 px-2">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-800 to-stone-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Center
            </span>
            {isAdmin ? (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Active Admin Mode
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Standard Account
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight">Application & User Management</h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Control user profiles, promote/demote roles, block access, and modify application campuses, interests, and skills taxonomy.
          </p>
        </div>

        <Button
          variant={isAdmin ? 'outline' : 'primary'}
          size="md"
          onClick={handleToggleCurrentAdmin}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-extrabold text-xs shrink-0"
        >
          {isAdmin ? 'Demote My Account to User' : '⚡ Grant Admin Access to My Profile'}
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-2xs">
          <div className="flex items-center justify-between text-[#619B8A] mb-1">
            <span className="text-xs font-bold text-[#414643]">Total Users</span>
            <Users className="w-4 h-4 text-[#C62828]" />
          </div>
          <div className="text-2xl font-black text-[#2B2B2B]">{profiles.length}</div>
          <span className="text-[10px] text-[#619B8A]">Registered accounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-2xs">
          <div className="flex items-center justify-between text-[#619B8A] mb-1">
            <span className="text-xs font-bold text-[#414643]">Onboarded</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#2B2B2B]">
            {profiles.filter((p) => p.is_onboarded).length}
          </div>
          <span className="text-[10px] text-[#619B8A]">Completed profile form</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-2xs">
          <div className="flex items-center justify-between text-[#619B8A] mb-1">
            <span className="text-xs font-bold text-[#414643]">Campuses</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-[#2B2B2B]">{campuses.length}</div>
          <span className="text-[10px] text-[#619B8A]">Active locations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-2xs">
          <div className="flex items-center justify-between text-[#619B8A] mb-1">
            <span className="text-xs font-bold text-[#414643]">Posts Feed</span>
            <FileText className="w-4 h-4 text-[#F57C00]" />
          </div>
          <div className="text-2xl font-black text-[#2B2B2B]">{posts.length}</div>
          <span className="text-[10px] text-[#619B8A]">Campus posts created</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all ${
            activeTab === 'users'
              ? 'bg-[#C62828] text-white shadow-md'
              : 'bg-white text-[#414643] hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Users className="w-4 h-4" /> User Management ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all ${
            activeTab === 'taxonomy'
              ? 'bg-[#C62828] text-white shadow-md'
              : 'bg-white text-[#414643] hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" /> Campuses & Taxonomy
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all ${
            activeTab === 'posts'
              ? 'bg-[#C62828] text-white shadow-md'
              : 'bg-white text-[#414643] hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Activity className="w-4 h-4" /> Posts & Moderation
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#EAE3C3] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, username, major, campus..."
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e: any) => setRoleFilter(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-semibold"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="user">Users Only</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>

              <Button variant="outline" size="sm" onClick={loadAdminData}>
                Refresh
              </Button>
            </div>
          </div>

          {/* User List Table */}
          <div className="bg-white rounded-2xl border border-[#EAE3C3] shadow-2xs overflow-hidden">
            {filteredProfiles.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No users found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[#414643] font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Campus & Major</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Onboarded</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[#2B2B2B]">
                    {filteredProfiles.map((p) => {
                      const isUserAdmin = p.role === 'admin';
                      const isBlocked = Boolean(p.is_blocked);

                      return (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar src={p.avatar_url} name={p.display_name || p.username || 'User'} size="md" />
                              <div>
                                <div className="font-extrabold text-xs text-[#2B2B2B] flex items-center gap-1.5">
                                  {p.display_name || 'Unset Display Name'}
                                  {isUserAdmin && (
                                    <span className="bg-red-100 text-[#C62828] text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                                      ADMIN
                                    </span>
                                  )}
                                  {isBlocked && (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                                      BLOCKED
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#619B8A]">
                                  @{p.username || 'no_username'} • ID: {p.id.substring(0, 12)}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold">{p.campus_name || 'Not set'}</div>
                            <div className="text-[11px] text-[#619B8A]">
                              {p.department || 'No Major'} {p.level ? `(${p.level})` : ''}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleUserRole(p)}
                              title="Click to toggle Admin / User role"
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all ${
                                isUserAdmin
                                  ? 'bg-red-50 text-[#C62828] border-red-200 hover:bg-red-100'
                                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {isUserAdmin ? 'Role: Admin' : 'Role: User'}
                            </button>
                          </td>

                          <td className="p-3.5">
                            {p.is_onboarded ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                <Check className="w-3.5 h-3.5" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                                <AlertTriangle className="w-3.5 h-3.5" /> Pending
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => handleStartEditUser(p)}
                              title="Edit user details"
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleUserBlock(p)}
                              title={isBlocked ? 'Unblock user' : 'Block user'}
                              className={`p-1.5 rounded-lg border text-xs font-bold ${
                                isBlocked
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              {isBlocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(p)}
                              title="Delete user"
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#C62828] font-bold text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TAXONOMY & CAMPUSES */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CAMPUSES */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2B2B2B] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#C62828]" /> Manage Campuses ({campuses.length})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {campuses.map((c) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#2B2B2B]">{c.name} ({c.code})</div>
                    <div className="text-[11px] text-[#619B8A]">{c.city}, {c.region}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteCampus(c.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Campus Form */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-xs font-bold text-[#2B2B2B] block">Add New Campus</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Campus Name"
                  value={newCampus.name}
                  onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200"
                />
                <input
                  type="text"
                  placeholder="Code (e.g. NYU)"
                  value={newCampus.code}
                  onChange={(e) => setNewCampus({ ...newCampus, code: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newCampus.city}
                  onChange={(e) => setNewCampus({ ...newCampus, city: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200"
                />
                <input
                  type="text"
                  placeholder="State/Region"
                  value={newCampus.region}
                  onChange={(e) => setNewCampus({ ...newCampus, region: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200"
                />
              </div>
              <Button variant="primary" size="sm" fullWidth onClick={handleAddCampus}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Campus
              </Button>
            </div>
          </div>

          {/* INTERESTS */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2B2B2B] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F57C00]" /> Manage Interests ({taxonomy.interests.length})
            </h3>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
              {taxonomy.interests.map((i) => (
                <div key={i.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFF3C4]/60 border border-[#EAE3C3] rounded-xl text-xs font-bold text-[#2B2B2B]">
                  <span>{i.name}</span>
                  <button onClick={() => handleDeleteInterest(i.id)} className="text-red-500 hover:text-red-700">
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Interest Form */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-xs font-bold text-[#2B2B2B] block">Add New Interest Tag</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Interest Name"
                  value={newInterest.name}
                  onChange={(e) => setNewInterest({ ...newInterest, name: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200 flex-1"
                />
                <select
                  value={newInterest.category}
                  onChange={(e: any) => setNewInterest({ ...newInterest, category: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="technology">Tech</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts</option>
                  <option value="science">Science</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <Button variant="primary" size="sm" fullWidth onClick={handleAddInterest}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Interest Tag
              </Button>
            </div>
          </div>

          {/* SKILLS */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2B2B2B] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#619B8A]" /> Manage Skills ({taxonomy.skills.length})
            </h3>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
              {taxonomy.skills.map((s) => (
                <div key={s.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
                  <span>{s.name}</span>
                  <button onClick={() => handleDeleteSkill(s.id)} className="text-red-500 hover:text-red-700">
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Form */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-xs font-bold text-[#2B2B2B] block">Add New Skill</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200 flex-1"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="text-xs p-2.5 rounded-xl border border-gray-200 w-28"
                />
              </div>
              <Button variant="primary" size="sm" fullWidth onClick={handleAddSkill}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
              </Button>
            </div>
          </div>

          {/* GOALS */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE3C3] shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2B2B2B] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#C62828]" /> Manage Goals ({taxonomy.goals.length})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {taxonomy.goals.map((g) => (
                <div key={g.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#2B2B2B]">{g.name}</div>
                    <div className="text-[11px] text-[#619B8A]">{g.description}</div>
                  </div>
                  <button onClick={() => handleDeleteGoal(g.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Goal Form */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <span className="text-xs font-bold text-[#2B2B2B] block">Add New Collaboration Goal</span>
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="text-xs p-2.5 rounded-xl border border-gray-200 w-full"
              />
              <input
                type="text"
                placeholder="Goal Description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="text-xs p-2.5 rounded-xl border border-gray-200 w-full"
              />
              <Button variant="primary" size="sm" fullWidth onClick={handleAddGoal}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Goal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POSTS MODERATION */}
      {activeTab === 'posts' && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3C3] shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-[#2B2B2B] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C62828]" /> Post Moderation & Activity Feed
          </h3>

          {posts.length === 0 ? (
            <p className="text-xs text-gray-500">No posts made yet.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={post.author_avatar} name={post.author_name} size="sm" />
                      <div>
                        <div className="font-bold text-xs text-[#2B2B2B]">{post.author_name}</div>
                        <div className="text-[10px] text-[#619B8A]">{post.author_campus || 'Campus'} • {new Date(post.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      {post.likes_count || 0} Likes
                    </span>
                  </div>

                  <p className="text-xs text-[#2B2B2B] leading-relaxed">{post.content}</p>

                  {Boolean(post.interest_tags && post.interest_tags.length > 0) && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.interest_tags?.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-[#FFF3C4] text-[#2B2B2B] font-bold px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 border border-[#EAE3C3]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-[#2B2B2B]">Edit User Profile Details</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="space-y-3 py-1">
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Display Name</label>
                <input
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Campus</label>
                <select
                  value={editForm.campus_id}
                  onChange={(e) => setEditForm({ ...editForm, campus_id: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Level</label>
                  <input
                    type="text"
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 h-20"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="sm" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" fullWidth onClick={handleSaveEditUser}>
                  Save Profile Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
