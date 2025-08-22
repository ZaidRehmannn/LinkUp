import axios from '@/lib/axios'

export const searchService = {
    async searchUsers(query, token) {
        const response = await axios.get(`/api/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async searchChats(query, token) {
        const response = await axios.get(`/api/search/chats?q=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
}