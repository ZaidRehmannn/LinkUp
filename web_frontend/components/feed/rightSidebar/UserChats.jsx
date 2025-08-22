'use client'

import React from 'react'
import UserChatCard from './UserChatCard'
import useChatStore from '@/stores/chatStore'

const UserChats = ({ userChats, resetOnSelect }) => {
  const toggleChat = useChatStore(state => state.toggleChat);

  return (
    <div>
      {userChats.length > 0 && (
        <ul>
          {userChats.map((user) => (
            <li
              key={user._id}
              onClick={() => {
                resetOnSelect
                toggleChat(user)
              }}
            >
              <UserChatCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserChats
