import axios from '@/lib/axios'

export const postService = {
    async createPost(content, mediaFile, token) {
        const formData = new FormData();
        if (content) formData.append("content", content);
        if (mediaFile) formData.append("media", mediaFile);

        const response = await axios.post('/api/post/create', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async fetchPosts(token, skip, limit) {
        const response = await axios.get(`/api/posts/fetch-posts?skip=${skip}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async fetchUserPosts(username, token, skip, limit) {
        const response = await axios.get(`/api/post/fetch-userPosts/${username}?skip=${skip}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async deletePost(postId, token) {
        const response = await axios.delete(`/api/post/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async editPost(postId, content, mediaFile, removeMedia, token) {
        const formData = new FormData();
        if (content) formData.append("content", content);
        if (mediaFile) formData.append("media", mediaFile);
        formData.append("removeMedia", removeMedia);

        const response = await axios.put(`/api/post/edit/${postId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async fetchPostById(postId, token) {
        const response = await axios.get(`/api/post/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;      
    }
};