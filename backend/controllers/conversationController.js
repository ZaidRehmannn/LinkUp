import conversationModel from "../models/conversationModel";

const getConversations = async (req, res) => {
    const userId = req.userId;

    try {
        const conversations = await conversationModel.find({ participants: userId })
            .populate("receiver", "_id firstName lastName profilePic")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error("Send new message error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { getConversations };
