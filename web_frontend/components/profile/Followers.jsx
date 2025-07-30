'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams } from 'next/navigation'
import useUserStore from '@/stores/userStore'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Followers = () => {
    const params = useParams()
    const username = params?.username
    const [followers, setfollowers] = useState([]);
    const [loading, setloading] = useState(true);
    const token = useUserStore(state => state.token)

    const fetchFollowers = async () => {
        try {
            const response = await axios.get(`/api/follow/followers/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setfollowers(response.data.followers);
        } catch (error) {
            console.error('Failed to load followers:', error);
            setfollowers([]);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchFollowers();
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
                <Link href={`/profile/${follower.username}`}>
                    <div
                        key={follower.username}
                        className="flex items-center justify-between border rounded-xl p-4 bg-white hover:bg-gray-500 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            {follower.profilePic ? (
                                <Image
                                    src={follower.profilePic}
                                    alt={follower.username}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <UserCircle className="w-12 h-12 text-gray-400" />
                            )}
                            <p className="font-medium">@{follower.username}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    )
}

export default Followers
