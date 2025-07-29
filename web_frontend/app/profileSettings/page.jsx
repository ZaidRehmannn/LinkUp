'use client'

import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, UserCircle } from 'lucide-react'
import Image from 'next/image'
import useUserStore from '../stores/userStore'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from '@/lib/axios'
import { EyeOff, Eye } from 'lucide-react'

const Page = () => {
    const user = useUserStore(state => state.user);
    const token = useUserStore(state => state.token);
    const setUser = useUserStore(state => state.setUser);

    const [isUserReady, setisUserReady] = useState(false);
    const [isEditing, setisEditing] = useState(false);

    const [showPasswordFields, setshowPasswordFields] = useState(false);
    const [passwords, setpasswords] = useState({
        oldPassword: "",
        newPassword: ""
    });

    const [passwordVisibility, setpasswordVisibility] = useState({
        oldPassword: false,
        newPassword: false
    });

    const [picturePreview, setpicturePreview] = useState(null);

    const [successMessage, setsuccessMessage] = useState({
        picture: null,
        details: null,
        password: null
    });
    const [errorMessage, seterrorMessage] = useState({
        picture: null,
        details: null,
        password: null
    });

    const handlePasswordChange = (e) => {
        setpasswords({ ...passwords, [e.target.name]: e.target.value })
    };

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        bio: "",
        image: null
    });
    const [accountDate, setaccountDate] = useState(null);

    const togglePasswordVisibility = (field) => {
        setpasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file })
            const reader = new FileReader();
            reader.onload = () => {
                setpicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitProfileDetails = async () => {
        setsuccessMessage({ ...successMessage, details: "" });
        seterrorMessage({ ...errorMessage, details: "" });

        if (!form.firstName || !form.lastName || !form.username || !form.email) {
            seterrorMessage({ ...errorMessage, details: "All fields are required except bio!" });
            return
        }

        try {
            const response = await axios.put('/api/profile/update-profile-details',
                {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    username: form.username,
                    email: form.email,
                    bio: form.bio,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                setForm({
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    bio: updatedUser.bio,
                });

                setsuccessMessage({ ...successMessage, details: response.data.message });
                setisEditing(false);
            } else {
                seterrorMessage({ ...errorMessage, details: response.data.message });
            }
        } catch (error) {
            console.error("Profile Details Error: ", error);
        }
    };

    const submitProfilePicture = async () => {
        setsuccessMessage({ ...successMessage, picture: "" });
        seterrorMessage({ ...errorMessage, picture: "" });

        if (form.image) {
            const formData = new FormData();
            formData.append("image", form.image);

            try {
                const response = await axios.put('/api/profile/upload-profile-pic', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    const updatedUser = response.data.user;
                    setUser(updatedUser);
                    setForm(prev => ({ ...prev, image: updatedUser.profilePic }));

                    setpicturePreview(null);
                    setsuccessMessage({ ...successMessage, picture: response.data.message });
                } else {
                    seterrorMessage({ ...errorMessage, picture: response.data.message });
                }
            } catch (error) {
                console.error("Profile Picture Error: ", error);
            }
        }
    };

    const handlePictureRemove = async () => {
        setsuccessMessage({ ...successMessage, picture: "" });
        seterrorMessage({ ...errorMessage, picture: "" });

        try {
            const response = await axios.put('/api/profile/remove-profile-pic', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                setForm(prev => ({ ...prev, image: null }));

                setsuccessMessage({ ...successMessage, picture: response.data.message });
            } else {
                seterrorMessage({ ...errorMessage, picture: response.data.message });
            }
        } catch (error) {
            console.error("Profile Picture Error: ", error);
        }
    };

    const submitNewPassword = async () => {
        setsuccessMessage({ ...successMessage, password: "" });
        seterrorMessage({ ...errorMessage, password: "" });

        if (!passwords.oldPassword || !passwords.newPassword) {
            seterrorMessage({ ...errorMessage, password: "All fields are required!" });
            return
        }

        try {
            const response = await axios.put('/api/profile/change-password',
                {
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setsuccessMessage({ ...successMessage, password: response.data.message });
                setshowPasswordFields(false)
                setpasswords({
                    oldPassword: "",
                    newPassword: ""
                })
            }
        } catch (error) {
            console.error("Change Password Error: ", error);

            if (error.response && error.response.data && error.response.data.message) {
                seterrorMessage({ ...errorMessage, password: error.response.data.message });
            } else {
                seterrorMessage({ ...errorMessage, password: "Something went wrong." });
            }
        }
    };

    useEffect(() => {
        if(!user) return;

        setForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
            bio: user?.bio ?? "",
            image: user?.profilePic ?? null,
        });

        setaccountDate(user?.createdAt || null);
        setisUserReady(true);

    }, [user]);

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

            <div className="flex flex-col lg:flex-row gap-14">
                {/* Profile Picture Section */}
                <section className="flex flex-col items-center gap-6">
                    <div className="w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {picturePreview && typeof picturePreview === 'string' ? (
                            <Image src={picturePreview} alt="Profile" width={176} height={176} />
                        ) : form.image && typeof form.image === 'string' ? (
                            <Image src={form.image} alt="Profile" width={176} height={176} />
                        ) : (
                            <UserCircle className="text-gray-500 w-40 h-40" />
                        )}
                    </div>

                    {successMessage.picture && (
                        <p className='text-green-600 font-semibold'>{successMessage.picture}</p>
                    )}
                    {errorMessage.picture && (
                        <p className='text-red-600 font-semibold'>{errorMessage.picture}</p>
                    )}

                    {picturePreview ? (
                        <div className='flex flex-col gap-3'>
                            <Button variant="default" className="bg-green-600 hover:bg-green-700 cursor-pointer text-white" onClick={submitProfilePicture}>
                                Save New Picture
                            </Button>

                            <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={() => setpicturePreview(null)}>
                                Cancel
                            </Button>
                        </div>
                    ) : user?.profilePic ? (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="change-profile-picture" className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2 rounded-lg'>
                                Change Picture
                            </label>
                            <input
                                id="change-profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <Button variant="destructive" className="dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-700 cursor-pointer flex items-center" onClick={handlePictureRemove}>
                                <Trash2 /> Remove Picture
                            </Button>
                        </div>
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
                                    className="bg-gray-100 dark:bg-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-800 dark:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                                    required
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
                                    className="bg-gray-100 dark:bg-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-800 dark:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                                    required
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
                                    className="bg-gray-100 dark:bg-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-800 dark:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                                    required
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
                                    className="bg-gray-100 dark:bg-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-800 dark:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <span className='font-semibold'>Bio: </span>
                        {!isEditing ? (
                            <span>{form.bio?.trim() ? form.bio : "No Bio Added"}</span>
                        ) : (
                            <Textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Add a bio..."
                                className="bg-gray-100 dark:bg-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-800 dark:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                            />
                        )}
                    </div>

                    {successMessage.details && (
                        <p className='text-green-600 font-semibold'>{successMessage.details}</p>
                    )}
                    {errorMessage.details && (
                        <p className='text-red-600 font-semibold'>{errorMessage.details}</p>
                    )}

                    {!isEditing ? (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-2" onClick={() => setisEditing(true)}>
                            <Pencil /> Edit Profile
                        </Button>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={submitProfileDetails}>
                                Save Changes
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={() => setisEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    )}

                    {!showPasswordFields ? (
                        <Button className="block bg-blue-600 hover:bg-blue-700 cursor-pointer text-white" onClick={() => setshowPasswordFields(true)}>
                            Change Password
                        </Button>
                    ) : (
                        <div className="flex flex-col lg:flex-row lg:items-center gap-5 w-full">
                            <div className="flex items-center gap-2">
                                <span className='font-semibold text-nowrap'>Old Password: </span>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                                    <Input
                                        type={passwordVisibility.oldPassword ? "text" : "password"}
                                        name="oldPassword"
                                        value={passwords.oldPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Old Password"
                                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                                        required
                                    />
                                    {passwordVisibility.oldPassword ? (
                                        <Eye className='text-blue-600 cursor-pointer mr-2.5' onClick={() => togglePasswordVisibility("oldPassword")} />
                                    ) : (
                                        <EyeOff className="text-blue-600 cursor-pointer mr-2.5" onClick={() => togglePasswordVisibility("oldPassword")} />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className='font-semibold text-nowrap'>New Password: </span>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                                    <Input
                                        type={passwordVisibility.newPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="New Password"
                                        className="bg-gray-100 dark:bg-gray-300 dark:placeholder:text-gray-500 text-black border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                                        required
                                    />
                                    {passwordVisibility.newPassword ? (
                                        <Eye className='text-blue-600 cursor-pointer mr-2.5' onClick={() => togglePasswordVisibility("newPassword")} />
                                    ) : (
                                        <EyeOff className="text-blue-600 cursor-pointer mr-2.5" onClick={() => togglePasswordVisibility("newPassword")} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {successMessage.password && (
                        <p className='text-green-600 font-semibold'>{successMessage.password}</p>
                    )}
                    {errorMessage.password && (
                        <p className='text-red-600 font-semibold'>{errorMessage.password}</p>
                    )}

                    {showPasswordFields && (
                        <div className='flex items-center gap-4'>
                            <Button className="block bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={submitNewPassword}>
                                Save New Password
                            </Button>

                            <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={() => setshowPasswordFields(false)}>
                                Cancel
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-10 mt-4 font-semibold">
                        <span>Followers: {user?.followers?.length ? user?.followers?.length : 0}</span>
                        <span>Following: {user?.following?.length ? user?.following?.length : 0}</span>
                        <span>Account Created: {accountDate ? new Date(accountDate).toLocaleDateString() : "Unknown"}</span>
                    </div>
                </section>
            </div >
        </main >
    )
}

export default Page
