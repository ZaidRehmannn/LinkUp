'use client';

import { commentService } from '@/services/commentService';
import useUserStore from '@/stores/userStore';
import React, { useEffect, useState } from 'react';
import OldCommentBox from './OldCommentBox';
import NewCommentBox from './NewCommentBox';
import formatTimeAgo from '@/lib/formatTime';

const Comments = ({ postId }) => {
  const token = useUserStore(state => state.token);
  const loggedInUserId = useUserStore(state => state.user?._id);
  const [comments, setcomments] = useState([]);
  const [loadComments, setloadComments] = useState(false);
  const [skip, setskip] = useState(0);
  const [hasMore, sethasMore] = useState(true);
  const limit = 5;

  const formatComment = (comment, loggedInUserId) => ({
    ...comment,
    timeAgo: formatTimeAgo(comment?.createdAt),
    canEdit: comment?.user._id === loggedInUserId
  });

  const fetchPostComments = async () => {
    setloadComments(true);
    try {
      const result = await commentService.fetchPostComments(postId, token, skip, limit);
      if (result.success) {
        const formattedComments = result.comments.map(comment => (
          formatComment(comment, loggedInUserId)
        ));
        setcomments(prev => [...formattedComments, ...prev]);
        setskip(prev => prev + limit);
        sethasMore(result.hasMore);
      }
    } catch (error) {
      console.error("Fetch post comments error:", error);
    } finally {
      setloadComments(false);
    }
  };

  useEffect(() => {
    if (!token && !loggedInUserId) return;
    fetchPostComments();
  }, [token, loggedInUserId]);

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
        {!loadComments ? (
          comments.length > 0 ? (
            <ul className="space-y-3">
              {comments.map(comment => (
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

              {hasMore ? (
                <button
                  onClick={fetchPosts}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              ) : (
                <p className="text-gray-500 text-center mt-4">No more comments</p>
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-800 text-center">No comments yet</p>
          )
        ) : (
          <div className="flex justify-center items-center text-blue-600 font-medium">
            Loading Comments...
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
