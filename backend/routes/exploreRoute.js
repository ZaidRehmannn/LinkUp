import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { fetchExploreUsers } from '../controllers/exploreController.js';

const exploreRouter = express.Router();

exploreRouter.get('/fetch', authMiddleware, fetchExploreUsers);

export default exploreRouter;
