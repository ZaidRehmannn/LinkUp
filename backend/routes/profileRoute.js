import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import authMiddleware from '../middleware/auth.js';
import { changePassword, fetchUserProfile, removeProfilePic, updateUser, uploadPicture, userInfo } from '../controllers/profileController.js';

const profileRouter = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'LinkUp-ProfilePics',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});

const upload = multer({ storage });

profileRouter.put('/update-profile-details', authMiddleware, updateUser);
profileRouter.put('/upload-profile-pic', authMiddleware, upload.single("image"), uploadPicture);
profileRouter.put('/remove-profile-pic', authMiddleware, removeProfilePic);
profileRouter.put('/change-password', authMiddleware, changePassword);
profileRouter.get('/userInfo', authMiddleware, userInfo);
profileRouter.get('/:username', authMiddleware, fetchUserProfile);

export default profileRouter;