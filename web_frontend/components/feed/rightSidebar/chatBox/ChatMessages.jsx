'use client'

import React from 'react'
import useUserStore from '@/stores/userStore';

const ChatMessages = ({ messages }) => {
    const currentUserId = useUserStore(state => state.user?._id);

    return (
        <ul className="flex flex-col w-full gap-2">
            {messages.map((message) => {
                const isSentByMe = message.sender === currentUserId;

                return (
                    <li key={message._id} className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[70%] px-3 py-2 rounded-2xl shadow
                                ${isSentByMe
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-300 dark:bg-gray-100 text-gray-900 rounded-bl-none"}
                            `}
                        >
                            <p className="text-sm">{message.text}</p>
                            <span className="text-[10px] opacity-70 block text-right">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default ChatMessages;

