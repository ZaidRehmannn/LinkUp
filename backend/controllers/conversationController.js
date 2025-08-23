import conversationModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";

const getConversations = async (req, res) => {
    const userId = req.userId;

    try {
        const conversations = await conversationModel.find({ participants: userId }).sort({ updatedAt: -1 });

        // For each conversation, find the other participant's details
        const formattedConversations = await Promise.all(
            conversations.map(async (conv) => {
                const otherUserId = conv.participants.find((id) => id.toString() !== userId.toString());
                
                const otherUser = await userModel.findById(otherUserId).select("_id firstName lastName profilePic");

                return {
                    _id: conv._id,
                    participants: conv.participants,
                    otherUser,
                    unreadCounts: conv.unreadCounts,
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

export { getConversations };
