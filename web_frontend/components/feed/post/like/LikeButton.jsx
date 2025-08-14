'use client'

import { likePostService } from '@/services/likePostService';
import useUserStore from '@/stores/userStore';
import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import LikeListDialog from './LikeListDialog';

const LikeButton = ({ postId, likes }) => {
    const token = useUserStore(state => state.token);
    const [status, setstatus] = useState(false);
    const [count, setcount] = useState(likes.length);
    const [openDialog, setopenDialog] = useState(false);

    const handleLikePost = async () => {
        try {
            const result = await likePostService.like_unlikePost(postId, token);
            if (result.success) {
                setstatus(result.likeStatus);
                setcount(result.likeCount);
            }
        } catch (error) {
            console.error("Like/Unlike Post Error: ", error);
        }
    };

    const getLikeStatus = async () => {
        try {
            const result = await likePostService.fetchLikeStatus(postId, token);
            if (result.success) {
                setstatus(result.status);
            }
        } catch (error) {
            console.error("Fetch Like Status Error: ", error);
        }
    };

    useEffect(() => {
        if (!token) return;
        setcount(likes.length);
        getLikeStatus();
    }, [])

    return (
        <>
            <button className="group flex items-center gap-1 text-sm hover:text-blue-600 cursor-pointer" onClick={handleLikePost}>
                <Heart className={`w-4 h-4 ${status ? "fill-blue-600 text-blue-600" : "fill-none"}`} />
                <span className="group-hover:underline group-hover:underline-offset-2 group-hover:decoration-blue-600" onClick={(e) => {
                    e.stopPropagation();
                    setopenDialog(true);
                }}>
                    {count > 0 ? `${count} ` : ''}{count > 1 ? "Likes" : "Like"}
                </span>
            </button>

            <LikeListDialog
                postId={postId}
                open={openDialog}
                onOpenChange={setopenDialog}
            />
        </>
    )
}

export default LikeButton
