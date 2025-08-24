'use client'

import { messageService } from '@/services/messageService';
import useChatStore from '@/stores/chatStore';
import useUserStore from '@/stores/userStore';
import { Send, UserCircle, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ChatMessages from './ChatMessages';
import useSocket from '@/hooks/useSocket';

const OpenChatWindow = ({ user }) => {
    const toggleChat = useChatStore(state => state.toggleChat);
    const closeChat = useChatStore(state => state.closeChat);
    const token = useUserStore(state => state.token);
    const currentUserId = useUserStore(state => state.user?._id);
    const [messageText, setmessageText] = useState("");
    const [messages, setmessages] = useState([]);
    const textareaRef = useRef(null);

    // Auto-resize textarea up to max height
    const handleInputChange = (e) => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        const maxHeight = 120;
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    const fetchChatMessages = async () => {
        try {
            const result = await messageService.fetchMessages(user._id, token);
            if (result.success) {
                setmessages(result.messages);
            }
        } catch (error) {
            console.error("Fetch chat messages error:", error);
        }
    };

    const sendNewMessage = async () => {
        try {
            const result = await messageService.sendNewMessage(user._id, messageText, token);
            if (result.success) {
                setmessages(prev => [...prev, result.message])
                setmessageText("");
            }
        } catch (error) {
            console.error("Send new message error:", error);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchChatMessages();
    }, [token])

    // this socket.io event is listened by the message receiver only
    const handleIncomingMessage = (message) => {
        setmessages(prev => [...prev, message]);
    };
    useSocket(currentUserId, { onNewMessage: handleIncomingMessage });

    return (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg border flex flex-col">
            {/* Chat header */}
            <div
                className="flex justify-between items-center p-2 border-b bg-gray-100 rounded-t-lg cursor-pointer"
                onClick={() => toggleChat(user)}
            >
                <div className="flex items-center gap-2">
                    {user.profilePic ? (
                        <Image
                            src={user.profilePic}
                            alt="User profile"
                            width={36}
                            height={36}
                            className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                        />
                    ) : (
                        <UserCircle className="w-9 h-9 text-gray-500" />
                    )}
                    <span className="font-semibold">{user.firstName} {user.lastName}</span>
                </div>

                {/* Close chat button */}
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

            {/* chat messages list */}
            <div className="flex-1 p-3 overflow-y-auto">
                <ChatMessages messages={messages} />
            </div>

            {/* Type a message box */}
            <div className="border-t p-2 flex items-center gap-2">
                <textarea
                    ref={textareaRef}
                    value={messageText}
                    onChange={(e) => {
                        handleInputChange();
                        setmessageText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (messageText.trim()) {
                                sendNewMessage();
                            }
                        } else if (e.key === "Enter" && e.shiftKey) {
                            return;
                        }
                    }}
                    rows={1}
                    placeholder="Type a message..."
                    className="w-full px-2 py-2 rounded border text-sm resize-none overflow-hidden max-h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button className="p-2 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer" onClick={sendNewMessage} disabled={!messageText} >
                    <Send size={16} className="text-white" />
                </button>
            </div>
        </div>
    );
};

export default OpenChatWindow;
