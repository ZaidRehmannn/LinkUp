'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { commentService } from '@/services/commentService'
import useUserStore from '@/stores/userStore'
import { Ellipsis, Pencil, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CommentActionsDropdown = ({ postId, commentId, setisEditing }) => {
    const token = useUserStore(state => state.token);
    // const setEditPostId = usePostStore(state => state.setEditPostId);
    const [loading, setloading] = useState(false);

    const handleDeleteComment = () => {
        setloading(true);

        try {
            toast.promise(
                commentService.deleteComment(postId, commentId, token),
                {
                    loading: 'Deleting comment...',
                    success: (result) => {
                        if (result.success) {
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
        if (!token) return;
    }, [token])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Ellipsis size={15} className='cursor-pointer' />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setisEditing(true)} >
                    <Pencil />
                    <span className='text-gray-800'>Edit Comment</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleDeleteComment}>
                    <Trash />
                    Delete Comment
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CommentActionsDropdown
