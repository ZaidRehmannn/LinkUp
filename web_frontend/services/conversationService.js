import axios from '@/lib/axios'

export const conversationService = {
    async fetchConversations(token) {
        const response = await axios.get('/api/conversation/fetchAll', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async markAsRead(senderId, token) {
        const response = await axios.put(`/api/conversation/read/${senderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};