'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import PostCard from './PostCard';
import { postService } from '@/services/postService';
import useUserStore from '@/stores/userStore';
import usePostStore from '@/stores/postStore';

const PostList = () => {
  const token = useUserStore(state => state.token);
  const posts = usePostStore(state => state.posts);
  const setPosts = usePostStore(state => state.setPosts);
  const addPosts = usePostStore(state => state.addPosts);

  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const limit = 5;
  const skipRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchPosts = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current || loading || !hasMore || !token) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const currentSkip = isInitial ? 0 : skipRef.current;
      const result = await postService.fetchPosts(token, currentSkip, limit);

      if (result.success) {
        if (isInitial) {
          setPosts(result.posts);
          skipRef.current = limit;
          setSkip(limit);
          setInitialLoadDone(true);
        } else {
          addPosts(result.posts);
          skipRef.current += limit;
          setSkip(prev => prev + limit);
        }
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Fetch Posts Error:', error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [token, loading, hasMore, limit, setPosts, addPosts]);

  useEffect(() => {
    if (!token || initialLoadDone) return;
    fetchPosts(true);
  }, [token, initialLoadDone]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) fetchPosts(false);
  }, [loading, hasMore, fetchPosts]);

  if (loading && !initialLoadDone) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
        <p className="text-blue-600 font-bold text-xl">Loading posts...</p>
      </main>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
        <p className="text-gray-700 dark:text-gray-900 font-bold text-xl">No posts yet...</p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore ? (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full px-14 py-2 border border-blue-600 text-blue-600 text-sm font-semibold rounded cursor-pointer mt-1 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading Posts...' : 'Load More Posts'}
        </button>
      ) : (
        <p className="text-gray-500 text-center mt-4">No more posts</p>
      )}
    </main>
  );
};

export default PostList;
