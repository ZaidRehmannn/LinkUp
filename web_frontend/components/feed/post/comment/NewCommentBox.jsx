'use client';

import { Button } from '@/components/ui/button';
import { commentService } from '@/services/commentService';
import useCommentStore from '@/stores/commentStore';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const NewCommentBox = ({ postId, setcomments, loggedInUserId, token, formatComment }) => {
    const [commentText, setcommentText] = useState("");
    const [loading, setloading] = useState(false);
    const incrementCommentCount = useCommentStore(state => state.incrementCommentCount);

    const handleNewComment = async () => {
        setloading(true);
        try {
            await toast.promise(
                commentService.addComment(postId, commentText, token),
                {
                    loading: 'Adding comment...',
                    success: (result) => {
                        if (result.success) {
                            setcommentText("");

                            // prepend the new comment to the previous comments list
                            setcomments(prevComments => [
                                formatComment(result.newComment, loggedInUserId),
                                ...prevComments
                            ]);
                            incrementCommentCount(postId);

                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => error.message || 'Something went wrong!',
                }
            );
        } catch (error) {
            console.error("Add new comment error:", error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        if (!incrementCommentCount) return
    }, [incrementCommentCount])


    return (
        <div className="flex gap-2">
            <textarea
                placeholder="Write a comment..."
                className="w-full dark:placeholder:text-gray-700 dark:text-black resize-none text-sm outline-none p-2 rounded-md border dark:border-gray-500 focus:ring-1 focus:ring-blue-600"
                value={commentText}
                onChange={(e) => setcommentText(e.target.value)}
                rows={2}
            />
            <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs mt-1 px-4 py-2 rounded-md cursor-pointer"
                onClick={handleNewComment}
                disabled={!commentText.trim() || loading}
            >
                {loading ? "Adding" : "Add"}
            </Button>
        </div>
    );
};

export default NewCommentBox;
