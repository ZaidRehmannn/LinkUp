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
    }
};