'use client'

import useChatStore from '@/stores/chatStore';
import React, { useEffect } from 'react'

const ChatWindow = () => {
    const openChat_Users = useChatStore(state => state.openChat_Users);

    useEffect(() => {
        if (!openChat_Users) return;
    }, [openChat_Users]);

    return (
        <div>

        </div>
    )
}

export default ChatWindow
