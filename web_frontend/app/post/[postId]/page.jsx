'use client'

import SuggestedUsers from '@/components/feed/leftSidebar/SuggestedUsers'
import PostCard from '@/components/feed/post/PostCard'
import ChatList from '@/components/feed/rightSidebar/ChatList'
import { postService } from '@/services/postService'
import useUserStore from '@/stores/userStore'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const params = useParams()
    const postId = params?.postId
    const token = useUserStore(state => state.token);
    const [post, setpost] = useState(null);
    const [loading, setloading] = useState(false);

    const fetchPost = async () => {
        setloading(true);
        try {
            const result = await postService.fetchPostById(postId, token);
            if (result.success) {
                setpost(result.post);
            }
        } catch (error) {
            console.error("Fetch Post By Id Error: ", error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        if (!token) return
        fetchPost();
    }, [token, postId])

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading post...</p>
            </main>
        );
    }

    return (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-20 py-4 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
            {/* Left Sidebar - Suggested Users */}
            <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-[80px] h-[calc(100vh-100px)] rounded-2xl p-4 bg-gray-100 dark:bg-gray-900 shadow-md overflow-y-auto">
                    <SuggestedUsers />
                </div>
            </aside>

            {/* Feed */}
            <section className="col-span-1 lg:col-span-6">
                <div className="flex flex-col gap-3 h-[calc(100vh-100px)] overflow-y-auto rounded-2xl p-4 bg-gray-100 dark:bg-gray-900 shadow-md">
                    {post && (
                        <PostCard post={post} postPage={true} />
                    )}
                </div>
            </section>

            {/* Right Sidebar - Chat List */}
            <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-[80px] h-[calc(100vh-100px)] rounded-2xl p-4 bg-gray-100 dark:bg-gray-900 shadow-md overflow-y-auto">
                    <ChatList />
                </div>
            </aside>
        </main>
    )
}

export default page
