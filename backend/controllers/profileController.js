import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import cloudinary from "../config/cloudinary.js";

// get user info (for zustand on page reloads)
const userInfo = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await userModel.findById(userId).select('-password');

        res.status(200).json({
            success: true,
            message: "UserInfo Fetched Successfully!",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
                email: user.email,
                followers: user.followers.length,
                following: user.following.length,
                createdAt: user.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("UserInfo Fetching error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// Update user info (firstname, lastname, username, bio)
const updateUser = async (req, res) => {
    const userId = req.userId;
    const { firstName, lastName, username, email, bio } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (username && username !== user.username) {
            const existingUser = await userModel.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ success: false, message: "Username already taken!" });
            }
        }

        if (email && email !== user.email) {
            const existingUser = await userModel.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ success: false, message: "Email already in use!" });
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(username && { username }),
                ...(email && { email }),
                ...(bio && { bio })
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePic: updatedUser.profilePic
            },
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

// upload or change profile picture of user
const uploadPicture = async (req, res) => {
    const userId = req.userId;
    let profilePic;

    try {
        const user = await userModel.findById(userId);
        if (user.profilePic) {
            const publicId = user.profilePic.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`LinkUp-ProfilePics/${publicId}`);
        }
        profilePic = req.file.path;
        user.profilePic = profilePic;

        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile Picture Updated!",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePic: user.profilePic
            },
        });
    } catch (error) {
        console.error("Upload profile picture error:", error);
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

        res.status(200).json({
            success: true,
            message: "Profile picture removed!",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePic: user.profilePic
            },
        });
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

// get user profile details by fetching using username
const fetchUserProfile = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required!" });
    }

    try {
        const user = await userModel.findOne({ username }).select('-password -followers -following');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

export { updateUser, removeProfilePic, changePassword, userInfo, uploadPicture, fetchUserProfile };
