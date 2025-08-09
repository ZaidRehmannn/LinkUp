'use client'

import { UserCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import CommentActionsDropdown from './CommentActionsDropdown';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { commentService } from '@/services/commentService';
import useUserStore from '@/stores/userStore';

const OldCommentBox = ({ comment, commentEdited }) => {
  const { _id, text, user, timeAgo, canEdit, post } = comment;
  const { firstName, lastName, profilePic } = user;
  const postId = post._id;

  const token = useUserStore(state => state.token);
  const [isEditing, setisEditing] = useState(false);
  const [commentText, setcommentText] = useState(text);
  const [loading, setloading] = useState(false);

  const handleEditComment = async () => {
    setloading(true);

    try {
      await toast.promise(
        commentService.editComment(_id, commentText, token),
        {
          loading: 'Updating comment...',
          success: (result) => {
            if (result.success) {
              setcommentText(result.updatedComment.text);
              setisEditing(false);

              // Refresh comments
              commentEdited(result.updatedComment);

              return result.message;
            } else {
              throw new Error(result.message);
            }
          },
          error: (error) => error.message || 'Something went wrong!',
        }
      );
    } catch (error) {
      console.error("Edit comment error:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className='flex gap-2'>
        <div className="w-11 h-10 mt-1 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profilePic ? (
            <Image
              src={profilePic}
              alt={`${firstName}'s picture`}
              width={42}
              height={40}
              priority
              className="object-cover"
            />
          ) : (
            <UserCircle className="text-gray-500 w-8 h-8" />
          )}
        </div>

        <div className="bg-gray-100 rounded-lg px-3 py-2 w-full">
          <div className="flex justify-between">
            <span className="font-semibold text-sm text-gray-900">
              {firstName} {lastName}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{timeAgo}</span>

              {/* own comment options */}
              {canEdit && !isEditing && (
                <CommentActionsDropdown
                  postId={postId}
                  commentId={_id}
                  setisEditing={setisEditing}
                />
              )}
            </span>
          </div>

          {isEditing ? (
            <textarea
              value={commentText}
              onChange={(e) => setcommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full resize-none text-sm outline-none p-1 mt-1 rounded-md border focus:ring-1 focus:ring-blue-600"
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
          )}

          {/* save and cancel buttons */}
          {isEditing && (
            <div className="flex justify-end gap-2 mt-1">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
                onClick={() => {
                  setisEditing(false);
                  setcommentText(text);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs cursor-pointer"
                onClick={handleEditComment}
                disabled={!commentText.trim() || loading}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OldCommentBox;
