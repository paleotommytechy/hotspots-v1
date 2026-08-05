'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataService } from '@hotspots/database';
import { UserProfile, ConnectionRequest } from '@hotspots/types';
import { Avatar, Button, EmptyState } from '@hotspots/ui-web';
import { Users, Check, X, MessageSquare, ShieldAlert } from 'lucide-react';
import { ReportModal } from '../../components/report-modal';

export default function ConnectionsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'requests' | 'connections'>('requests');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [reportTarget, setReportTarget] = useState<UserProfile | null>(null);

  const refreshData = async () => {
    const cur = await DataService.getCurrentProfile();
    const all = await DataService.getAllProfiles();
    const conns = await DataService.getConnections();
    setCurrentUser(cur);
    setProfiles(all);
    setConnections(conns);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getProfile = (id: string) => profiles.find((p) => p.id === id);

  const pendingRequests = connections.filter(
    (c) => c.recipient_id === currentUser?.id && c.status === 'pending'
  );

  const activeConnections = connections.filter(
    (c) =>
      (c.requester_id === currentUser?.id || c.recipient_id === currentUser?.id) &&
      c.status === 'accepted'
  );

  const handleAccept = async (id: string) => {
    await DataService.updateConnectionStatus(id, 'accepted');
    await refreshData();
  };

  const handleReject = async (id: string) => {
    await DataService.updateConnectionStatus(id, 'rejected');
    await refreshData();
  };

  const renderRequestsList = () => (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-[#2B2B2B] hidden md:block">
        Pending Requests ({pendingRequests.length})
      </h3>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((req) => {
          const requester = getProfile(req.requester_id);
          if (!requester) return null;

          return (
            <div key={req.id} className="bg-white p-4 rounded-2xl border border-[#EAE3C3] space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <Avatar src={requester.avatar_url} name={requester.display_name} size="md" />
                <div>
                  <h4 className="font-bold text-sm text-[#2B2B2B]">{requester.display_name}</h4>
                  <p className="text-xs text-[#414643]">{requester.department} • {requester.level}</p>
                </div>
              </div>

              {req.message && (
                <p className="text-xs text-[#2B2B2B] bg-[#FFF3C4]/40 p-2.5 rounded-xl italic">"{req.message}"</p>
              )}

              <div className="flex gap-2">
                <Button variant="primary" size="sm" fullWidth onClick={() => handleAccept(req.id)}>
                  <Check className="w-3.5 h-3.5 mr-1" /> Accept
                </Button>
                <Button variant="outline" size="sm" fullWidth onClick={() => handleReject(req.id)}>
                  <X className="w-3.5 h-3.5 mr-1" /> Ignore
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No Pending Connection Requests"
          description="When someone wants to connect with you based on your interests, their invitation will show up here."
        />
      )}
    </div>
  );

  const renderConnectionsList = () => (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-[#2B2B2B] hidden md:block">
        Active Connections ({activeConnections.length})
      </h3>
      {activeConnections.length > 0 ? (
        activeConnections.map((conn) => {
          const otherId = conn.requester_id === currentUser?.id ? conn.recipient_id : conn.requester_id;
          const peer = getProfile(otherId);
          if (!peer) return null;

          return (
            <div key={conn.id} className="bg-white p-3.5 rounded-2xl border border-[#EAE3C3] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <Avatar src={peer.avatar_url} name={peer.display_name} size="md" />
                <div>
                  <h4 className="font-bold text-sm text-[#2B2B2B]">{peer.display_name}</h4>
                  <p className="text-xs text-[#414643]">{peer.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Link href={`/messages`}>
                  <Button variant="secondary" size="sm" className="p-2">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </Link>

                <button
                  onClick={() => setReportTarget(peer)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-xl"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No Connections Yet"
          description="Your next great collaborator is one interest away. Start discovering people!"
          actionLabel="Discover People"
          onAction={() => router.push('/discover')}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4 py-2">
      {/* Mobile Segmented Toggle Control */}
      <div className="flex p-1 bg-[#FFF3C4] border border-[#EAE3C3] rounded-2xl md:hidden">
        <button
          onClick={() => setTab('requests')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === 'requests' ? 'bg-[#C62828] text-white shadow-xs' : 'text-[#414643]'
          }`}
        >
          Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setTab('connections')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === 'connections' ? 'bg-[#C62828] text-white shadow-xs' : 'text-[#414643]'
          }`}
        >
          Connections ({activeConnections.length})
        </button>
      </div>

      {/* Desktop View: Side-by-side 2 Column Split View */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <div>{renderRequestsList()}</div>
        <div>{renderConnectionsList()}</div>
      </div>

      {/* Mobile View: Single Tab Selection */}
      <div className="md:hidden">
        {tab === 'requests' ? renderRequestsList() : renderConnectionsList()}
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={Boolean(reportTarget)}
          onClose={() => setReportTarget(null)}
          targetUserName={reportTarget.display_name}
          onConfirmReport={() => alert('Report submitted to moderation')}
          onConfirmBlock={() => alert(`${reportTarget.display_name} blocked`)}
        />
      )}
    </div>
  );
}
