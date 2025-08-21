'use client'

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSocket(userId, onNotification) {
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

        socket.on("notification", (payload) => {
            if (onNotification) onNotification(payload)
        })

        return () => {
            socket.disconnect();
        }
    }, [userId, onNotification])

    return socketRef.current;
};