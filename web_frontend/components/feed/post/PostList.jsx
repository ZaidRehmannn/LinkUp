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
  const [skip, setskip] = useState(0);
  const [hasMore, sethasMore] = useState(true);
  const limit = 5;

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setloading(true);

    try {
      const result = await postService.fetchPosts(token, skip, limit);
      if (result.success) {
        setPosts(result.posts);
        setskip(prev => prev + limit);
        sethasMore(result.hasMore);
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
    </main>
  )
}

export default PostList
