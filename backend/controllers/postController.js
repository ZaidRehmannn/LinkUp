import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import commentModel from "../models/commentModel.js";

// create a new post
const createPost = async (req, res) => {
    const userId = req.userId;
    let content = "";
    let image = "";
    let video = "";

    try {
        if (req.body.content) {
            content = req.body.content;
        }

        if (req.file && req.file.mimetype.startsWith("image")) {
            image = req.file.path;
        } else if (req.file && req.file.mimetype.startsWith("video")) {
            video = req.file.path;
        }

        const newPost = new postModel({
            user: userId,
            caption: content,
            video,
            image,
        });
        await newPost.save();
        await newPost.populate('user', '_id firstName lastName profilePic');

        res.status(201).json({ success: true, message: "Posted Successfully!", post: newPost })
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// Fetch the user's own posts and following users' posts
const fetchAllPosts = async (req, res) => {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    try {
        const user = await userModel.findById(userId).select("following").lean();

        const allPosts = await postModel
            .find({ user: { $in: [userId, ...user.following] } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "_id firstName lastName profilePic")
            .lean();

        // Count total posts
        const totalPosts = await postModel.countDocuments({
            user: { $in: [userId, ...user.following] },
        });

        res.status(200).json({
            success: true,
            posts: allPosts,
            totalPosts,
            hasMore: skip + allPosts.length < totalPosts,
        });
    } catch (error) {
        console.error("Fetching posts error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};

// fetch a user's posts using his username (for profile page)
const fetchUserPosts = async (req, res) => {
    const { username } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required!" });
    }

    try {
        const user = await userModel.findOne({ username }).select("_id");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const userPosts = await postModel
            .find({ user: user._id })
            .populate("user", "_id firstName lastName profilePic")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total posts for this user
        const totalPosts = await postModel.countDocuments({ user: user._id });

        res.status(200).json({ success: true, userPosts, totalPosts, hasMore: skip + userPosts.length < totalPosts });
    } catch (error) {
        console.error("Fetching user posts error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// delete a post
const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    try {
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        if (post.user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this post!" });
        }

        // delete the post
        await postModel.findByIdAndDelete(postId);

        // delete all comments on the post
        await commentModel.deleteMany({ post: postId });

        res.status(200).json({ success: true, message: "Post Deleted Successfully!" });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" })
    }
};

// edit a post
const editPost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    try {
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        if (post.user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this post!" });
        }

        const updateFields = {};
        const removeMedia = req.body.removeMedia === 'true' || req.body.removeMedia === true;

        // Handle content update
        if (req.body && req.body.content !== undefined) {
            updateFields.caption = req.body.content;
        }

        // Handle new file upload
        if (req.file) {
            // Delete old media before adding new one
            if (req.file.mimetype.startsWith("image")) {
                if (post.video) {
                    const publicId = post.video.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`LinkUp-Posts/${publicId}`);
                }
                updateFields.image = req.file.path;
                updateFields.video = "";
            }
            else if (req.file.mimetype.startsWith("video")) {
                if (post.image) {
                    const publicId = post.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`LinkUp-Posts/${publicId}`);
                }
                updateFields.video = req.file.path;
                updateFields.image = "";
            }
        }

        // Handle media removal
        if (removeMedia) {
            if (post.image) {
                const publicId = post.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`LinkUp-Posts/${publicId}`);
                updateFields.image = "";
            }
            if (post.video) {
                const publicId = post.video.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`LinkUp-Posts/${publicId}`);
                updateFields.video = "";
            }
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            updateFields,
            { new: true }
        );
        await updatedPost.populate('user', '_id firstName lastName profilePic');

        res.status(200).json({ success: true, message: "Post Updated Successfully!", updatedPost });

    } catch (error) {
        console.error("Edit post error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// fetch a post using the postId
const postById = async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ success: false, message: "PostId is required!" });
    }

    try {
        const post = await postModel.findOne({ _id: postId }).populate("user", "_id firstName lastName profilePic username");
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.error("Fetch post by id error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

export { createPost, fetchAllPosts, deletePost, editPost, fetchUserPosts, postById };
