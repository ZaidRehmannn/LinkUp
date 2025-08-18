'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Check, Plus, UserCircle } from 'lucide-react'
import Image from 'next/image'
import About from '@/components/profile/About'
import Followers from '@/components/profile/Followers'
import Following from '@/components/profile/Following'
import Posts from '@/components/profile/Posts'
import { profileService } from '@/services/profileService'
import useUserStore from '@/stores/userStore'
import { Button } from '@/components/ui/button'

const page = () => {
    const params = useParams()
    const username = params?.username
    const [profileUser, setprofileUser] = useState(null);
    const [loading, setloading] = useState(true);
    const token = useUserStore(state => state.token);
    const user = useUserStore(state => state.user);
    const [isFollowing, setisFollowing] = useState(false);
    const [actionLoading, setactionLoading] = useState(false);

    const getProfileUserDetails = async () => {
        try {
            const result = await profileService.fetchDetails(username, token);
            setprofileUser(result.user);
        } catch (error) {
            console.error('Failed to load profile:', error);
            setprofileUser(null);
        } finally {
            setloading(false);
        }
    };

    const getProfileUserFollowStatus = async () => {
        try {
            const result = await profileService.followStatus(profileUser._id, token);
            setisFollowing(result.status);
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        }
    };

    const followUnfollowProfileUser = async () => {
        try {
            setactionLoading(true);
            await profileService.followUser(profileUser._id, token);
            setisFollowing(!isFollowing);
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        } finally {
            setactionLoading(false);
        }
    };

    // Fetch profile user
    useEffect(() => {
        if (!username || !token) return;
        getProfileUserDetails();
    }, [username, token]);

    // Once profile user is loaded, check follow status
    useEffect(() => {
        if (profileUser && user && user._id.toString() !== profileUser._id.toString()) {
            getProfileUserFollowStatus();
        }
    }, [profileUser, user]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-8rem)] pt-28 flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading profile...</p>
            </main>
        )
    }

    if (!profileUser) {
        return (
            <main className="min-h-[calc(100vh-8rem)] pt-28 flex justify-center items-center">
                <p className="text-red-600 font-bold text-xl">User not found!</p>
            </main>
        )
    }

    return (
        <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Side - Profile Section */}
                    <aside className="lg:w-80 lg:flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:sticky lg:top-24 lg:self-start">
                            {/* Profile Picture */}
                            <div className='w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mx-auto mb-6'>
                                {profileUser?.profilePic ? (
                                    <Image
                                        src={profileUser?.profilePic}
                                        alt="Profile"
                                        width={192}
                                        height={192}
                                        priority
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserCircle className="text-gray-500 dark:text-gray-400 w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44" />
                                )}
                            </div>

                            {/* Name and Username */}
                            <div className="text-center mb-6">
                                <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {profileUser?.firstName} {profileUser?.lastName}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                    @{profileUser?.username}
                                </p>
                            </div>

                            {/* Follow Unfollow Button */}
                            {user?._id.toString() !== profileUser?._id.toString() && (
                                <div className="flex justify-center">
                                    {isFollowing ? (
                                        <Button
                                            className="flex items-center gap-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white px-6 py-2 text-sm cursor-pointer"
                                            onClick={followUnfollowProfileUser}
                                            disabled={actionLoading}
                                        >
                                            <Check size={16} /> Following
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 text-white px-6 py-2 text-sm cursor-pointer"
                                            onClick={followUnfollowProfileUser}
                                            disabled={actionLoading}
                                        >
                                            Follow <Plus size={16} />
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right Side - Tabs Section */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <Tabs defaultValue="about" className="w-full">
                                {/* Tab Headers */}
                                <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
                                    <TabsList className="gap-2 md:gap-6 bg-transparent dark:bg-transparent">
                                        <TabsTrigger
                                            value="about"
                                            className="cursor-pointer text-sm md:text-base px-4 py-2 text-gray-600 dark:text-gray-300 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
                                        >
                                            About
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="posts"
                                            className="cursor-pointer text-sm md:text-base px-4 py-2 text-gray-600 dark:text-gray-300 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
                                        >
                                            Posts
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="followers"
                                            className="cursor-pointer text-sm md:text-base px-4 py-2 text-gray-600 dark:text-gray-300 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
                                        >
                                            Followers
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="following"
                                            className="cursor-pointer text-sm md:text-base px-4 py-2 text-gray-600 dark:text-gray-300 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400"
                                        >
                                            Following
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                {/* Tab Contents with Max Height and Scroll */}
                                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                                    <TabsContent value="about" className="mt-0 p-6">
                                        <About profileUser={profileUser} />
                                    </TabsContent>

                                    <TabsContent value="posts" className="mt-0 p-6">
                                        <Posts username={username} token={token} />
                                    </TabsContent>

                                    <TabsContent value="followers" className="mt-0 p-6">
                                        <Followers username={username} token={token} />
                                    </TabsContent>

                                    <TabsContent value="following" className="mt-0 p-6">
                                        <Following username={username} token={token} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default page