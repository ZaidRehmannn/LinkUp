'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import About from '@/components/profile/About'
import Followers from '@/components/profile/Followers'
import Following from '@/components/profile/Following'
import Posts from '@/components/profile/Posts'
import { profileService } from '@/services/profileService'
import useUserStore from '@/stores/userStore'

const page = () => {
    const params = useParams()
    const username = params?.username
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);
    const token = useUserStore(state => state.token);

    useEffect(() => {
        if (!username || !token) return;

        const getUserDetails = async () => {
            try {
                const result = await profileService.fetchDetails(username, token);
                setuser(result.user);
            } catch (error) {
                console.error('Failed to load profile:', error);
                setuser(null);
            } finally {
                setloading(false);
            }
        };

        getUserDetails();
    }, [username, token]);

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
                <p className="text-red-600 font-bold text-xl">User not found!</p>
            </main>
        )
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <section className="flex items-center justify-center md:justify-start gap-4 lg:gap-6">
                {/* Profile Picture */}
                <div className='w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                    {user.profilePic ? (
                        <Image src={user.profilePic} alt="Profile" width={176} height={176} />
                    ) : (
                        <UserCircle className="text-gray-500 w-40 h-40" />
                    )}
                </div>

                {/* Name and Username */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-600">{user.firstName} {user.lastName}</h1>
                    <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
                </div>
            </section>

            {/* Tabs */}
            <section className="mt-8">
                <Tabs defaultValue="about" className="w-full flex justify-center items-center md:block">
                    <TabsList className="gap-6">
                        <TabsTrigger value="about" className="cursor-pointer">About</TabsTrigger>
                        <TabsTrigger value="posts" className="cursor-pointer">Posts</TabsTrigger>
                        <TabsTrigger value="followers" className="cursor-pointer">Followers</TabsTrigger>
                        <TabsTrigger value="following" className="cursor-pointer">Following</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-6">
                        <About user={user} />
                    </TabsContent>

                    <TabsContent value="posts" className="mt-6">
                        <Posts />
                    </TabsContent>

                    <TabsContent value="followers" className="mt-6">
                        <Followers username={username} />
                    </TabsContent>

                    <TabsContent value="following" className="mt-6">
                        <Following username={username} />
                    </TabsContent>
                </Tabs>
            </section>
        </main>
    )
}

export default page
