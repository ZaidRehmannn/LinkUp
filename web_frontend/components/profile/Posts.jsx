'use client'

import { postService } from '@/services/postService';
import React, { useEffect, useState } from 'react'
import PostCard from '../feed/post/PostCard';

const Posts = ({ username, token }) => {
    const [userPosts, setuserPosts] = useState([]);
    const [loading, setloading] = useState(false);
    const [skip, setskip] = useState(0);
    const [hasMore, sethasMore] = useState(true);
    const limit = 5;

    const getUserPosts = async () => {
        setloading(true)
        try {
            const result = await postService.fetchUserPosts(username, token, skip, limit);
            if (result.success) {
                setuserPosts(prev => [...result.userPosts, ...prev]);
                setskip(prev => prev + limit);
                sethasMore(result.hasMore);
            }
        } catch (error) {
            console.error("Fetch User Posts Error:", error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        getUserPosts();
    }, [username, token])

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading posts...</p>
            </main>
        );
    }

    return (
        <div className="w-full">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
                {userPosts.length > 0 ? (
                    <div className='space-y-4'>
                        {userPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-center">No posts yet...</p>
                )}

                {hasMore ? (
                    <button
                        onClick={fetchPosts}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No more posts</p>
                )}
            </div>
        </div>
    )
}

export default Posts