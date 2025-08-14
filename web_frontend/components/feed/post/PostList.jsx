'use client'

import React, { useEffect, useState } from 'react'
import PostCard from './PostCard'
import { postService } from '@/services/postService'
import useUserStore from '@/stores/userStore'
import usePostStore from '@/stores/postStore'

const PostList = () => {
  const token = useUserStore(state => state.token);
  const posts = usePostStore(state => state.posts);
  const setPosts = usePostStore(state => state.setPosts);
  const [loading, setloading] = useState(false);

  const fetchPosts = async () => {
    try {
      setloading(true);

      const result = await postService.fetchPosts(token);
      if (result.success) {
        setPosts(result.posts);
      }
    } catch (error) {
      console.error("Fetch Posts Error: ", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!token || !setPosts) return
    fetchPosts();
  }, [token, setPosts])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
        <p className="text-blue-600 font-bold text-xl">Loading posts...</p>
      </main>
    );
  }

  if (posts.length === 0) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
        <p className="text-gray-700 dark:text-gray-900 font-bold text-xl">No posts yet...</p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      {posts.length > 0 && posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </main>
  )
}

export default PostList
