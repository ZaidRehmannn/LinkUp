'use client';

import { Button } from '@/components/ui/button';
import { commentService } from '@/services/commentService';
import useUserStore from '@/stores/userStore';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NewCommentBox = ({ postId, commentAdded }) => {
    const token = useUserStore(state => state.token);
    const [commentText, setcommentText] = useState("");
    const [loading, setloading] = useState(false);

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

                            // Refresh comments
                            commentAdded(result.newComment);

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

    return (
        <div className="flex gap-2">
            <textarea
                placeholder="Write a comment..."
                className="w-full resize-none text-sm outline-none p-2 rounded-md border focus:ring-1 focus:ring-blue-600"
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
