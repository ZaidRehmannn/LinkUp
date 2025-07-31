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
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading profile...</p>
            </main>
        )
    }

    if (!profileUser) {
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
                    {profileUser?.profilePic ? (
                        <Image src={profileUser?.profilePic} alt="Profile" width={176} height={176} priority />
                    ) : (
                        <UserCircle className="text-gray-500 w-40 h-40" />
                    )}
                </div>

                <div className='flex flex-col gap-5'>
                    {/* Name and Username */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-600">{profileUser?.firstName} {profileUser.lastName}</h1>
                        <p className="text-gray-600 dark:text-gray-300">@{profileUser?.username}</p>
                    </div>

                    {/* Follow Unfollow Button */}
                    {user?._id.toString() !== profileUser?._id.toString() && (
                        isFollowing ? (
                            <Button
                                className="flex items-center bg-gray-300 hover:bg-gray-400 text-black w-fit px-4 py-2 cursor-pointer"
                                onClick={followUnfollowProfileUser}
                                disabled={actionLoading}
                            >
                                <Check size={18} /> Following
                            </Button>
                        ) : (
                            <Button
                                className="flex items-center bg-blue-600 hover:bg-blue-800 text-white w-fit px-4 py-2 cursor-pointer"
                                onClick={followUnfollowProfileUser}
                                disabled={actionLoading}
                            >
                                Follow <Plus size={18} />
                            </Button>
                        )
                    )}
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
                        <About profileUser={profileUser} />
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
        </main >
    )
}

export default page
