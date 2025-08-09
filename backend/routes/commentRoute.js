import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createComment, deleteComment, editComment, getCommentsByPost } from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.post('/create/:postId', authMiddleware, createComment);
commentRouter.get('/fetch/:postId', authMiddleware, getCommentsByPost);
commentRouter.delete('/:postId/:commentId', authMiddleware, deleteComment);
commentRouter.put('/edit/:commentId', authMiddleware, editComment);

export default commentRouter;
