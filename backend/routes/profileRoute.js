import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import authMiddleware from '../middleware/auth.js';
import { changePassword, removeProfilePic, updateUser } from '../controllers/profileController.js';

const profileRouter = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'LinkUp-ProfilePics',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});

const upload = multer({ storage });

profileRouter.put('/update-profile', authMiddleware, upload.single("image"), updateUser);
profileRouter.put('/remove-profile-pic', authMiddleware, removeProfilePic);
profileRouter.put('/change-password', authMiddleware, changePassword);

export default profileRouter;