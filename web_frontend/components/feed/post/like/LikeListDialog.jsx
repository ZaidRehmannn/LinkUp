'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { likePostService } from '@/services/likePostService';
import useUserStore from '@/stores/userStore';

const LikeListDialog = ({ postId, open, onOpenChange }) => {
    const token = useUserStore(state => state.token);
    const [users, setusers] = useState([]);

    useEffect(() => {
        if (!token) return;
        if (open) {
            fetchLikes();
        }
    }, [open]);

    const fetchLikes = async () => {
        try {
            const result = await likePostService.fetchLikeUsers(postId, token);
            if (result.success) {
                setusers(result.likes);
            }
        } catch (error) {
            console.error("Fetch Like Users Error:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="dark:bg-gray-300 dark:text-black">
                <DialogHeader>
                    <DialogTitle>Liked by</DialogTitle>
                </DialogHeader>

                <div className="mt-2">
                    {users.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-700">No likes yet.</p>
                    ) : (
                        <ul className="space-y-1">
                            {users.map((user) => (
                                <li key={user.username} className="text-sm text-gray-800 dark:text-black">
                                    {user.fullName}{' '}
                                    <span className="text-gray-500 dark:text-gray-700">(@{user.username})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LikeListDialog;
