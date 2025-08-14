import commentModel from "../models/commentModel.js";
import postModel from "../models/postModel.js";

// create a new comment
const createComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    try {
        const comment = new commentModel({
            post: postId,
            user: userId,
            text
        });

        await comment.save();
        await comment.populate('user', '_id firstName lastName profilePic');
        await comment.populate('post', '_id');

        await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

        res.status(201).json({ success: true, message: "Comment added", newComment: comment });
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
            .populate("user", "_id firstName lastName profilePic")
            .populate("post", "_id")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// delete a comment from a post
const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.userId;

    try {
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found!" });
        }

        if (comment.user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this comment!" });
        }

        await commentModel.findByIdAndDelete(commentId);

        await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

        res.status(200).json({ success: true, message: "Comment Deleted Successfully!" });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// edit a comment from a post
const editComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    try {
        const comment = await commentModel.findById(commentId).populate('user', '_id firstName lastName profilePic');

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found!" });
        }

        if (comment.user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this comment!" });
        }

        comment.text = text;
        await comment.save();

        res.status(200).json({ success: true, message: "Comment Edited Successfully!", updatedComment: comment });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { createComment, getCommentsByPost, deleteComment, editComment };
