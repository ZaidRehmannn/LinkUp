import commentModel from "../models/commentModel.js";
import notificationModel from "../models/notificationModel.js";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { notifyUser } from "../utils/notify.js";

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

        const postOwner = await postModel.findById(postId).select("user").populate("user", "_id");

        await comment.save();
        await comment.populate('user', '_id firstName lastName profilePic');
        await comment.populate('post', '_id');

        await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

        if (postOwner.user._id.toString() !== userId) {
            // saving notification in db
            await notificationModel.create({
                sender: userId,
                receiver: postOwner.user._id,
                type: "comment",
                postId,
                message: "commented on your post"
            });

            // getting sender details for real-time notification
            const senderUser = await userModel.findById(userId).select("_id firstName lastName profilePic username");

            // emit real-time notification
            notifyUser(postOwner.user._id, {
                type: "comment",
                sender: senderUser,
                postId,
                message: "commented on your post",
                createdAt: new Date().toISOString()
            });
        }

        res.status(201).json({ success: true, message: "Comment added", newComment: comment });
    } catch (error) {
        console.error("Create Comment Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// Get all comments for a specific post
const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    try {
        const comments = await commentModel.find({ post: postId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "_id firstName lastName profilePic")
            .populate("post", "_id")
            .lean();

        // Count total comments
        const totalComments = await commentModel.countDocuments({ post: postId });

        res.status(200).json({
            success: true,
            comments,
            totalComments,
            hasMore: skip + comments.length < totalComments
        });
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
