import { Server } from 'socket.io'

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    })

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join", (userId) => {
            if (!userId) return
            socket.join(userId)
            console.log(`Socket ${socket.id} joined room: ${userId}`);
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        })
    })

    return io
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized")
    return io
};