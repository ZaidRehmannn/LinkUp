import userModel from "../models/userModel.js";

// follow or unfollow a user
const followUnfollowUser = async (req, res) => {
    const userId = req.userId;
    const targetId = req.params.id;

    try {
        const user = await userModel.findById(userId);

        if (user.following.includes(targetId)) {
            // unfollow the user
            user.following = user.following.filter((id) => id !== targetId);
            await user.save();
            res.status(200).json({ success: true, message: "User Unfollowed!" });
        } else {
            // follow the user
            user.following.push(targetId);
            await user.save();
            res.status(200).json({ success: true, message: "User Followed!" });
        }
    } catch (error) {
        console.error("Follow/Unfollow error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// get followers of own or any other user
const getFollowers = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required!" });
    }

    try {
        const user = await userModel.findOne({ username }).populate("followers", "firstName lastName username profilePic");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.status(200).json({ success: true, followers: user.followers });
    } catch (error) {
        console.error("Get Followers error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// get following of own or any other user
const getFollowing = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required!" });
    }

    try {
        const user = await userModel.findOne({ username }).populate("following", "firstName lastName username profilePic");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.status(200).json({ success: true, following: user.following });
    } catch (error) {
        console.error("Get Following error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

export { followUnfollowUser, getFollowers, getFollowing };
