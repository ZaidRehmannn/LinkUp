import conversationModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";

// for searching users on LinkUp App
const searchUsers = async (req, res) => {
    try {
        const query = req.query.q?.trim();
        if (!query) {
            return res.status(200).json([]);
        }

        const users = await userModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ["$firstName", " ", "$lastName"] },
                            regex: query,
                            options: "i"
                        }
                    }
                }
            ]
        }).select("_id firstName lastName username profilePic");

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Search users error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// for searching users that you can chat with
const searchChats = async (req, res) => {
    const userId = req.userId;

    try {
        const query = req.query.q?.trim();
        if (!query) {
            return res.status(200).json({ success: true, chatUsers: [] });
        }

        const currentUser = await userModel.findById(userId).select("followers following");
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // merging all users that you are allowed to chat with
        const allowedUsers = [...currentUser.followers, ...currentUser.following];

        // fetch all allowed users matching the search query
        const chatUsers = await userModel.find({
            _id: { $in: allowedUsers },
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ["$firstName", " ", "$lastName"] },
                            regex: query,
                            options: "i"
                        }
                    }
                }
            ]
        }).select("_id firstName lastName profilePic username");

        if (!chatUsers.length) {
            return res.status(200).json({ success: true, chatUsers: [] });
        }

        // fetch all conversations between userId and these chatUsers in a single query
        const conversations = await conversationModel.find({
            participants: { $all: [userId] },
            participants: { $in: chatUsers.map(u => u._id) }
        });

        const unreadCountsMap = {};
        conversations.forEach(convo => {
            const otherParticipant = convo.participants.find(p => p.toString() !== userId.toString());
            if (otherParticipant) {
                unreadCountsMap[otherParticipant.toString()] = convo.unreadCounts.get(userId.toString()) || 0;
            }
        });

        // merge unread counts into chat users
        const chatUsersWithUnread = chatUsers.map(user => ({
            ...user.toObject(),
            unreadCount: unreadCountsMap[user._id.toString()] || 0
        }));

        return res.status(200).json({ success: true, chatUsers: chatUsersWithUnread });
    } catch (error) {
        console.error("Search chat users error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { searchUsers, searchChats };
