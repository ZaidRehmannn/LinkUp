'use client'

import React, { useEffect } from 'react'
import { conversationService } from '@/services/conversationService';
import useChatStore from '@/stores/chatStore';
import useUserStore from '@/stores/userStore';
import useSocket from '@/hooks/useSocket';
import playSound from '@/lib/webAudioAPI';
import { useRouter } from 'next/navigation';
import UserChatCard from './UserChatCard';

const UserChatsMobile = ({ searchResults, resetOnSelect }) => {
  const token = useUserStore(state => state.token);
  const currentUserId = useUserStore(state => state.user?._id);

  const userConversations = useChatStore(state => state.userConversations);
  const setuserConversations = useChatStore(state => state.setuserConversations);
  const markConversationAsReadInStore = useChatStore(state => state.markConversationAsReadInStore);
  const addConversationToStore = useChatStore(state => state.addConversationToStore);
  const updateUnreadCount = useChatStore(state => state.updateUnreadCount);

  const router = useRouter();

  const fetchUserConversations = async () => {
    try {
      const result = await conversationService.fetchConversations(token);
      if (result.success) {
        setuserConversations(result.conversations);
      }
    } catch (error) {
      console.error("Fetch user conversations error:", error);
    }
  };

  const markConversationAsRead = async (senderId) => {
    try {
      await conversationService.markAsRead(senderId, token);
    } catch (error) {
      console.error("Mark as read conversation error:", error);
    }
  };

  const handleChatClick = (conversation) => {
    resetOnSelect();
    markConversationAsRead(conversation.otherUser._id);
    markConversationAsReadInStore(conversation._id, currentUserId);
  };

  const handleSearchResult = (searchResult) => {
    const existingConversation = userConversations.find((convo) =>
      convo.participants.some((participant) => participant.toString() === searchResult._id)
    );

    if (existingConversation) {
      handleChatClick(existingConversation);
    } else {
      resetOnSelect();
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUserConversations();
  }, [token])

  // handle incoming new conversations
  const handleIncomingNewConversation = (conversation) => {
    addConversationToStore(conversation);
  };

  // Handle incoming new messages
  const handleIncomingMessage = (message) => {
    updateUnreadCount(message.conversationId, message.receiver);
    playSound("message");
  };

  useSocket(currentUserId, {
    onNewConversation: handleIncomingNewConversation,
    onNewMessage: handleIncomingMessage
  });

  return (
    <>
      {searchResults.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {searchResults.map((result) => (
            <li
              key={result._id}
              onClick={() => {
                handleSearchResult(result)
                router.push(`/mobileChat/${result.username}`)
              }}
            >
              <UserChatCard
                user={result}
                unreadCount={result.unreadCount}
              />
            </li>
          ))}
        </ul>
      ) : userConversations.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {userConversations.map((convo) => (
            <li
              key={convo._id}
              onClick={() => {
                handleChatClick(convo)
                router.push(`/mobileChat/${convo.otherUser.username}`)
              }}
            >
              <UserChatCard
                user={convo.otherUser}
                unreadCount={convo.unreadCounts?.[currentUserId] || 0}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-gray-500 font-semibold'>No Chats available...</p>
        </div>
      )}
    </>
  )
}

export default UserChatsMobile
