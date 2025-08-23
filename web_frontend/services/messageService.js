import axios from '@/lib/axios'

export const messageService = {
    async fetchMessages(receiverId, token) {
        const response = await axios.get(`/api/message/${receiverId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async sendNewMessage(receiverId, text, token) {
        const response = await axios.post('/api/message/send', { receiverId, text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};