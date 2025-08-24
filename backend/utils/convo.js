import { getIO } from "../socket.js";

export const convoUser = (receiverUserId, payload) => {
    const io = getIO()
    io.to(receiverUserId.toString()).emit("newConversation", payload)
};