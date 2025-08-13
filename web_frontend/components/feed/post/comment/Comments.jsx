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

  const formatComment = (comment, loggedInUserId) => ({
    ...comment,
    timeAgo: formatTimeAgo(comment?.createdAt),
    canEdit: comment?.user._id === loggedInUserId
  });

  const fetchPostComments = async () => {
    setloadComments(true);
    try {
      const result = await commentService.fetchPostComments(postId, token);
      if (result.success) {
        const formattedComments = result.comments.map(comment => (
          formatComment(comment, loggedInUserId)
        ));
        setcomments(formattedComments);
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
    <div className="border rounded-lg bg-white p-3 mt-3 shadow-sm">
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
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center">No comments yet</p>
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
