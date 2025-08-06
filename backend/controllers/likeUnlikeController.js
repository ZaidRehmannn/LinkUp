import postModel from "../models/postModel.js";

// like or unlike a post
const likeUnlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    try {
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        let likeCount = post.likes.length;

        if (post.likes.includes(userId)) {
            // unlike the post
            post.likes = post.likes.filter((id) => id.toString() !== userId);
            likeCount = likeCount - 1;
            await post.save();
            res.status(200).json({ success: true, message: "Post unliked", likeStatus: false, likeCount });
        } else {
            // like the post
            post.likes.push(userId);
            likeCount = likeCount + 1;
            await post.save();
            res.status(200).json({ success: true, message: "Post liked", likeStatus: true, likeCount });
        }
    } catch (error) {
        console.error("Like/unlike error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// check whether a user has liked a post or not
const likeStatus = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    try {
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        if (post.likes.includes(userId)) {
            res.status(200).json({ success: true, status: true });
        } else {
            res.status(200).json({ success: true, status: false });
        }
    } catch (error) {
        console.error("Like status error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// fetch the list of users who liked the post
const fetchLikes = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await postModel.findById(postId).populate("likes", "firstName lastName username");

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        const users = post.likes.map(user => ({
            fullName: `${user.firstName} ${user.lastName}`,
            username: user.username
        }));

        res.status(200).json({ success: true, likes: users });
    } catch (error) {
        console.error("Fetch likes error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

export { likeUnlikePost, likeStatus, fetchLikes };
