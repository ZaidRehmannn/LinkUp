'use client'

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSocket(userId, onNotification) {
    console.log("🔧 useSocket hook called with userId:", userId);
    console.log("🔧 SOCKET_URL:", SOCKET_URL);
    console.log("🔧 onNotification function:", onNotification);
    
    const socketRef = useRef(null);
    
    useEffect(() => {
        console.log("🔧 useEffect triggered, userId:", userId);
        
        if (!userId) {
            console.log("❌ No userId, not connecting socket");
            return;
        }
        
        console.log("🚀 Creating socket connection to:", SOCKET_URL);
        
        const socket = io(SOCKET_URL, {
            transports: ["websocket"]
        });
        
        socketRef.current = socket;
        
        socket.on("connect", () => {
            console.log("✅ Socket connected! Socket ID:", socket.id);
            socket.emit("join", userId);
            console.log("📤 Emitted 'join' event with userId:", userId);
        });
        
        socket.on("notification", (payload) => {
            console.log("🔔 Received notification:", payload);
            if (onNotification) {
                console.log("📞 Calling onNotification callback");
                onNotification(payload);
            } else {
                console.log("❌ No onNotification callback provided");
            }
        });
        
        socket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });
        
        socket.on("connect_error", (error) => {
            console.error("💥 Socket connection error:", error);
        });
        
        // Test if socket is working
        setTimeout(() => {
            console.log("🔧 Socket status check:");
            console.log("  - Connected:", socket.connected);
            console.log("  - Socket ID:", socket.id);
            console.log("  - Transport:", socket.io.engine.transport.name);
        }, 2000);
        
        return () => {
            console.log("🧹 Cleaning up socket connection");
            socket.disconnect();
        };
    }, [userId, onNotification]);
    
    return socketRef.current;
};