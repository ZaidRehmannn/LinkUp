import conversationModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";

// fetch all conversations of a user
const getConversations = async (req, res) => {
    const userId = req.userId;

    try {
        const conversations = await conversationModel.find({ participants: userId }).sort({ updatedAt: -1 });

        // For each conversation, find the other participant's details
        const formattedConversations = await Promise.all(
            conversations.map(async (conv) => {
                const otherUserId = conv.participants.find((id) => id.toString() !== userId.toString());

                const otherUser = await userModel.findById(otherUserId).select("_id firstName lastName profilePic username");

                return {
                    _id: conv._id,
                    participants: conv.participants,
                    otherUser,
                    unreadCounts: Object.fromEntries(conv.unreadCounts || []),
                    updatedAt: conv.updatedAt,
                    createdAt: conv.createdAt,
                };
            })
        );

        res.status(200).json({ success: true, conversations: formattedConversations });
    } catch (error) {
        console.error("Get conversations error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// mark a conversation as read
const markConversationAsRead = async (req, res) => {
    const receiverId = req.userId;
    const { senderId } = req.params;

    try {
        const conversation = await conversationModel.findOne({ participants: { $all: [senderId, receiverId] } });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        conversation.unreadCounts.set(receiverId, 0);
        await conversation.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Mark conversation as read error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { getConversations, markConversationAsRead };
