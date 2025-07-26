'use client'

import React, { useEffect, useState } from 'react'
import { Pencil, UserCircle } from 'lucide-react'
import Image from 'next/image'
import useUserStore from '../stores/userStore'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const Page = () => {
    const user = useUserStore(state => state.user);
    const [isUserReady, setisUserReady] = useState(false);
    const [isEditing, setisEditing] = useState(false);
    const [showPasswordFields, setshowPasswordFields] = useState(false);
    const [passwords, setpasswords] = useState({
        oldPassword: "",
        newPassword: ""
    });
    const [picturePreview, setpicturePreview] = useState(null);

    const handlePasswordChange = (e) => {
        setpasswords({ ...passwords, [e.target.name]: e.target.value })
    };

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        bio: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setpicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                bio: user.bio || "",
            });
            setisUserReady(true);
        }
    }, [user])

    if (!isUserReady) {
        return (
            <main className="min-h-[calc(100vh-8rem)] flex justify-center items-center">
                <p className="text-blue-600 font-bold text-xl">Loading profile...</p>
            </main>
        );
    }

    return (
        <main className="px-6 md:px-20 py-10 max-w-8xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Profile Settings</h1>

            <div className="flex flex-col md:flex-row gap-14">
                {/* Profile Picture Section */}
                <section className="flex flex-col items-center gap-6">
                    <div className="w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.profilePic ? (
                            <Image src={user.profilePic} alt="Profile" width={176} height={176} />
                        ) : picturePreview ? (
                            <Image src={picturePreview} alt="Profile" width={176} height={176} />
                        ) : (
                            <UserCircle className="text-gray-500 w-40 h-40" />
                        )}
                    </div>

                    {user.profilePic ? (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="profile-picture" className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2 rounded-lg'>
                                Change Picture
                            </label>
                            <input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <Button variant="destructive">Delete Picture</Button>
                        </div>
                    ) : picturePreview ? (
                        <Button variant="default" className="bg-green-600 hover:bg-green-700 cursor-pointer text-white">Save Picture</Button>
                    ) : (
                        <div>
                            <label htmlFor="profile-picture" className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2 rounded-lg'>
                                Upload Picture
                            </label>
                            <input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </section>

                {/* Details Section */}
                <section className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 w-full">
                            <span className="font-semibold text-nowrap">First Name: </span>
                            {!isEditing ? (
                                <span>{form.firstName}</span>
                            ) : (
                                <Input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full">
                            <span className="font-semibold text-nowrap">Last Name: </span>
                            {!isEditing ? (
                                <span>{form.lastName}</span>
                            ) : (
                                <Input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full">
                            <span className='font-semibold'>Username: </span>
                            {!isEditing ? (
                                <span>{form.username}</span>
                            ) : (
                                <Input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full">
                            <span className='font-semibold'>Email: </span>
                            {!isEditing ? (
                                <span>{form.email}</span>
                            ) : (
                                <Input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <span className='font-semibold'>Bio: </span>
                        {!isEditing ? (
                            <span>{form.bio ? form.bio : "No Bio Added"}</span>
                        ) : (
                            <Textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Add a bio..."
                                className="bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                            />
                        )}
                    </div>

                    {!isEditing ? (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-2" onClick={() => setisEditing(true)}>
                            <Pencil /> Edit Profile
                        </Button>
                    ) : (
                        <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={() => setisEditing(false)}>
                            Save Changes
                        </Button>
                    )}

                    {!showPasswordFields ? (
                        <Button className="block bg-blue-600 hover:bg-blue-700 cursor-pointer text-white" onClick={() => setshowPasswordFields(true)}>
                            Change Password
                        </Button>
                    ) : (
                        <>
                            <div className="flex items-center gap-5 w-full">
                                <div className="flex items-center gap-2">
                                    <span className='font-semibold text-nowrap'>Old Password: </span>
                                    <Input
                                        type="password"
                                        name="oldPassword"
                                        value={passwords.oldPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Old Password"
                                        className="bg-gray-100 text-gray-700 w-full focus-visible:ring-2 focus-visible:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className='font-semibold text-nowrap'>New Password: </span>
                                    <Input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="New Password"
                                        className="bg-gray-100 text-gray-700 w-full focus-visible:ring-2 focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <Button className="block bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={() => { setshowPasswordFields(false) }}>
                                Save Password
                            </Button>
                        </>
                    )}

                    <div className="flex gap-10 mt-4 font-semibold">
                        <span>Followers: {user.followers?.length ? user.followers?.length : 0}</span>
                        <span>Following: {user.following?.length ? user.following?.length : 0}</span>
                        <span>Account Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </section>
            </div >
        </main >
    )
}

export default Page
