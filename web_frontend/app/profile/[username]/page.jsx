'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from '@/lib/axios'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const page = () => {
    const { username } = useParams()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/profile/${username}`);
                setUser(response.data.user)
            } catch (err) {
                console.error('Failed to load profile:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [username])

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading profile...</p>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-red-600 font-bold text-xl">User not found</p>
            </main>
        )
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <section className="flex items-center gap-6">
                <img
                    src={user.profilePic || '/default-avatar.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-blue-600"
                />
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">{user.firstName} {user.lastName}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                </div>
            </section>

            {/* Tabs */}
            <section className="mt-8">
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="gap-4">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-6">
                        <p className="text-gray-700 whitespace-pre-line">{user.bio || "No bio yet."}</p>
                    </TabsContent>

                    <TabsContent value="posts" className="mt-6">
                        <p>All posts will go here...</p>
                    </TabsContent>

                    <TabsContent value="followers" className="mt-6">
                        <p>List of followers will go here...</p>
                    </TabsContent>

                    <TabsContent value="following" className="mt-6">
                        <p>List of following will go here...</p>
                    </TabsContent>
                </Tabs>
            </section>
        </main>
    )
}

export default page
