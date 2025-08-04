'use client'

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { postService } from '@/services/postService';
import usePostStore from '@/stores/postStore';
import useUserStore from '@/stores/userStore';
import Image from 'next/image';
import React, { useState } from 'react'

const EditPost = ({ post }) => {
    const { _id, caption, image, video } = post;

    const token = useUserStore(state => state.token);
    const setEditPost = usePostStore(state => state.setEditPost);

    const [successMessage, setsuccessMessage] = useState("");
    const [errorMessage, seterrorMessage] = useState("");
    const [content, setcontent] = useState(caption);

    const submitPost = async () => {
        try {
            const result = await postService.editPost(_id, token);
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
            <Textarea
                placeholder={image || video ? "Add a caption..." : "Write something here..."}
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                className="text-sm text-gray-800 mb-3"
            />

            {/* media files */}
            {image ? (
                <>
                    <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                        <Image
                            src={image}
                            alt="Post Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button>Remove Image</Button>
                </>
            ) : video ? (
                <>
                    <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                        <video className='object-cover' controls>
                            <source src={video} type="video/mp4" />
                        </video>
                    </div>
                    <Button>Remove Video</Button>
                </>
            ) : (
                <>
                    <Button>Upload Image</Button>
                    <Button>Add Video</Button>
                </>
            )}

            {/* action buttons */}
            <Button onClick={() => setEditPost(false)}>Cancel</Button>
            <Button onClick={submitPost}>Save Changes</Button>
        </>
    )
}

export default EditPost
