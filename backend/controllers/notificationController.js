import notificationModel from "../models/notificationModel.js";

// fetch the notifications of the user
const fetchNotifications = async (req, res) => {
    const userId = req.userId;
    try {
        const notifications = await notificationModel.find({ receiver: userId })
            .populate("sender", "_id firstName lastName profilePic username")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// mark all notifications as read
const markAllAsRead = async (req, res) => {
    const userId = req.userId;
    try {
        await notificationModel.updateMany({ receiver: userId }, { isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Mark as Read notifications error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// fetch the unread notifications count for initial render
const getUnreadNotificationsCount = async (req, res) => {
    const userId = req.userId;
    try {
        const notificationCount = await notificationModel.countDocuments({ receiver: userId, isRead: false });
        res.status(200).json({ success: true, count: notificationCount });
    } catch (error) {
        console.error("Mark as Read notifications error:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { fetchNotifications, markAllAsRead, getUnreadNotificationsCount };
