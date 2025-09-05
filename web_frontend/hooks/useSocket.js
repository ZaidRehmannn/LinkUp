'use client';

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useSocket(userId, { onNotification, onNewMessage, onNewConversation } = {}) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!userId) return;
        if (socketRef.current) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join", userId);
            console.log("Socket connected:", socket.id);
        });

        if (onNotification) {
            socket.on("notification", onNotification);
        }

        if (onNewMessage) {
            socket.on("newMessage", onNewMessage);
        }

        if (onNewConversation) {
            socket.on("newConversation", onNewConversation);
        }

        return () => {
            if (socketRef.current) {
                socket.off("notification");
                socket.off("newMessage");
                socket.off("newConversation");
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);

    return socketRef.current;
}