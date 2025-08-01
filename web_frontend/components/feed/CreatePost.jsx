'use client'

import React, { useState } from 'react'
import Image from 'next/image';
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button';
import { Image as ImageIcon, Pencil, UserCircle, Video } from 'lucide-react';
import useUserStore from '@/stores/userStore';

const CreatePost = () => {
    const user = useUserStore(state => state.user);
    const [content, setcontent] = useState("");
    const [preview, setpreview] = useState(null);
    const [media, setmedia] = useState({
        image: null,
        video: null
    });
    const [loading, setloading] = useState(false);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;

            if (fileType.startsWith("image/")) {
                setmedia({ ...media, image: file })

                const reader = new FileReader();
                reader.onload = () => {
                    setpreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (fileType.startsWith("video/")) {
                setmedia({ ...media, video: file })

                const videoURL = URL.createObjectURL(file);
                setpreview(videoURL);
            }
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() && !media.image && !media.video) return

        try {
            setloading(true);


        } catch (error) {
            console.error("Create Post Error: ", error);
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
                    placeholder={`What's on your mind, ${user?.firstName}?`}
                    value={content}
                    onChange={(e) => setcontent(e.target.value)}
                    className="resize-none border-none shadow-none p-5 pl-16 pb-9 w-full min-h-min outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none"
                />

                {preview && (
                    media.image ? (
                        <div className="mt-2">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={200}
                                height={200}
                                className="rounded-md"
                            />
                        </div>
                    ) : media.video ? (
                        <div className="mt-2">
                            <video width="200" controls className="rounded-md">
                                <source src={preview} type="video/mp4" />
                            </video>
                        </div>
                    ) : null
                )}

            </div>

            {/* Buttons for Post */}
            <div className='flex justify-between mx-3 py-2'>
                <span className='flex items-center justify-center gap-2'>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer flex gap-1">
                        <ImageIcon /> Upload Image
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer flex gap-1">
                        <Video /> Add Video
                    </Button>
                </span>

                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs cursor-pointer flex gap-1" onClick={handleSubmit} disabled={loading || (!content.trim() && !media)}>
                    <Pencil /> {loading ? "Posting..." : "Post"}
                </Button>
            </div>
        </div>
    )
}

export default CreatePost
