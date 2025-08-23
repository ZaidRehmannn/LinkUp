'use client'

import useChatStore from '@/stores/chatStore'
import React, { useEffect } from 'react'
import OpenChatWindow from './OpenChatWindow';
import MinimizedChat from './MinimizedChat';

const FloatingChats = () => {
    const openChat_Users = useChatStore(state => state.openChat_Users);
    const minimizedChat_Users = useChatStore(state => state.minimizedChat_Users);

    useEffect(() => {
        if (!openChat_Users || !minimizedChat_Users) return;
    }, [openChat_Users, minimizedChat_Users]);

    return (
        <>
            {/* Open chat windows */}
            <div className="fixed bottom-1 right-8 flex gap-3">
                {openChat_Users.map((user) => (
                    <OpenChatWindow user={user} key={user._id} />
                ))}
            </div>

            {/* Minimized chats */}
            {minimizedChat_Users.length > 0 && (
                <div className="fixed bottom-1 right-8 flex gap-2">
                    {minimizedChat_Users.map((user) => (
                        <MinimizedChat user={user} key={user._id} />
                    ))}
                </div>
            )}
        </>
    )
}

export default FloatingChats;
