'use client'

import React, { useEffect, useState } from 'react'
import PostCard from './PostCard'
import { postService } from '@/services/postService'
import useUserStore from '@/stores/userStore'

const PostList = () => {
  const token = useUserStore(state => state.token);
  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(false);

  const fetchPosts = async () => {
    try {
      setloading(true);

      const result = await postService.fetchPosts(token);
      if (result.success) {
        setposts(result.posts);
      }
    } catch (error) {
      console.error("Fetch Posts Error: ", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!token) return
    fetchPosts();
  }, [token])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
        <p className="text-blue-600 font-bold text-xl">Loading posts...</p>
      </main>
    );
  }

  if (!posts) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
        <p className="text-gray-700 font-bold text-xl">No posts yet...</p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </main>
  )
}

export default PostList
