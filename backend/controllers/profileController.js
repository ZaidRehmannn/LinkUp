import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import cloudinary from "../config/cloudinary.js";

// get user info (for zustand on page reloads)
const userInfo = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await userModel.findById(userId);

        res.status(200).json({ success: true,
            message: "UserInfo Fetched Successfully!",
            user: {
                _id: user._id,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("UserInfo Fetching error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// Update user info (username, bio, profile picture)
const updateUser = async (req, res) => {
    const userId = req.userId;
    const { username, bio } = req.body;
    let profilePic;

    try {
        const user = await userModel.findById(userId);

        if (username && username !== user.username) {
            const existingUser = await userModel.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ success: false, message: "Username already taken!" });
            }
        }

        if (req.file && req.file.path) {
            if (user.profilePic) {
                const publicId = user.profilePic.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`LinkUp-ProfilePics/${publicId}`);
            }
            profilePic = req.file.path;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                ...(username && { username }),
                ...(bio && { bio }),
                ...(profilePic && { profilePic }),
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                bio: updatedUser.bio,
                profilePic: updatedUser.profilePic,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// remove profile picture of user
const removeProfilePic = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (user.profilePic) {
            const publicId = user.profilePic.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`LinkUp-ProfilePics/${publicId}`);
            user.profilePic = "";
            await user.save();
        }

        res.status(200).json({ success: true, message: "Profile picture removed!" });
    } catch (error) {
        console.error("Remove profile picture error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// change password of user
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Old password is incorrect!" });
        }

        if (newPassword.length < 8 || !/\d/.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters and include a number.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

export { updateUser, removeProfilePic, changePassword, userInfo };
