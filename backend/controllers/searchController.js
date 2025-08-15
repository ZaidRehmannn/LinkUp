import userModel from "../models/userModel.js";

const searchUsers = async (req, res) => {
    try {
        const query = req.query.q?.trim();
        if (!query) {
            return res.json([]);
        }

        const users = await userModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
            ]
        }).select("_id firstName lastName username profilePic");

        return res.json({ success: true, users });
    } catch (error) {
        console.error("Search users error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { searchUsers };
