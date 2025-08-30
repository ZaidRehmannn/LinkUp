'use client'

import React, {useEffect} from 'react'
import { conversationService } from '@/services/conversationService';
import useChatStore from '@/stores/chatStore';
import useUserStore from '@/stores/userStore';
import useSocket from '@/hooks/useSocket'
import playSound from '@/lib/webAudioAPI'

const UserChatsMobile = ({ searchResults, resetOnSelect }) => {
  const token = useUserStore(state => state.token);
  const currentUserId = useUserStore(state => state.user?._id);
  const userConversations = useChatStore(state => state.userConversations);
  const setuserConversations = useChatStore(state => state.setuserConversations);

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

  return (
    <div>

    </div>
  )
}

export default UserChatsMobile
