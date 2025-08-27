'use client'

import { conversationService } from '@/services/conversationService';
import useChatStore from '@/stores/chatStore';
import useUserStore from '@/stores/userStore';
import { UserCircle, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const MinimizedChat = ({ user }) => {
    const token = useUserStore(state => state.token);
    const currentUserId = useUserStore(state => state.user?._id);
    const toggleChat = useChatStore(state => state.toggleChat);
    const closeChat = useChatStore(state => state.closeChat);
    const markConversationAsReadInStore = useChatStore(state => state.markConversationAsReadInStore);


    const markConversationAsRead = async (senderId) => {
        try {
            await conversationService.markAsRead(senderId, token);
        } catch (error) {
            console.error("Mark as read conversation error:", error);
        }
    };

    return (
        <div
            className="flex items-center justify-between w-64 p-2 bg-gray-100 border rounded-lg shadow cursor-pointer" onClick={() => {
                toggleChat(user)
                markConversationAsRead(user._id)
                markConversationAsReadInStore()
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
    )
}

export default MinimizedChat
