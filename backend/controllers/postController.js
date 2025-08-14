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

// fetch the user's own post and the following users posts
const fetchAllPosts = async (req, res) => {
    const userId = req.userId;

    try {
        const userPosts = await postModel.find({ user: userId }).populate("user", "_id firstName lastName profilePic");

        const user = await userModel.findById(userId).select('following');
        const followingPostsArray = await Promise.all(
            user.following.map((followingUserId) => {
                return postModel.find({ user: followingUserId }).populate("user", "_id firstName lastName profilePic");
            })
        );

        const followingPosts = followingPostsArray.flat();

        const allPosts = [...userPosts, ...followingPosts];
        const sortedAllPosts = allPosts.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({ success: true, message: "All Posts Fetched", posts: sortedAllPosts })
    } catch (error) {
        console.error("fetching posts error:", error);
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

export { createPost, fetchAllPosts, deletePost, editPost };
