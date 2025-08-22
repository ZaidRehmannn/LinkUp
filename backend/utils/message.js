import { getIO } from "../socket.js";

export const messageUser = (receiverUserId, payload) => {
    const io = getIO()
    io.to(receiverUserId.toString()).emit("newMessage", payload)
};