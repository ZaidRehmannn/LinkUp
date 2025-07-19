import commentModel from "../models/commentModel.js";
import postModel from "../models/postModel.js";

// create a new comment
const createComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    try {
        const comment = new commentModel({ post: postId, user: userId, text });
        await comment.save();

        await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

        res.status(201).json({ success: true, message: "Comment added", comment });
    } catch (error) {
        console.error("Create Comment Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// get all comments for a specfic post
const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await commentModel.find({ post: postId })
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { createComment, getCommentsByPost };
