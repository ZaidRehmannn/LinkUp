import axios from '@/lib/axios'

export const profileSettingsService = {
    async updateProfileDetails(profileData, token) {
        const response = await axios.put('/api/profile/update-profile-details', profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        return response.data;
    },

    async uploadProfilePicture(imageFile, token) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axios.put('/api/profile/upload-profile-pic', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async removeProfilePicture(token) {
        const response = await axios.put('/api/profile/remove-profile-pic', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async changePassword(passwordData, token) {
        const response = await axios.put('/api/profile/change-password', passwordData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        return response.data;
    }
};