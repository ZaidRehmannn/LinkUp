'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { postService } from '@/services/postService'
import usePostStore from '@/stores/postStore'
import useUserStore from '@/stores/userStore'
import { Ellipsis, Pencil, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const PostActionsDropdown = ({ postId }) => {
    const token = useUserStore(state => state.token);
    const setEditPostId = usePostStore(state => state.setEditPostId);
    const removePost = usePostStore(state => state.removePost);
    const [loading, setloading] = useState(false);

    const handleDeletePost = () => {
        setloading(true);

        try {
            toast.promise(
                postService.deletePost(postId, token),
                {
                    loading: 'Deleting post...',
                    success: (result) => {
                        if (result.success) {
                            removePost(postId);
                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => error.message || 'Something went wrong!',
                }
            )
        } catch (error) {
            console.error("Delete Post Error: ", error);
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
                <Ellipsis size={18} className='cursor-pointer dark:text-black' />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setEditPostId(postId)}>
                    <Pencil />
                    <span className='text-gray-800'>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleDeletePost}>
                    <Trash />
                    Delete Post
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PostActionsDropdown
