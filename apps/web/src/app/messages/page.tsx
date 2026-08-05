'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@hotspots/database';
import { Conversation, Message, UserProfile } from '@hotspots/types';
import { Avatar, Button, EmptyState } from '@hotspots/ui-web';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      const cur = await DataService.getCurrentProfile();
      const convs = await DataService.getConversations();
      setCurrentUser(cur);
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConv(convs[0]);
        const msgs = await DataService.getMessages(convs[0].id);
        setMessages(msgs);
      }
    }
    loadData();
  }, []);

  const selectConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    const msgs = await DataService.getMessages(conv.id);
    setMessages(msgs);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConv) return;

    const sent = await DataService.sendMessage(activeConv.id, newMessageText.trim());
    setMessages((prev) => [...prev, sent]);
    setNewMessageText('');
  };

  const renderConversationList = () => (
    <div className="space-y-3">
      <h3 className="font-bold text-base text-[#2B2B2B]">Conversations</h3>
      {conversations.length > 0 ? (
        conversations.map((conv) => {
          const isSelected = activeConv?.id === conv.id;
          return (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all shadow-xs flex items-center justify-between ${
                isSelected
                  ? 'border-[#C62828] bg-[#FFF3C4]/60 font-bold'
                  : 'border-[#EAE3C3] bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar src={conv.participant.avatar_url} name={conv.participant.display_name} size="md" />
                <div>
                  <h4 className="font-bold text-sm text-[#2B2B2B]">{conv.participant.display_name}</h4>
                  <p className="text-xs text-[#414643] line-clamp-1 font-normal">
                    {conv.lastMessage?.content || 'Started a conversation'}
                  </p>
                </div>
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-[#C62828] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          );
        })
      ) : (
        <EmptyState
          icon={<MessageSquare className="w-6 h-6" />}
          title="No Messages Yet"
          description="Connect with people to unlock 1-to-1 messaging."
        />
      )}
    </div>
  );

  const renderChatThread = () => {
    if (!activeConv) {
      return (
        <div className="hidden md:flex flex-col items-center justify-center h-[75vh] bg-white rounded-2xl border border-[#EAE3C3] text-center p-6">
          <MessageSquare className="w-10 h-10 text-[#619B8A] mb-2" />
          <h4 className="font-bold text-base text-[#2B2B2B]">Select a conversation</h4>
          <p className="text-xs text-[#414643]">Choose a chat from the left panel to start messaging.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-[#EAE3C3] flex flex-col h-[75vh] overflow-hidden">
        {/* Thread Header */}
        <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-[#FFF3C4]/30">
          <button
            onClick={() => setActiveConv(null)}
            className="p-1 rounded-full text-gray-500 hover:bg-black/5 md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar src={activeConv.participant.avatar_url} name={activeConv.participant.display_name} size="sm" />
          <div>
            <h4 className="font-bold text-sm text-[#2B2B2B]">{activeConv.participant.display_name}</h4>
            <p className="text-[10px] text-emerald-600 font-bold">Active now</p>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAFA]">
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUser?.id || msg.sender_id === 'usr_me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isMine
                      ? 'bg-[#C62828] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-[#2B2B2B] border border-gray-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Send Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828]"
          />
          <Button variant="primary" size="md" type="submit" className="p-3">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    );
  };

  return (
    <div className="py-2">
      {/* Desktop 2-Column Split Chat View */}
      <div className="hidden md:grid md:grid-cols-3 gap-5">
        <div className="col-span-1">{renderConversationList()}</div>
        <div className="col-span-2">{renderChatThread()}</div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {activeConv ? renderChatThread() : renderConversationList()}
      </div>
    </div>
  );
}
