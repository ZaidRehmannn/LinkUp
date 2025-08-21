import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { fetchNotifications, getUnreadNotificationsCount, markAllAsRead } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/fetch', authMiddleware, fetchNotifications);
notificationRouter.patch('/mark-read', authMiddleware, markAllAsRead);
notificationRouter.get('/unread-count', authMiddleware, getUnreadNotificationsCount);

export default notificationRouter;
