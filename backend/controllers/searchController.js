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
            return res.status(200).json([]);
        }

        const currentUser = await userModel.findById(userId).select("followers following");
        // merging all users that you are allowed to chat with
        const allowedUsers = [...currentUser.followers, ...currentUser.following];

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
        }).select("_id firstName lastName profilePic");

        return res.status(200).json({ success: true, chatUsers });
    } catch (error) {
        console.error("Search chat users error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { searchUsers, searchChats };
