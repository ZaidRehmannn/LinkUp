import express from "express";
import authMiddleware from '../middleware/auth.js';
import { getConversations, markConversationAsRead } from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.get("/fetchAll", authMiddleware, getConversations);
conversationRouter.put('/read/:senderId', authMiddleware, markConversationAsRead);

export default conversationRouter;
