'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { postService } from '@/services/postService'
import usePostStore from '@/stores/postStore'
import useUserStore from '@/stores/userStore'
import { Ellipsis, Pencil, Trash } from 'lucide-react'
import React, { useEffect } from 'react'

const PostActionsDropdown = ({ postId }) => {
    const token = useUserStore(state => state.token);
    const setEditPost = usePostStore(state => state.setEditPost);

    useEffect(() => {
        if (!token) return;
    }, [token])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Ellipsis size={18} className='cursor-pointer' />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setEditPost(true)}>
                    <Pencil />
                    <span className='text-gray-800'>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => postService.deletePost(postId, token)}>
                    <Trash />
                    Delete Post
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PostActionsDropdown
