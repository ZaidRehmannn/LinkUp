'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams } from 'next/navigation'
import useUserStore from '@/stores/userStore'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Following = () => {
    const params = useParams()
    const username = params?.username
    const [following, setfollowing] = useState([]);
    const [loading, setloading] = useState(true);
    const token = useUserStore(state => state.token)

    const fetchFollowing = async () => {
        try {
            const response = await axios.get(`/api/follow/following/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setfollowing(response.data.following);
        } catch (error) {
            console.error('Failed to load following:', error);
            setfollowing([]);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchFollowing();
    }, [username, token])

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
                <Link href={`/profile/${follow.username}`}>
                    <div
                        key={follow.username}
                        className="flex items-center justify-between border rounded-xl p-4 bg-white hover:bg-gray-500 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            {follow.profilePic ? (
                                <Image
                                    src={follow.profilePic}
                                    alt={follow.username}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <UserCircle className="w-12 h-12 text-gray-400" />
                            )}
                            <p className="font-medium">@{follow.username}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    )
}

export default Following
