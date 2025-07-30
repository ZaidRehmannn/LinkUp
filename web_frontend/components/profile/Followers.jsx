'use client'

import React, { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { profileService } from '@/services/profileService'
import useUserStore from '@/stores/userStore'

const Followers = ({ username }) => {
    const [followers, setfollowers] = useState([]);
    const [loading, setloading] = useState(true);
    const token = useUserStore(state => state.token);

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
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading followers...</p>
            </main>
        )
    }

    if (followers.length === 0) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-gray-600 text-lg">No followers yet.</p>
            </main>
        )
    }

    return (
        <main className="grid gap-4 max-w-xl mx-auto">
            {followers.map(follower => (
                <Link key={follower.username} href={`/profile/${follower.username}`}>
                    <div className="flex items-center gap-4 border rounded-xl p-4 bg-white hover:bg-gray-50 shadow-sm transition">
                        {follower.profilePic ? (
                            <Image
                                src={follower.profilePic}
                                alt={follower.username}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-12 h-12"
                            />
                        ) : (
                            <UserCircle className="w-12 h-12 text-gray-400" />
                        )}

                        <div>
                            <p className="font-medium text-base">
                                {follower.firstName} {follower.lastName}
                            </p>
                            <p className="text-gray-500 text-sm">@{follower.username}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    )
}

export default Followers
