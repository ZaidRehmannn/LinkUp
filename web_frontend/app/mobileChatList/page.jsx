'use client'

import React, { useState } from 'react'
import useUserStore from '@/stores/userStore';
import ChatSearch from '@/components/feed/rightSidebar/chatList/ChatSearch';
import UserChatsMobile from '@/components/feed/rightSidebar/chatList/UserChatsMobile';

const page = () => {
  const token = useUserStore(state => state.token);
  const [searchResults, setsearchResults] = useState([]);
  const [query, setquery] = useState("");

  const resetOnSelect = () => {
    setquery("");
    setsearchResults([]);
  };

  return (
    <main className='h-[calc(100vh-4rem)] flex flex-col gap-3 pt-16 py-4 w-11/12 mx-auto'>
      {/* heading + search chats */}
      <div className='flex flex-col gap-1'>
        <p className='font-semibold text-blue-700 text-4xl lg:text-xl px-2 py-3 lg:p-1'>
          LinkUp Chats
        </p>
        <ChatSearch
          setsearchResults={setsearchResults}
          query={query}
          setquery={setquery}
          token={token}
        />
      </div>

      {/* user chats list */}
      <div className='block lg:hidden bg-gray-200 dark:bg-gray-300 p-1 rounded-lg transition flex-1 overflow-y-auto'>
        <UserChatsMobile
          searchResults={searchResults}
          resetOnSelect={resetOnSelect}
        />
      </div>
    </main>
  )
}

export default page