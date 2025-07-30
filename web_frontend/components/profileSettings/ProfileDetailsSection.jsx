import React from 'react'
import { Pencil } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const ProfileDetailsSection = ({
    user,
    form,
    isEditing,
    setIsEditing,
    handleChange,
    submitProfileDetails,
    successMessageDetails,
    errorMessageDetails,
    formatAccountDate
}) => {
    return (
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
                    <span>{user?.bio?.trim() ? user.bio : "No Bio Added"}</span>
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

            {successMessageDetails && (
                <p className='text-green-600 font-semibold'>{successMessageDetails}</p>
            )}
            {errorMessageDetails && (
                <p className='text-red-600 font-semibold'>{errorMessageDetails}</p>
            )}

            {!isEditing ? (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-2" onClick={() => setIsEditing(true)}>
                    <Pencil /> Edit Profile
                </Button>
            ) : (
                <div className='flex items-center gap-4'>
                    <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={submitProfileDetails}>
                        Save Changes
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </div>
            )}

            <div className="flex gap-10 mt-4 font-semibold">
                <span>Followers: {user?.followers?.length ? user?.followers?.length : 0}</span>
                <span>Following: {user?.following?.length ? user?.following?.length : 0}</span>
                <span>Account Created: {formatAccountDate(user?.createdAt)}</span>
            </div>
        </section>
    )
}

export default ProfileDetailsSection
