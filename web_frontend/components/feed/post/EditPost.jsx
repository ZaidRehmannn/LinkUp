'use client'

import { Button } from '@/components/ui/button';
import { postService } from '@/services/postService';
import usePostStore from '@/stores/postStore';
import useUserStore from '@/stores/userStore';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Video } from 'lucide-react';

const EditPost = ({ post }) => {
    const { _id, caption, image, video } = post;

    const token = useUserStore(state => state.token);
    const setEditPostId = usePostStore(state => state.setEditPostId);

    const [successMessage, setsuccessMessage] = useState("");
    const [errorMessage, seterrorMessage] = useState("");
    const [content, setcontent] = useState(caption);

    const [media, setmedia] = useState({
        image: image ? image : null,
        video: video ? video : null
    });

    const handleMediaPreview = (file) => {
        if (file) {
            const fileType = file?.type;
            if (fileType.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    setpreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                const videoURL = URL.createObjectURL(file);
                setpreview(videoURL);
            }
        }
    };

    const [preview, setpreview] = useState(handleMediaPreview(image ? image : video ? video : null));

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file?.type;
            if (fileType.startsWith("image/")) {
                setmedia({ ...media, image: file })
            } else if (fileType.startsWith("video/")) {
                setmedia({ ...media, video: file })
            }
            handleMediaPreview(file);
        }
    };

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    const submitPost = async () => {
        let mediaFile = "";

        try {
            if (media.image) {
                mediaFile = media.image;
            } else if (media.video) {
                mediaFile = media.video;
            }

            const result = await postService.editPost(_id, content, mediaFile, token);
            if (result.success) {
                setsuccessMessage(result.message)
            } else {
                seterrorMessage(result.message)
            }
        } catch (error) {
            console.error("Edit Post Error: ", error);
            seterrorMessage(error.message);
        }
    };

    return (
        <>
            {/* caption */}
            <textarea
                ref={textareaRef}
                placeholder={image || video ? "Add a caption..." : "Write something here..."}
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                className="text-sm text-gray-800 mb-2 w-full resize-none outline-none overflow-hidden"
                style={{ height: 'auto' }}
            />

            {/* media files */}
            {preview && (
                media.image ? (
                    <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                        <Image
                            src={media.image}
                            alt="Post Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                        <video className='object-cover' controls>
                            <source src={media.video} type="video/mp4" />
                        </video>
                    </div>
                )
            )}

            {/* action buttons */}
            <div className='flex justify-between items-center mb-2'>
                {/* add/remove media buttons */}
                <span>
                    {media.image ? (
                        <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
                            onClick={() => {
                                setpreview(null)
                                setmedia({ ...media, image: null })
                            }}
                        >
                            Remove Image
                        </Button>
                    ) : media.video ? (
                        <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
                            onClick={() => {
                                setpreview(null)
                                setmedia({ ...media, video: null })
                            }}
                        >
                            Remove Video
                        </Button>
                    ) : (
                        <span className='flex gap-2'>
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
                        </span>
                    )}
                </span>

                {/* submit/cancel buttons */}
                <span className='flex gap-2'>
                    <Button
                        size="sm"
                        className='bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer'
                        onClick={() => setEditPostId(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className='bg-green-600 hover:bg-green-700 text-white text-xs cursor-pointer'
                        onClick={submitPost}
                    >
                        Save Changes
                    </Button>
                </span>
            </div>
        </>
    )
}

export default EditPost
