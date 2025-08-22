import CreatePost from '@/components/feed/post/CreatePost'
import SuggestedUsers from '@/components/feed/leftSidebar/SuggestedUsers'
import PostList from '@/components/feed/post/PostList'
import ChatList from '@/components/feed/rightSidebar/ChatList'
import React from 'react'
import FloatingChats from '@/components/feed/rightSidebar/FloatingChats'

const page = () => {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-20 py-4 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Suggested Users */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-[80px] h-[calc(100vh-100px)] rounded-2xl p-3 bg-gray-100 dark:bg-gray-900 shadow-md overflow-y-auto">
          <SuggestedUsers />
        </div>
      </aside>

      {/* Feed */}
      <section className="col-span-1 lg:col-span-6">
        <div className="flex flex-col gap-3 h-full overflow-y-auto rounded-2xl p-3 bg-gray-100 dark:bg-gray-900 shadow-md">
          <CreatePost />
          <PostList />
        </div>
      </section>

      {/* Right Sidebar - Chat List */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-[80px] h-[calc(100vh-100px)] rounded-2xl p-3 bg-gray-100 dark:bg-gray-900 shadow-md overflow-y-auto">
          <ChatList />
          <FloatingChats />
        </div>
      </aside>
    </main>
  )
}

export default page
