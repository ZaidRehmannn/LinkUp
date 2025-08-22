import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import { messageUser } from "../utils/message.js";

// send new message in a conversation
const sendMessage = async (req, res) => {
    const senderId = req.userId;
    const { conversationId, receiverId, text } = req.body;

    try {
        // find existing conversation or create a new one
        let conversation;
        if (conversationId) {
            conversation = await conversationModel.findById(conversationId);
        } else {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId],
                receiver: receiverId
            })
        }

        // Create the new message
        const message = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            conversationId: conversation._id,
            text
        });

        // emit real-time message using socket.io
        messageUser(receiverId, { text })

        res.status(200).json({ success: true, message });
    } catch (error) {
        console.error("Send new message error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// fetch all messages of a conversation
const getMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const messages = await messageModel.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Fetch messages error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { sendMessage, getMessages };
