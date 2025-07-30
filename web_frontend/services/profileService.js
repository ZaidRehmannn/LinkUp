import axios from '@/lib/axios'

export const profileService = {
    async fetchDetails(username, token) {
        const response = await axios.get(`/api/profile/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    },

    async fetchFollowers(username, token) {
        const response = await axios.get(`/api/follow/followers/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    },

    async fetchFollowing(username, token) {
        const response = await axios.get(`/api/follow/following/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }
};