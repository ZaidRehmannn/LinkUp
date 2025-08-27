'use client'

import React, { useEffect } from 'react'
import UserChatCard from './UserChatCard'
import useChatStore from '@/stores/chatStore'
import useUserStore from '@/stores/userStore'
import { conversationService } from '@/services/conversationService'
import useSocket from '@/hooks/useSocket'

const UserChats = ({ searchResults, resetOnSelect }) => {
  const token = useUserStore(state => state.token);
  const currentUserId = useUserStore(state => state.user?._id);
  const userConversations = useChatStore(state => state.userConversations);
  const setuserConversations = useChatStore(state => state.setuserConversations);
  const addConversationToStore = useChatStore(state => state.addConversationToStore);
  const toggleChat = useChatStore(state => state.toggleChat);
  const markConversationAsReadInStore = useChatStore(state => state.markConversationAsReadInStore);

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

  useEffect(() => {
    if (!token) return;
    fetchUserConversations();
  }, [token])

  // handle incoming new conversations
  const handleIncomingNewConversation = (conversation) => {
    addConversationToStore(conversation);
  }
  useSocket(currentUserId, { onNewConversation: handleIncomingNewConversation });

  return (
    <>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((result) => (
            <li
              key={result._id}
              onClick={() => {
                resetOnSelect()
                toggleChat(result)
              }}
            >
              <UserChatCard user={result} />
            </li>
          ))}
        </ul>
      ) : userConversations.length > 0 ? (
        <ul>
          {userConversations.map((convo) => (
            <li
              key={convo._id}
              onClick={() => {
                resetOnSelect()
                toggleChat(convo.otherUser)
                markConversationAsRead(convo.otherUser._id)
                markConversationAsReadInStore(convo._id, currentUserId)
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

export default UserChats
