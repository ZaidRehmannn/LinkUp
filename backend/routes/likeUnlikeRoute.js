import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { fetchLikes, likeStatus, likeUnlikePost } from '../controllers/likeUnlikeController.js';

const likeUnlikeRouter = express.Router();

likeUnlikeRouter.post('/:id', authMiddleware, likeUnlikePost);
likeUnlikeRouter.get('/status/:id', authMiddleware, likeStatus);
likeUnlikeRouter.get('/fetchLikes/:id', authMiddleware, fetchLikes);

export default likeUnlikeRouter;
