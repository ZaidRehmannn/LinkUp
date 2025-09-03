'use client'

import useSocket from '@/hooks/useSocket'
import playSound from '@/lib/webAudioAPI'
import { conversationService } from '@/services/conversationService'
import useUserStore from '@/stores/userStore'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const MobileChatWrapper = () => {
    const token = useUserStore(state => state.token);
    const currentUserId = useUserStore(state => state.user?._id);
    const [newMessage, setnewMessage] = useState(false);

    const checkUnread = async () => {
        try {
            const result = conversationService.checkUnreadConversation(token);
            if (result.success) {
                setnewMessage(result.status);
            }
        } catch (error) {
            console.error("check unread conversation error:", error);
        }
    };

    useEffect(() => {
        if (!token) return;
        checkUnread();
    }, [token])

    // Handle incoming new messages
    const handleIncomingMessage = () => {
        playSound("message");
        setnewMessage(true);
    };
    useSocket(currentUserId, { onNewMessage: handleIncomingMessage });

    return (
        <div className="relative w-fit h-fit">
            <Link
                href="/mobileChatList"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition duration-300 flex items-center justify-center relative"
            >
                <MessageCircle size={28} />
                {newMessage && (
                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 rounded-full border-2 border-white"></span>
                )}
            </Link>
        </div>
    )
}

export default MobileChatWrapper
