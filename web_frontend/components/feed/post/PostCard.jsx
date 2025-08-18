'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { UserCircle } from 'lucide-react'
import PostActionsDropdown from './PostActionsDropdown';
import usePostStore from '@/stores/postStore';
import EditPost from './EditPost';
import useUserStore from '@/stores/userStore';
import LikeButton from './like/LikeButton';
import CommentButton from './comment/CommentButton';
import Comments from './comment/Comments';
import useCommentStore from '@/stores/commentStore';
import Link from 'next/link';

const PostCard = ({ post }) => {
    const { _id, user, caption, image, video, likes, commentCount, createdAt } = post;

    const editPostId = usePostStore(state => state.editPostId);
    const isEditing = editPostId?.toString() === _id?.toString();

    const shouldTruncate = caption.length > 200;
    const [captionExpanded, setcaptionExpanded] = useState(false);

    const loggedInUserId = useUserStore(state => state.user?._id);

    const [openCommentBox, setopenCommentBox] = useState(false);

    const storeCommentCount = useCommentStore(state => state.commentCounts[_id]);
    const setCommentCount = useCommentStore(state => state.setCommentCount);
    const displayCommentCount = storeCommentCount ?? commentCount;

    useEffect(() => {
        if (storeCommentCount === undefined) {
            setCommentCount(_id, commentCount);
        }
    }, [_id, commentCount, storeCommentCount, setCommentCount]);

    useEffect(() => {
        if (!editPostId) return;
    }, [editPostId])

    return (
        <div className="border bg-white dark:bg-gray-300 rounded-lg shadow p-4 mb-4">
            {/* user info and post time */}
            <div className="flex justify-between">
                <div className='flex items-center gap-3 mb-2'>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-700 flex items-center justify-center">
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
                        <Link href={`/profile/${user.username}`}><p className="font-semibold dark:text-black">{user.firstName} {user.lastName}</p></Link>
                        <p className="text-xs text-gray-500 dark:text-gray-700">{new Date(createdAt).toLocaleString()}</p>
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
                    <p className={`text-sm text-gray-800 dark:text-black whitespace-pre-wrap mb-2 ${!captionExpanded && "line-clamp-5"}`}>
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
                        <div className="w-full h-80 rounded-md overflow-hidden mb-3">
                            <video
                                src={video}
                                controls
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </>
            ) : (
                <EditPost post={post} />
            )}

            {/* user actions */}
            <div className="flex justify-between pt-2 border-t text-sm text-gray-600 dark:text-gray-800">
                <LikeButton
                    postId={_id}
                    likes={likes}
                />
                <CommentButton
                    commentCount={displayCommentCount}
                    setopenCommentBox={setopenCommentBox}
                    openCommentBox={openCommentBox}
                />
            </div>

            {/* comment box */}
            {openCommentBox && (
                <Comments postId={_id} />
            )}
        </div>
    )
}

export default PostCard
