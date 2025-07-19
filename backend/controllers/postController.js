import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

// create a new post
const createPost = async (req, res) => {
    const { text } = req.body;
    const userId = req.userId;
    let image = "";
    let video = "";

    try {
        if (req.file && req.file.mimetype.startsWith("image")) {
            image = req.file.path;
        } else if (req.file && req.file.mimetype.startsWith("video")) {
            video = req.file.path;
        }

        const newPost = new postModel({
            user: userId,
            text,
            video,
            image,
        });

        await newPost.save();
        res.status(201).json({ success: true, message: "Post created!", post: newPost })
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// fetch the user's own post and the following users posts
const fetchAllPosts = async (req, res) => {
    const userId = req.userId;

    try {
        const userPosts = await postModel.find({ user: userId }).populate("user", "username profilePic");

        const user = await userModel.findById(userId);
        const followingPostsArray = await Promise.all(
            user.following.map((followingUserId) => {
                return postModel.find({ user: followingUserId }).populate("user", "username profilePic");
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

// like or unlike a post
const likeUnlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    try {
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        if (post.likes.includes(userId)) {
            // unlike the post
            post.likes = post.likes.filter((id) => id.toString() !== userId);
            await post.save();
            res.status(200).json({ success: true, message: "Post unliked" });
        } else {
            // like the post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ success: true, message: "Post liked" });
        }
    } catch (error) {
        console.error("Like/unlike error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" })
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

        if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this post!" });
        }

        await postModel.findByIdAndDelete(postId);
        res.status(200).json({ success: true, message: "Post deleted successfully!" });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" })
    }
};

export { createPost, fetchAllPosts, likeUnlikePost, deletePost };
