'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import PostActionsDropdown from './PostActionsDropdown';
import usePostStore from '@/stores/postStore';
import EditPost from './EditPost';

const Post = ({ post, loggedInUserId }) => {
    const { _id, user, caption, image, video, likes, commentCount, createdAt } = post;
    const editPostId = usePostStore(state => state.editPostId);
    const isEditing = editPostId?.toString() === _id.toString();

    const shouldTruncate = caption.length > 200;
    const [captionExpanded, setcaptionExpanded] = useState(false);

    return (
        <div className="border bg-white rounded-lg shadow p-4 mb-4">

            {/* user info and post time */}
            <div className="flex justify-between">
                <div className='flex items-center gap-3 mb-2'>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {user.profilePic ? (
                            <Image
                                src={user.profilePic}
                                alt={user.firstName}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                                priority
                            />
                        ) : (
                            <UserCircle className="text-gray-500 w-8 h-8" />
                        )}
                    </div>

                    <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
                    </div>
                </div>

                {/* Own post options (Edit and Delete) */}
                {user._id.toString() === loggedInUserId.toString() && !isEditing && (
                    <PostActionsDropdown postId={_id} />
                )}
            </div>

            {!isEditing ? (
                <>
                    {/* caption */}
                    <p className={`text-sm text-gray-800 whitespace-pre-wrap mb-2 ${!captionExpanded && "line-clamp-5"}`}>
                        {caption}
                    </p>

                    {/* Read more button */}
                    {!captionExpanded && shouldTruncate && (
                        <div className='text-sm text-blue-600 font-semibold w-fit cursor-pointer mb-2' onClick={() => setcaptionExpanded(true)}>
                            Read more...
                        </div>
                    )}

                    {/* media files */}
                    {image && (
                        <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                            <Image
                                src={image}
                                alt="Post Image"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {video && (
                        <div className="w-full h-80 relative rounded-md overflow-hidden mb-3">
                            <video className='object-cover' controls>
                                <source src={video} type="video/mp4" />
                            </video>
                        </div>
                    )}
                </>
            ) : (
                <EditPost post={post} />
            )}

            {/* user actions */}
            <div className="flex justify-between pt-2 border-t text-sm text-gray-600">
                <button className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <Heart className="w-4 h-4" />
                    {likes.length > 0 && likes.length}
                    {likes.length > 1 ? "Likes" : "Like"}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    {commentCount > 0 && commentCount}
                    {commentCount > 1 ? "Comments" : "Comment"}
                </button>
            </div>
        </div>
    )
}

export default Post
