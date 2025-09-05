import React from 'react'
import { Trash2, UserCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

const ProfilePictureSection = ({
    form,
    setForm,
    picturePreview,
    setPicturePreview,
    handleFileChange,
    submitProfilePicture,
    handlePictureRemove,
    successMessagePicture,
    errorMessagePicture
}) => {
    return (
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

            {successMessagePicture && (
                <p className='text-green-600 font-semibold'>{successMessagePicture}</p>
            )}
            {errorMessagePicture && (
                <p className='text-red-600 font-semibold'>{errorMessagePicture}</p>
            )}

            {picturePreview ? (
                <div className='flex flex-col gap-3'>
                    <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 cursor-pointer text-white"
                        onClick={submitProfilePicture}
                    >
                        Save New Picture
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        onClick={() => setPicturePreview(null)}
                    >
                        Cancel
                    </Button>
                </div>
            ) : form.image ? (
                <div className="flex flex-col gap-2">
                    <label htmlFor="change-profile-picture" className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2 rounded-lg'>
                        Change Picture
                    </label>
                    <input
                        id="change-profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, form, setForm)}
                    />
                    <Button
                        variant="destructive"
                        className="dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-700 cursor-pointer flex items-center"
                        onClick={handlePictureRemove}
                    >
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
                        onChange={(e) => handleFileChange(e, form, setForm)}
                    />
                </div>
            )}
        </section>
    )
}

export default ProfilePictureSection
