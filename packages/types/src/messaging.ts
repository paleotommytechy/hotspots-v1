import { UserProfile } from './user';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage?: Message;
  unreadCount: number;
  updated_at: string;
}
