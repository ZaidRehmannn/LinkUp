'use client';

import { Button } from '@/components/ui/button';
import { postService } from '@/services/postService';
import Image from 'next/image';
import React, { useEffect } from 'react'
import { Image as ImageIcon, Video } from 'lucide-react';
import { useEditPost } from '@/hooks/usePost';
import toast from 'react-hot-toast';

const EditPost = ({ post }) => {
    const { _id, caption, image, video } = post;

    const {
        token,
        setEditPostId,
        content,
        setcontent,
        preview,
        media,
        textareaRef,
        handleMediaChange,
        initialLoad,
        removeMedia,
        setremoveMedia,
        handleRemoveMedia,
        loading,
        setloading,
        updatePost
    } = useEditPost();

    const submitPost = async () => {
        setloading(true);
        let mediaFile = "";

        try {
            if (media.image instanceof File) {
                mediaFile = media.image;
            } else if (media.video instanceof File) {
                mediaFile = media.video;
            }

            toast.promise(
                postService.editPost(_id, content, mediaFile, removeMedia, token),
                {
                    loading: 'Updating post...',
                    success: (result) => {
                        if (result.success) {
                            updatePost(result.updatedPost);
                            setEditPostId(null);
                            return result.message;
                        } else {
                            throw new Error(result.message);
                        }
                    },
                    error: (error) => error.message || 'Something went wrong!',
                }
            );
        } catch (error) {
            console.error("Edit Post Error: ", error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        initialLoad(caption, image, video);
        setremoveMedia(false);
    }, [caption, image, video]);

    if (loading) {
        toast.loading('Updating');
    }

    return (
        <>
            {/* caption */}
            <textarea
                ref={textareaRef}
                placeholder={image || video ? "Add a caption..." : "Write something here..."}
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                className="text-sm text-gray-800 bg-gray-100 rounded-md p-1 px-2 mb-2 w-full resize-none outline-none overflow-hidden"
                style={{ height: 'auto' }}
            />

            {/* media files */}
            {preview && (
                media.image ? (
                    <div className="relative w-full max-h-[600px] flex items-center justify-center rounded-md overflow-hidden mb-3 bg-black">
                        <Image
                            src={preview}
                            alt="Post Image"
                            width={800}
                            height={600}
                            className="object-contain w-full h-auto max-h-[600px]"
                            priority
                        />
                    </div>
                ) : media.video ? (
                    <div className="relative w-full max-h-[600px] flex items-center justify-center rounded-md overflow-hidden mb-3 bg-black">
                        <video
                            className="object-contain w-full h-auto max-h-[600px]"
                            controls
                        >
                            <source src={preview} type="video/mp4" />
                        </video>
                    </div>
                ) : null
            )}

            {/* action buttons */}
            <div className='flex justify-between items-center mb-2 flex-wrap gap-2'>
                {/* add/remove media buttons */}
                <span className="flex flex-wrap gap-2">
                    {media.image ? (
                        <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
                            onClick={handleRemoveMedia}
                        >
                            Remove Image
                        </Button>
                    ) : media.video ? (
                        <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
                            onClick={handleRemoveMedia}
                        >
                            Remove Video
                        </Button>
                    ) : (
                        <span className='flex flex-wrap gap-2'>
                            {/* Upload image button */}
                            <div>
                                <label htmlFor="edit-post-image" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-md text-xs cursor-pointer">
                                    <ImageIcon size={16} />
                                    <span>Upload Image</span>
                                </label>
                                <input
                                    id="edit-post-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        handleMediaChange(e);
                                        setremoveMedia(false);
                                    }}
                                />
                            </div>

                            {/* Add video button */}
                            <div>
                                <label htmlFor="edit-post-video" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-md text-xs cursor-pointer">
                                    <Video size={16} />
                                    <span>Add Video</span>
                                </label>
                                <input
                                    id="edit-post-video"
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        handleMediaChange(e);
                                        setremoveMedia(false);
                                    }}
                                />
                            </div>
                        </span>
                    )}
                </span>

                {/* submit/cancel buttons */}
                <span className='flex gap-2'>
                    <Button
                        size="sm"
                        className='bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer'
                        onClick={() => {
                            setEditPostId(null);
                            setremoveMedia(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className='bg-green-600 hover:bg-green-700 text-white text-xs cursor-pointer'
                        onClick={submitPost}
                        disabled={loading || (!content.trim() && !media.image && !media.video)}
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </Button>
                </span>
            </div>
        </>
    )
}

export default EditPost;
