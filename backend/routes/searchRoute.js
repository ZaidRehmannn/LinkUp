import express from "express";
import authMiddleware from '../middleware/auth.js';
import { searchChats, searchUsers } from "../controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/", authMiddleware, searchUsers);
searchRouter.get("/chats", authMiddleware, searchChats);

export default searchRouter;
