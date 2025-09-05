'use client';

import { commentService } from '@/services/commentService';
import useUserStore from '@/stores/userStore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import OldCommentBox from './OldCommentBox';
import NewCommentBox from './NewCommentBox';
import formatTimeAgo from '@/lib/formatTime';

const Comments = ({ postId }) => {
  const token = useUserStore(state => state.token);
  const loggedInUserId = useUserStore(state => state.user?._id);
  const [comments, setcomments] = useState([]);

  const [loading, setloading] = useState(false);
  const [skip, setskip] = useState(0);
  const [hasMore, sethasMore] = useState(true);
  const [initialLoad, setinitialLoad] = useState(false);

  const limit = 5;
  const skipRef = useRef(0);

  const formatComment = (comment, loggedInUserId) => ({
    ...comment,
    timeAgo: formatTimeAgo(comment?.createdAt),
    canEdit: comment?.user._id === loggedInUserId
  });

  const fetchPostComments = useCallback(async (isInitial = false) => {
    if (loading || !hasMore || !token) return;
    setloading(true);

    try {
      const currentSkip = isInitial ? 0 : skipRef.current;
      const result = await commentService.fetchPostComments(postId, token, currentSkip, limit);

      if (result.success) {
        const formattedComments = result.comments.map(comment => (
          formatComment(comment, loggedInUserId)
        ));
        if (isInitial) {
          setcomments(formattedComments);
          skipRef.current = limit;
          setskip(limit);
          setinitialLoad(true);
        } else {
          setcomments(prev => [...prev, ...formattedComments]);
          skipRef.current += limit;
          setskip(prev => prev + limit);
        }
        sethasMore(result.hasMore);
      }
    } catch (error) {
      console.error("Fetch post comments error:", error);
    } finally {
      setloading(false);
    }
  }, [token, loading, hasMore, limit]);

  // Initial load
  useEffect(() => {
    if (!token || !loggedInUserId || initialLoad) return;
    fetchPostComments(true);
  }, [token, loggedInUserId, fetchPostComments, initialLoad]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    fetchPostComments(false);
  }, [fetchPostComments]);

  if (loading && !initialLoad) {
    return (
      <div className="mt-4 flex justify-center items-center text-blue-600 font-medium">
        Loading Comments...
      </div>
    )
  }

  return (
    <div className="border dark:border-gray-500 rounded-lg bg-white dark:bg-gray-300 p-3 mt-3 shadow-sm dark:shadow-xl">
      {/* New comment box */}
      <NewCommentBox
        postId={postId}
        setcomments={setcomments}
        loggedInUserId={loggedInUserId}
        token={token}
        formatComment={formatComment}
      />

      {/* Previous comments */}
      <div className="mt-4">
        {comments.length === 0 && !loading ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-800 text-center">
            No comments yet
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment._id}>
                <OldCommentBox
                  comment={comment}
                  setcomments={setcomments}
                  loggedInUserId={loggedInUserId}
                  token={token}
                  formatComment={formatComment}
                />
              </li>
            ))}
          </ul>
        )}

        {comments.length > 0 && (
          hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full px-14 py-2 border border-blue-600 text-blue-600 text-sm font-semibold rounded cursor-pointer mt-3 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading Comments..." : "Load More Comments"}
            </button>
          ) : (
            <p className="text-gray-500 text-center mt-4">No more comments</p>
          )
        )}
      </div>
    </div>
  );
};

export default Comments;
