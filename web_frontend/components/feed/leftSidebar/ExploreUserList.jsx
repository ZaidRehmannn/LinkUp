'use client'

import useUserStore from '@/stores/userStore';
import React, { useEffect, useState } from 'react'
import ExploreUserCard from './ExploreUserCard';
import axios from '@/lib/axios';

const ExploreUserList = () => {
    const token = useUserStore(state => state.token);
    const [exploreUsers, setexploreUsers] = useState([]);
    const [loading, setloading] = useState(false);

    const fetchExploreUsers = async () => {
        setloading(true);
        try {
            const response = await axios.get('/api/explore/fetch', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setexploreUsers(response.data.users)
            }
        } catch (error) {
            console.error('fetching explore users error:', error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        if (!token) return
        fetchExploreUsers();
    }, [token])

    return (
        <div className='bg-gray-200 dark:bg-gray-300 rounded-md border-2 h-full p-2'>
            <p className='font-semibold text-blue-700 text-lg'>Explore New People</p>

            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-blue-600 font-semibold">Loading...</p>
                </div>
            ) : exploreUsers.length > 0 ? (
                <ul className='space-y-3 mt-2'>
                    {exploreUsers.map((user) => (
                        <li key={user._id}>
                            <ExploreUserCard user={user} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 font-semibold">No People to Show...</p>
                </div>
            )}
        </div>
    )
}

export default ExploreUserList
