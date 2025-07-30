import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { followUnfollowUser, getFollowers, getFollowing } from '../controllers/followController.js';

const followRouter = express.Router();

followRouter.put("/follow/:id", authMiddleware, followUnfollowUser);
followRouter.get("/followers/:username", authMiddleware, getFollowers);
followRouter.get("/following/:username", authMiddleware, getFollowing);

export default followRouter;
