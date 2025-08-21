"use client"

import { useState, useEffect } from "react";
import useUserStore from "@/stores/userStore.js";
import useSocket from "@/hooks/useSocket.js";
import { Bell } from "lucide-react";
import formatTimeAgo from '@/lib/formatTime';
import SenderUser from "./SenderUser";
import Link from "next/link";
import { notificationService } from "@/services/notificationService";
import playSound from "@/lib/webAudioAPI";

const Notifications = () => {
    const userId = useUserStore(state => state.user?._id);
    const token = useUserStore(state => state.token);
    const [notificationTab, setnotificationTab] = useState(false);
    const [notifications, setnotifications] = useState([]);
    const [notificationCount, setnotificationCount] = useState(0);
    const [loading, setloading] = useState(false);

    const getNotifications = async () => {
        setloading(true);
        try {
            const result = await notificationService.fetchNotifications(token);
            if (result.success) {
                setnotifications(result.notifications)
            }
        } catch (error) {
            console.log("Fetch notifications error:", error);
        } finally {
            setloading(false);
        }
    };

    const markRead = async () => {
        try {
            const result = await notificationService.markAllRead(token);
            if (result.success) {
                setnotificationCount(0);
            }
        } catch (error) {
            console.log("Mark as read notifications error:", error);
        }
    };

    const getInitialUnreadCount = async () => {
        try {
            const result = await notificationService.fetchUnreadCount(token);
            if (result.success) {
                setnotificationCount(result.count);
                console.log("unread notifications count:", result.count);
            }
        } catch (error) {
            console.log("Unread notifications count error:", error);
        }
    };

    useEffect(() => {
        if(!token) return;
        getNotifications();
        getInitialUnreadCount();
    }, [token]);

    const handleNotificationClick = async () => {
        if (!notificationTab && notificationCount > 0) {
            await markRead();
        }
        setnotificationTab(!notificationTab);
    };

    const handleIncoming = (notif) => {
        setnotifications(prev => [notif, ...prev])
        setnotificationCount((prevCount) => prevCount + 1)
        playSound("notification");
    }

    useSocket(userId, handleIncoming)

    if (loading) {
        return (
            <div className="absolute right-0 mt-2 min-w-[400px] min-h-96 bg-white rounded-lg shadow border p-3 text-gray-500 font-semibold z-50 flex items-center justify-center">
                Loading Notifications...
            </div>
        );
    }

    return (
        <div className="relative">
            <button className="relative mt-2">
                <Bell
                    className="text-gray-500 dark:text-gray-300 cursor-pointer"
                    onClick={handleNotificationClick}
                />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full px-1">
                        {notificationCount}
                    </span>
                )}
            </button>

            {/* dropdown */}
            {notificationTab && (
                notifications.length > 0 ? (
                    <div className="absolute right-0 mt-2 min-w-[400px] min-h-96 bg-white rounded-lg shadow border max-h-96 overflow-y-auto z-50">
                        {notifications.map((notification, i) => (
                            <Link
                                href={
                                    notification.type === "follow"
                                        ? `/profile/${notification.sender.username}`
                                        : `/post/${notification.postId}`
                                }
                                key={i}
                                className="flex items-center gap-1 px-3 py-2 border-b text-sm hover:bg-gray-100 w-full"
                                onClick={() => setnotificationTab(false)}
                            >
                                <span className="font-medium">
                                    <SenderUser user={notification.sender} />
                                </span>

                                <div className="flex items-center justify-between flex-1">
                                    <span>— {notification.message}</span>
                                    <span className="text-xs text-gray-500">
                                        {formatTimeAgo(notification.createdAt)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="absolute right-0 mt-2 min-w-[400px] min-h-96 bg-white rounded-lg shadow border p-3 text-gray-500 font-semibold z-50 flex items-center justify-center">
                        No Notifications to show
                    </div>
                )
            )}
        </div>
    )
}

export default Notifications