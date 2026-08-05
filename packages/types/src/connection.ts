export type ConnectionStatus = 'none' | 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface ConnectionRequest {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: ConnectionStatus;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
}

export interface UserReport {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface UserBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}
