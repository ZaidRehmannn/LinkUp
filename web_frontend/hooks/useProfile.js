import { useState, useEffect } from "react";
import useUserStore from '../stores/userStore'
import { useParams } from "next/navigation";

export const useProfileMain = () => {
    const params = useParams()
    const username = params?.username
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    const token = useUserStore(state => state.token)

    useEffect(() => {
        if (!username || !token) return;

        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setuser(response.data.user);
            } catch (error) {
                console.error('Failed to load profile:', error);
                setuser(null);
            } finally {
                setloading(false);
            }
        };

        fetchUser();
    }, [username, token]);

    return{
        user,
        setuser,
        loading,
        setloading,
        token
    }
};