'use client'

import { likePostService } from '@/services/likePostService';
import useUserStore from '@/stores/userStore';
import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const LikePostButton = ({ postId, likes }) => {
    const token = useUserStore(state => state.token);
    const [status, setstatus] = useState(false);
    const [count, setcount] = useState(likes.length);

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
        getLikeStatus();
    }, [])

    return (
        <button className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            <Heart
                className={`w-4 h-4 ${status ? "fill-blue-600 text-blue-600" : "fill-none"}`}
                onClick={handleLikePost}
            />
            {count > 0 && (
                <span>{count}</span>
            )}
            {count > 1 ? "Likes" : "Like"}
        </button>
    )
}

export default LikePostButton
