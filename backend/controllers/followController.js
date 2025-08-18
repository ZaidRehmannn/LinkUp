import userModel from "../models/userModel.js";
import { notifyUser } from "../utils/notify.js";

// follow or unfollow a user
const followUnfollowUser = async (req, res) => {
    const userId = req.userId;
    const { id: targetId } = req.params;

    try {
        const user = await userModel.findById(userId).select('following');
        const targetUser = await userModel.findById(targetId).select('followers');

        const isFollowing = user.following.some(id => id.toString() === targetId.toString());

        if (isFollowing) {
            // Unfollow
            user.following = user.following.filter(id => id.toString() !== targetId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== user._id.toString());
        } else {
            // Follow
            user.following.push(targetId);
            targetUser.followers.push(user._id);

            // emit real-time notification
            notifyUser(targetId, {
                type: "follow",
                fromUserId: userId,
                message: "started following you",
                createdAt: new Date().toISOString()
            });
        }

        await user.save();
        await targetUser.save();

        res.status(200).json({ success: true, message: isFollowing ? "User Unfollowed!" : "User Followed!" });
    } catch (error) {
        console.error("Follow/Unfollow error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// get follow status (whether you are following the user or not)
const getFollowStatus = async (req, res) => {
    const userId = req.userId;
    const { id: targetId } = req.params;

    try {
        const user = await userModel.findById(userId).select('following');

        const isFollowing = user.following.some(id => id.toString() === targetId.toString());

        res.status(200).json({ success: true, status: isFollowing });
    } catch (error) {
        console.error("Follow Status error:", error);
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

export { followUnfollowUser, getFollowers, getFollowing, getFollowStatus };
