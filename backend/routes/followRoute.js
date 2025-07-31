import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { followUnfollowUser, getFollowers, getFollowing, getFollowStatus } from '../controllers/followController.js';

const followRouter = express.Router();

followRouter.put("/:id", authMiddleware, followUnfollowUser);
followRouter.get("/followers/:username", authMiddleware, getFollowers);
followRouter.get("/following/:username", authMiddleware, getFollowing);
followRouter.get("/is-following/:id", authMiddleware, getFollowStatus);

export default followRouter;
