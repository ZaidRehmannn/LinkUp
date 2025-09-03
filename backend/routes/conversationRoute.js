import express from "express";
import authMiddleware from '../middleware/auth.js';
import { checkUnreadConversation, getConversations, markConversationAsRead } from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.get("/fetchAll", authMiddleware, getConversations);
conversationRouter.put('/read/:senderId', authMiddleware, markConversationAsRead);
conversationRouter.get("/checkUnread", authMiddleware, checkUnreadConversation);

export default conversationRouter;
