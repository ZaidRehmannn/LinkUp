import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import { messageUser } from "../utils/message.js";

// send new message in a conversation
const sendMessage = async (req, res) => {
    const senderId = req.userId;
    const { receiverId, text } = req.body;

    try {
        // find existing conversation or create a new one
        let conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId]
            });
        }

        // Create the new message
        const message = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            conversationId: conversation._id,
            text
        });

        // emit real-time message using socket.io
        messageUser(receiverId, message);

        res.status(200).json({ success: true, message });
    } catch (error) {
        console.error("Send new message error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// fetch all messages of a conversation
const getMessages = async (req, res) => {
    const senderId = req.userId;
    const { receiverId } = req.params;

    try {
        const messages = await messageModel.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Fetch messages error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { sendMessage, getMessages };
