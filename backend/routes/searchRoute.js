import express from "express";
import authMiddleware from '../middleware/auth.js';
import { searchUsers } from "../controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/", authMiddleware, searchUsers);

export default searchRouter;
