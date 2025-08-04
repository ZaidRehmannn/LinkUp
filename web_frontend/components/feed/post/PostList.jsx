'use client'

import React, { useEffect } from 'react'
import Post from './Post'
import { usefetchPost } from '@/hooks/usePost'
import { postService } from '@/services/postService'
import useUserStore from '@/stores/userStore'

const PostList = () => {
  const loggedInUserId = useUserStore(state => state.user?._id);

  const {
    token,
    posts,
    setposts,
    loading,
    setloading
  } = usefetchPost();

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
    if(!token) return
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
        <Post key={post._id} post={post} loggedInUserId={loggedInUserId} />
      ))}
    </main>
  )
}

export default PostList
