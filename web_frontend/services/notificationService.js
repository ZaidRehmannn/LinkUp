import axios from '@/lib/axios'

export const notificationService = {
    async fetchNotifications(token) {
        const response = await axios.get('/api/notifications/fetch', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async markAllRead(token) {
        const response = await axios.patch('/api/notifications/mark-read', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async fetchUnreadCount(token) {
        const response = await axios.get('/api/notifications/unread-count', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};