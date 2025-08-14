'use client'

import { postService } from '@/services/postService';
import React, { useEffect, useState } from 'react'
import PostCard from '../feed/post/PostCard';

const Posts = ({ username, token }) => {
    const [userPosts, setuserPosts] = useState([]);
    const [loading, setloading] = useState(false);

    const getUserPosts = async () => {
        setloading(true)
        try {
            const result = await postService.fetchUserPosts(username, token);
            if (result.success) {
                setuserPosts(result.userPosts);
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
            </div>
        </div>
    )
}

export default Posts