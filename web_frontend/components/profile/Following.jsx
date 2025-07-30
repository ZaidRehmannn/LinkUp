'use client'

import React, { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { profileService } from '@/services/profileService'
import useUserStore from '@/stores/userStore'

const Following = ({ username }) => {
    const [following, setfollowing] = useState([]);
    const [loading, setloading] = useState(true);
    const token = useUserStore(state => state.token);

    useEffect(() => {
        const getUserFollowing = async () => {
            try {
                const result = await profileService.fetchFollowing(username, token);
                setfollowing(result.following);
            } catch (error) {
                console.error('Failed to load following:', error);
                setfollowing([]);
            } finally {
                setloading(false);
            }
        };

        getUserFollowing();
    }, [username, token]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading following...</p>
            </main>
        )
    }

    if (following.length === 0) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-gray-600 text-lg">No following yet.</p>
            </main>
        )
    }

    return (
        <main className="grid gap-4 max-w-xl mx-auto">
            {following.map(follow => (
                <Link key={follow.username} href={`/profile/${follow.username}`}>
                    <div className="flex items-center gap-4 border rounded-xl p-4 bg-white hover:bg-gray-50 shadow-sm transition">
                        {follow.profilePic ? (
                            <Image
                                src={follow.profilePic}
                                alt={follow.username}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-12 h-12"
                            />
                        ) : (
                            <UserCircle className="w-12 h-12 text-gray-400" />
                        )}

                        <div>
                            <p className="font-medium text-base">
                                {follow.firstName} {follow.lastName}
                            </p>
                            <p className="text-gray-500 text-sm">@{follow.username}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    )
}

export default Following
