import express from 'express'
import authMiddleware from '../middleware/auth.js';
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { createPost, deletePost, fetchAllPosts, likeUnlikePost } from '../controllers/postController.js';

const postRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LinkUp-Posts",
    resource_type: "auto",
    allowedFormats: ["jpg", "png", "jpeg", "mp4", "mov"],
  },
});

const upload = multer({ storage });

postRouter.post("/create", authMiddleware, upload.single("media"), createPost);
postRouter.get("/fetchAll", authMiddleware, fetchAllPosts);
postRouter.post("/like/:id", authMiddleware, likeUnlikePost);
postRouter.post("/delete/:id", authMiddleware, deletePost);

export default postRouter;
