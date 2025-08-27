import axios from '@/lib/axios'

export const commentService = {
    async addComment(postId, text, token) {
        const response = await axios.post(`/api/comment/create/${postId}`, { text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    },

    async fetchPostComments(postId, token, skip, limit) {
        const response = await axios.get(`/api/comment/fetch/${postId}?skip=${skip}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    },

    async deleteComment(postId, commentId, token) {
        const response = await axios.delete(`/api/comment/${postId}/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async editComment(commentId, text, token) {
        const response = await axios.put(`/api/comment/edit/${commentId}`, { text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};