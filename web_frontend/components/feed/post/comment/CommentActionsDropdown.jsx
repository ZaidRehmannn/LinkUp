'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { commentService } from '@/services/commentService'
import useCommentStore from '@/stores/commentStore'
import useUserStore from '@/stores/userStore'
import { Ellipsis, Pencil, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CommentActionsDropdown = ({ postId, commentId, setisEditing, setcomments }) => {
    const token = useUserStore(state => state.token);
    const [loading, setloading] = useState(false);
    const decrementCommentCount = useCommentStore(state => state.decrementCommentCount);

    const handleDeleteComment = () => {
        setloading(true);
        try {
            toast.promise(
                commentService.deleteComment(postId, commentId, token),
                {
                    loading: 'Deleting comment...',
                    success: (result) => {
                        if (result.success) {
                            // removing the deleted comment from the parent state
                            setcomments(prevComments =>
                                prevComments.filter(comment =>
                                    comment._id !== commentId
                                )
                            )
                            decrementCommentCount(postId);

                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => error.message || 'Something went wrong!',
                }
            )
        } catch (error) {
            console.error("Delete Comment Error: ", error);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        if (!token || !decrementCommentCount) return;
    }, [token, decrementCommentCount])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Ellipsis size={15} className='cursor-pointer dark:text-black' />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 dark:bg-gray-300 dark:text-gray-900">
                <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-400" onClick={() => setisEditing(true)} >
                    <Pencil className='dark:text-gray-900' />
                    <span className='text-gray-800'>Edit Comment</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer dark:hover:bg-gray-400 dark:hover:text-red-600"
                    onClick={handleDeleteComment}>
                    <Trash className='dark:text-gray-900' />
                    Delete Comment
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CommentActionsDropdown
