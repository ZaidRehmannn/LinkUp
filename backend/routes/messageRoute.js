import express from "express";
import authMiddleware from '../middleware/auth.js';
import { sendMessage, getMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send", authMiddleware, sendMessage);
messageRouter.get("/:receiverId", authMiddleware, getMessages);

export default messageRouter;
