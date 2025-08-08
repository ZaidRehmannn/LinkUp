import axios from '@/lib/axios'

export const commentService = {
    async addComment(postId, commentText, token) {
        const response = await axios.post(`/api/comment/create/${postId}`, commentText, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    },

    async fetchPostComments(postId, token){
        const response = await axios.get(`/api/comment/fetch/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
};