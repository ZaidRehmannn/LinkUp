import express from "express";
import authMiddleware from '../middleware/auth.js';
import { getConversations } from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.get("/fetchAll", authMiddleware, getConversations);

export default conversationRouter;
