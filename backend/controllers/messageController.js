import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import { messageUser } from "../utils/message.js";
import { convoUser } from "../utils/convo.js";
import userModel from "../models/userModel.js";

// send new message in a conversation
const sendMessage = async (req, res) => {
    const senderId = req.userId;
    const { receiverId, text } = req.body;

    try {
        let newConversation = false;
        // find existing conversation or create a new one
        let conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId],
                unreadCounts: {
                    [senderId]: 0,
                    [receiverId]: 0
                }
            });
            newConversation = true;
        }

        // Create the new message
        const message = await messageModel.create({
            sender: senderId,
            receiver: receiverId,
            conversationId: conversation._id,
            text
        });

        // Increment receiver's unread count
        conversation.unreadCounts.set(
            receiverId,
            (conversation.unreadCounts.get(receiverId) || 0) + 1
        );
        await conversation.save();

        if (newConversation) {
            // for receiver account rendering of conversation in the list
            const otherUser = await userModel.findById(senderId).select("_id firstName lastName profilePic");

            const formattedConversation = {
                _id: conversation._id,
                participants: conversation.participants,
                otherUser,
                unreadCounts: Object.fromEntries(conversation.unreadCounts || []),
                updatedAt: conversation.updatedAt,
                createdAt: conversation.createdAt,
            };

            // emit real-time message using socket.io
            messageUser(receiverId, message);
            // emit real-time new conversation using socket.io
            convoUser(receiverId, formattedConversation);

            // for own account rendering of conversation in the list
            const receiver = await userModel.findById(receiverId).select("_id firstName lastName profilePic");

            res.status(200).json({ success: true, conversation: { ...formattedConversation, otherUser: receiver }, message, newConversation });
        }
        else {
            // emit real-time message using socket.io
            messageUser(receiverId, message);
            res.status(200).json({ success: true, message });
        }
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
