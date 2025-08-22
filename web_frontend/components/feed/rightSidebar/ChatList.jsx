'use client'

import React, { useState } from 'react'
import UserChats from './UserChats'
import ChatSearch from './ChatSearch'
import useUserStore from '@/stores/userStore'

const ChatList = () => {
  const token = useUserStore(state => state.token);
  const [userChats, setuserChats] = useState([]);
  const [query, setquery] = useState("");

  const resetOnSelect = () => {
    setquery("");
    setuserChats([]);
  };

  return (
    <main className='flex flex-col gap-3 h-full'>
      {/* heading + search chats */}
      <div className='flex flex-col gap-1'>
        <p className='font-semibold text-blue-700 text-xl p-1'>LinkUp Chats</p>
        <ChatSearch setuserChats={setuserChats} query={query} setquery={setquery} token={token} />
      </div>

      {/* user chats list */}
      <div className='bg-gray-200 dark:bg-gray-300 p-1 rounded-lg transition flex-1 overflow-y-auto'>
        <UserChats userChats={userChats} resetOnSelect={resetOnSelect} />
      </div>
    </main>
  )
}

export default ChatList
