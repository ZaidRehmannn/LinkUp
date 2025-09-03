'use client'

import useSocket from '@/hooks/useSocket'
import playSound from '@/lib/webAudioAPI'
import { conversationService } from '@/services/conversationService'
import useUserStore from '@/stores/userStore'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useChatStore from '@/stores/chatStore'

const MobileChatWrapper = () => {
    const token = useUserStore(state => state.token);
    const currentUserId = useUserStore(state => state.user?._id);
    const updateUnreadCount = useChatStore(state => state.updateUnreadCount);
    const [newMessage, setnewMessage] = useState(false);
    const pathname = usePathname();

    const checkUnread = async () => {
        try {
            const result = await conversationService.checkUnreadConversation(token);
            if (result.success) {
                setnewMessage(result.status);
                console.log("unread chat status:", result.status);
            }
        } catch (error) {
            console.error("check unread conversation error:", error);
        }
    };

    useEffect(() => {
        if (!token) return;
        checkUnread();
    }, [token, pathname])

    // handle incoming new conversations
    const handleIncomingNewConversation = (conversation) => {
        addConversationToStore(conversation);
    };

    // Handle incoming new messages
    const handleIncomingMessage = (message) => {
        updateUnreadCount(message.conversationId, message.receiver);
        setnewMessage(true);
        playSound("message");
    };

    useSocket(currentUserId, {
        onNewConversation: handleIncomingNewConversation,
        onNewMessage: handleIncomingMessage
    });

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
