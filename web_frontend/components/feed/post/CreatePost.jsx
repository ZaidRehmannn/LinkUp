'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image';
import { Button } from '../../ui/button';
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
        showSuccessMessage,
        errorMessage,
        seterrorMessage
    } = useCreatePost();

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    const handleSubmit = async () => {
        seterrorMessage("");
        let mediaFile = "";

        try {
            setloading(true);

            if (media.image) {
                mediaFile = media.image;
            } else if (media.video) {
                mediaFile = media.video;
            }

            const result = await postService.createPost(content, mediaFile, token);
            if (result.success) {
                showSuccessMessage(result.message);
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

                <textarea
                    ref={textareaRef}
                    placeholder={media.image || media.video
                        ? "Add a caption..."
                        : `What's on your mind, ${user?.firstName}?`}
                    value={content}
                    onChange={(e) => setcontent(e.target.value)}
                    className="text-sm p-4 pl-16 w-full min-h-[80px] resize-none outline-none overflow-hidden"
                    style={{ height: 'auto' }}
                />

                {preview && (
                    media.image ? (
                        <div className='px-4'>
                            <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-80 relative overflow-hidden mb-3">
                            <video className='object-cover' controls>
                                <source src={preview} type="video/mp4" />
                            </video>
                        </div>
                    )
                )}
            </div>

            {successMessage && (
                <span className='text-green-600 font-semibold text-sm ml-3 mt-2'>{successMessage}</span>
            )}
            {errorMessage && (
                <span className='text-red-600 font-semibold text-sm ml-3 mt-2'>{errorMessage}</span>
            )}

            {/* Buttons for adding image/video and post */}
            <div className='flex justify-between mx-3 py-2'>

                {/* Cancel button */}
                {preview ? (
                    <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-xs cursor-pointer flex gap-1"
                        onClick={() => {
                            setpreview(null)
                            setmedia({
                                image: null,
                                video: null
                            })
                        }}
                        disabled={loading}
                    >
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
        </div>
    )
}

export default CreatePost
