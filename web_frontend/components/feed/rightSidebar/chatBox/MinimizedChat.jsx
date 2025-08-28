'use client'

import { conversationService } from '@/services/conversationService';
import useChatStore from '@/stores/chatStore';
import useUserStore from '@/stores/userStore';
import { UserCircle, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const MinimizedChat = ({ user }) => {
    const token = useUserStore(state => state.token);
    const currentUserId = useUserStore(state => state.user?._id);

    const userConversations = useChatStore(state => state.userConversations);
    const minimizedChat_Users = useChatStore(state => state.minimizedChat_Users);
    const toggleChat = useChatStore(state => state.toggleChat);
    const closeChat = useChatStore(state => state.closeChat);
    const markConversationAsReadInStore = useChatStore(state => state.markConversationAsReadInStore);

    const [unreadCount, setunreadCount] = useState(0);
    const [conversationId, setconversationId] = useState(null);

    const markConversationAsRead = async (senderId) => {
        try {
            await conversationService.markAsRead(senderId, token);
        } catch (error) {
            console.error("Mark as read conversation error:", error);
        }
    };

    const getUnreadMessagesCount = () => {
        const isMinimized = minimizedChat_Users.find(minimizedUser => minimizedUser._id === user._id);
        if (isMinimized && currentUserId) {
            const conversation = userConversations.find((convo) =>
                convo.participants.some(
                    (participant) => participant.toString() === user._id
                )
            );

            if (conversation) {
                setconversationId(conversation._id);
                const unreadCountForCurrentUser = conversation.unreadCounts?.[currentUserId] || 0;
                setunreadCount(unreadCountForCurrentUser);
            }
        }
    };

    useEffect(() => {
        if (!userConversations || !minimizedChat_Users || !currentUserId) return;
        getUnreadMessagesCount();
    }, [userConversations, minimizedChat_Users, currentUserId])

    return (
        <div
            className={`flex items-center justify-between w-64 p-2 ${unreadCount > 0 ? "bg-blue-500 text-white" : "bg-gray-100"} border rounded-lg shadow cursor-pointer`} onClick={() => {
                toggleChat(user)
                markConversationAsRead(user._id)
                markConversationAsReadInStore(conversationId, currentUserId)
            }}>
            <div className='flex items-center gap-2'>
                {user.profilePic ? (
                    <Image
                        src={user.profilePic}
                        alt="User profile"
                        width={36}
                        height={36}
                        className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                    />
                ) : (
                    <UserCircle className="w-8 h-8 text-gray-500" />
                )}
                <span className="font-semibold">{user.firstName} {user.lastName}</span>
            </div>

            <div className='flex items-center gap-2'>
                {/* unread messages count */}
                {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}

                {/* close chat button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        closeChat(user);
                    }}
                    className='cursor-pointer'
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}

export default MinimizedChat
