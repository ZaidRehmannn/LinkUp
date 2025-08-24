'use client'

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSocket(userId, { onNotification, onNewMessage, onNewConversation }) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!userId) return

        const socket = io(SOCKET_URL, {
            transports: ["websocket"]
        })
        socketRef.current = socket

        socket.on("connect", () => {
            socket.emit("join", userId)
        })

        // for listening to new notifications (like, commment, follow)
        socket.on("notification", (payload) => {
            if (onNotification) onNotification(payload)
        })

        // for listening to new chat messages
        socket.on("newMessage", (payload) => {
            if (onNewMessage) onNewMessage(payload)
        })

        // for listening to new conversations
        socket.on("newConversation", (payload) => {
            if (onNewConversation) onNewConversation(payload)
        })

        return () => {
            socket.disconnect();
        }
    }, [userId, onNotification, onNewMessage])

    return socketRef.current;
};