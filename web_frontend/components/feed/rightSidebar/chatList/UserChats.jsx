'use client'

import React, { useEffect } from 'react'
import UserChatCard from './UserChatCard'
import useChatStore from '@/stores/chatStore'
import useUserStore from '@/stores/userStore'
import { conversationService } from '@/services/conversationService'
import useSocket from '@/hooks/useSocket'
import playSound from '@/lib/webAudioAPI'

const UserChats = ({ searchResults, resetOnSelect }) => {
  const token = useUserStore(state => state.token);
  const currentUserId = useUserStore(state => state.user?._id);
  const userConversations = useChatStore(state => state.userConversations);
  const setuserConversations = useChatStore(state => state.setuserConversations);
  const addConversationToStore = useChatStore(state => state.addConversationToStore);
  const toggleChat = useChatStore(state => state.toggleChat);
  const markConversationAsReadInStore = useChatStore(state => state.markConversationAsReadInStore);
  const chatWindowStatus = useChatStore(state => state.chatWindowStatus);
  const updateUnreadCount = useChatStore(state => state.updateUnreadCount);

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

  // Handle incoming new messages
  const handleIncomingMessage = (message) => {
    const isChatOpen = chatWindowStatus(message.sender);

    if (isChatOpen) {
      // mark chat as read 
      markConversationAsRead(message.sender);
      markConversationAsReadInStore(message.conversationId, currentUserId);
    } else {
      // update unread messages count
      updateUnreadCount(message.conversationId, message.receiver);
    }

    playSound("message");
  };
  useSocket(currentUserId, { onNewMessage: handleIncomingMessage });

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
