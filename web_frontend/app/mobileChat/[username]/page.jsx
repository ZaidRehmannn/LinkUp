'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { profileService } from '@/services/profileService';
import useUserStore from '@/stores/userStore';
import OpenChatWindow from '@/components/feed/rightSidebar/chatBox/OpenChatWindow';

const page = () => {
    const token = useUserStore(state => state.token);
    const params = useParams();
    const { username } = params;
    const [user, setuser] = useState(null);

    const fetchUser = async () => {
        const result = await profileService.fetchDetails(username, token);
        if (result.success) {
            setuser(result.user);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchUser();
    }, [token])

    return (
        <main className="h-[calc(100vh-8rem)] mt-20 w-11/12 mx-auto flex flex-col bg-gray-100 dark:bg-gray-900 rounded-md">
            {user && (
                <OpenChatWindow user={user} mobile={true} />
            )}
        </main>
    )
}

export default page
