import React from 'react'
import ChatList from '@/components/feed/rightSidebar/chatList/ChatList'
import ChatWindow from '@/components/feed/rightSidebar/mobileChats/ChatWindow'

const page = () => {
  return (
    <main className='h-[calc(100vh-4rem)] pt-16 py-4 w-11/12 mx-auto'>
      <ChatList />
      <ChatWindow />
    </main>
  )
}

export default page
