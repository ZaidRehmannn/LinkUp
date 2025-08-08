import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createComment, getCommentsByPost } from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.post('/create/:postId', authMiddleware, createComment);
commentRouter.get('/fetch/:postId', authMiddleware, getCommentsByPost);

export default commentRouter;
