'use client'

import dynamic from 'next/dynamic'

const ChatList = dynamic(() => import('@/components/feed/rightSidebar/chatList/ChatList'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
})

const FloatingChats = dynamic(() => import('@/components/feed/rightSidebar/chatBox/FloatingChats'), {
  ssr: false,
})

export default function ClientChatWrapper() {
  return (
    <>
      <ChatList />
      <FloatingChats />
    </>
  )
}