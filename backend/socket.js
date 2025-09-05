import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "https://link-up-frontend-fawn.vercel.app",
                "http://localhost:3000"
            ],
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket"]
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("join", (userId) => {
            if (!userId) return;

            // Leave previous rooms
            Array.from(socket.rooms).forEach(room => {
                if (room !== socket.id) socket.leave(room);
            });

            socket.join(userId);
            console.log(`Socket ${socket.id} joined room ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
            socket.removeAllListeners();
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
