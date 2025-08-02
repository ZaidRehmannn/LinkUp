import React from 'react'
import Image from 'next/image';
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button';
import { Image as ImageIcon, Pencil, UserCircle, Video, X } from 'lucide-react';
import { useCreatePost } from '@/hooks/usePost';
import { postService } from '@/services/postService';

const CreatePost = () => {
    const {
        user,
        token,
        content,
        setcontent,
        preview,
        setpreview,
        media,
        setmedia,
        loading,
        setloading,
        handleMediaChange,
        successMessage,
        setsuccessMessage,
        errorMessage,
        seterrorMessage
    } = useCreatePost();

    const handleSubmit = async () => {
        setsuccessMessage("");
        seterrorMessage("");
        let mediaFile = "";

        try {
            setloading(true);

            if (media.image) {
                mediaFile = media.image;
            } else {
                mediaFile = media.video;
            }

            const result = await postService.createPost(content, mediaFile, token);
            if (result.success) {
                setsuccessMessage(result.message);
                setcontent("");
                setpreview(null);
                setmedia({
                    image: null,
                    video: null
                })
            } else {
                seterrorMessage("Failed to Post!")
            }
        } catch (error) {
            console.error("Create Post Error: ", error);
            seterrorMessage(error.message);
        } finally {
            setloading(false);
        }
    };

    return (
        <div className='min-h-min bg-white rounded-lg shadow-md'>

            {/* Container div to make it like picture inside textarea */}
            <div className="relative">
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden z-10">
                    {user?.profilePic ? (
                        <Image
                            src={user?.profilePic}
                            alt="User"
                            width={40}
                            height={40}
                            priority
                        />
                    ) : (
                        <UserCircle className="text-gray-500 w-8 h-8" />
                    )}
                </div>

                <Textarea
                    placeholder={media.image || media.video ? "Add a caption..." : `What's on your mind, ${user?.firstName}?`}
                    value={content}
                    onChange={(e) => setcontent(e.target.value)}
                    className="resize-none border-none shadow-none p-5 pl-16 pb-9 w-full min-h-min outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none"
                />

                {preview && (
                    media.image ? (
                        <div className="mb-3 flex items-center justify-center">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={180}
                                height={180}
                            />
                        </div>
                    ) : (
                        <div className="mb-3 flex items-center justify-center">
                            <video width="220" controls>
                                <source src={preview} type="video/mp4" />
                            </video>
                        </div>
                    )
                )}
            </div>

            {/* Buttons for adding image/video and post */}
            <div className='flex justify-between mx-3 py-2'>

                {/* Cancel button */}
                {preview ? (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs cursor-pointer flex gap-1" onClick={() => {
                        setpreview(null)
                        setmedia({
                            image: null,
                            video: null
                        })
                    }}>
                        <X /> Cancel
                    </Button>
                ) : (
                    <div className='flex items-center justify-center gap-2'>
                        {/* Upload image button */}
                        <div>
                            <label htmlFor="post-image" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-md text-xs cursor-pointer">
                                <ImageIcon size={16} />
                                <span>Upload Image</span>
                            </label>
                            <input
                                id="post-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleMediaChange(e)}
                            />
                        </div>

                        {/* Add video button */}
                        <div>
                            <label htmlFor="post-video" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-md text-xs cursor-pointer">
                                <Video size={16} />
                                <span>Add Video</span>
                            </label>
                            <input
                                id="post-video"
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => handleMediaChange(e)}
                            />
                        </div>
                    </div>
                )}

                {/* Post button */}
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer flex gap-1" onClick={handleSubmit} disabled={loading || (!content.trim() && !media.image && !media.video)}>
                    <Pencil /> {loading ? "Posting..." : "Post"}
                </Button>
            </div>

            {successMessage && (
                <p className='text-green-600 font-semibold'>{successMessage}</p>
            )}
            {errorMessage && (
                <p className='text-red-600 font-semibold'>{errorMessage}</p>
            )}
        </div>
    )
}

export default CreatePost
