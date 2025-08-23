'use client'

import React, { useEffect, useState } from 'react'
import UserChatCard from './UserChatCard'
import useChatStore from '@/stores/chatStore'
import axios from '@/lib/axios'
import useUserStore from '@/stores/userStore'

const UserChats = ({ searchResults, resetOnSelect }) => {
  const toggleChat = useChatStore(state => state.toggleChat);
  const token = useUserStore(state => state.token);
  const [userConversations, setuserConversations] = useState([]);

  const fetchUserConversations = async () => {
    try {
      const response = await axios.get('/api/conversation/fetchAll', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setuserConversations(response.data.conversations);
      }
    } catch (error) {
      console.error("Fetch user conversations error:", error);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUserConversations();
  }, [token])

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
              }}
            >
              <UserChatCard user={convo.otherUser} />
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
