import { getIO } from "../socket.js";

export const notifyUser = (receiverUserId, payload) => {
    const io = getIO()
    io.to(receiverUserId.toString()).emit("notification", payload)
    console.log('🔔 Sent notification to user:', receiverUserId, payload)
};