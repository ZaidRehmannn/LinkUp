'use client'

import { postService } from '@/services/postService';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PostCard from '../feed/post/PostCard';

const Posts = ({ username, token }) => {
    const [userPosts, setuserPosts] = useState([]);

    const [loading, setloading] = useState(false);
    const [skip, setskip] = useState(0);
    const [hasMore, sethasMore] = useState(true);
    const [initialLoad, setinitialLoad] = useState(false);

    const limit = 5;
    const skipRef = useRef(0);

    const getUserPosts = useCallback(async (isInitial = false) => {
        if (loading || !hasMore) return;
        setloading(true);

        try {
            const currentSkip = isInitial ? 0 : skipRef.current;
            const result = await postService.fetchUserPosts(username, token, currentSkip, limit);

            if (result.success) {
                if (isInitial) {
                    setuserPosts(result.userPosts);
                    skipRef.current = limit;
                    setskip(limit);
                    setinitialLoad(true);
                } else {
                    setuserPosts(prev => [...prev, ...result.userPosts]);
                    skipRef.current += limit;
                    setskip(prev => prev + limit);
                }
                sethasMore(result.hasMore);
            }
        } catch (error) {
            console.error("Fetch User Posts Error:", error);
        } finally {
            setloading(false);
        }
    }, [loading, hasMore, limit]);

    // Initial load
    useEffect(() => {
        if (!token || initialLoad) return;
        getUserPosts(true);
    }, [username, token, initialLoad, getUserPosts])

    // Handle load more
    const handleLoadMore = useCallback(() => {
        getUserPosts(false);
    }, [getUserPosts]);

    // Show loading only for initial load
    if (loading && !initialLoad) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading posts...</p>
            </main>
        );
    }

    if (userPosts.length === 0 && !loading) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-gray-700 dark:text-gray-900 font-bold text-xl">No posts yet...</p>
            </main>
        );
    }

    return (
        <div className="w-full">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
                <div className='space-y-4'>
                    {userPosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>

                {hasMore ? (
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="w-full px-14 py-2 border border-blue-600 text-blue-600 text-sm font-semibold rounded cursor-pointer mt-1 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading Posts..." : "Load More Posts"}
                    </button>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No more posts</p>
                )}
            </div>
        </div>
    )
}

export default Posts