'use client'

import React, { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { profileService } from '@/services/profileService'

const Followers = ({ username, token }) => {
    const [followers, setfollowers] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const getUserFollowers = async () => {
            try {
                const result = await profileService.fetchFollowers(username, token);
                setfollowers(result.followers);
            } catch (error) {
                console.error('Failed to load followers:', error);
                setfollowers([]);
            } finally {
                setloading(false);
            }
        };

        getUserFollowers();
    }, [username, token])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-blue-600 dark:text-blue-400 font-bold text-xl">Loading followers...</p>
            </div>
        )
    }

    if (followers.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No followers yet.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="space-y-3">
                {followers.map(follower => (
                    <Link key={follower.username} href={`/profile/${follower.username}`}>
                        <div className="flex items-center gap-4 border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition-colors duration-200 w-full">
                            {follower.profilePic ? (
                                <Image
                                    src={follower.profilePic}
                                    alt={follower.username}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover w-12 h-12 flex-shrink-0"
                                />
                            ) : (
                                <UserCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            )}
                            
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="font-medium text-base text-gray-900 dark:text-gray-100 truncate">
                                    {follower.firstName} {follower.lastName}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">@{follower.username}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Followers