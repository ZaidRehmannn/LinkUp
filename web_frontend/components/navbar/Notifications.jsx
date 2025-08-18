"use client"

import { useState, useCallback } from "react"
import useUserStore from "@/stores/userStore.js"
import useSocket from "@/hooks/useSocket.js"
import { Bell } from "lucide-react"

const Notifications = () => {
    const userId = useUserStore(state => state.user?._id);
    const [notificationTab, setnotificationTab] = useState(false);
    const [notifications, setnotifications] = useState([]);

    const handleIncoming = useCallback((notif) => {
        setnotifications(prev => [notif, ...prev])
        // TODO: play a sound or show a toast if you want
    }, [])

    useSocket(userId, handleIncoming)

    return (
        <div className="relative">
            <button className="relative mt-2">
                <Bell className="text-gray-500 dark:text-gray-300 cursor-pointer" onClick={() => setnotificationTab(!notificationTab)} />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full px-1">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* dropdown */}
            {notificationTab && (
                notifications.length > 0 ? (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow border max-h-96 overflow-y-auto z-50">
                        {notifications.map((notification, i) => (
                            <div key={i} className="px-3 py-2 border-b text-sm">
                                <span className="font-medium">{notification.type}</span> — {notification.message}
                                <div className="text-xs text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow border p-3 text-sm text-gray-500 z-50">
                        No Notifications to show
                    </div>
                )
            )}
        </div>
    )
}

export default Notifications
