import axios from '@/lib/axios'

export const likePostService = {
    async like_unlikePost(postId, token) {
        const response = await axios.post(`/api/like/${postId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    },

    async fetchLikeStatus(postId, token) {
        const response = await axios.get(`/api/like/status/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
};