import userModel from "../models/userModel.js";

const fetchExploreUsers = async (req, res) => {
    const userId = req.userId;

    try {
        const currentUser = await userModel.findById(userId).select("following");

        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // excluding own and people already following
        const excludedUsers = [userId, ...currentUser.following];

        // 1) finding people that my following follows
        const followedByFollowing = await userModel.find({
            followers: { $in: currentUser.following },
            _id: { $nin: excludedUsers }
        }).select("_id firstName lastName username profilePic");

        // 2) finding people that follows my following
        const sameFollowing = await userModel.find({
            following: { $in: currentUser.following },
            _id: { $nin: excludedUsers }
        }).select("_id firstName lastName username profilePic");

        // 3) Random Users (fallback)
        const others = await userModel.find({
            _id: { $nin: excludedUsers }
        }).select("_id firstName lastName username profilePic").limit(7);

        // Combine all with priority (mutuals first)
        const combined = [
            ...followedByFollowing,
            ...sameFollowing,
            ...others
        ];

        // Deduplicate by _id while keeping order
        const uniqueSuggestions = Array.from(
            new Map(combined.map(user => [user._id.toString(), user])).values()
        ).slice(0, 7);

        res.json({ success: true, users: uniqueSuggestions });
    } catch (error) {
        console.error("Fetching explore users error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

export { fetchExploreUsers };
