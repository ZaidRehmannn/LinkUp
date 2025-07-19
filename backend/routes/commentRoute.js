import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createComment, getCommentsByPost } from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.post('/:postId', authMiddleware, createComment);
commentRouter.get('/:postId', getCommentsByPost);

export default commentRouter;
