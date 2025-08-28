'use client';

import React, { useCallback, useEffect, useState } from 'react'
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

const PostCard = React.memo(({ post, postPage = false }) => {
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

    const handleCaptionExpand = useCallback(() => {
        setcaptionExpanded(true);
    }, []);

    useEffect(() => {
        if (storeCommentCount === undefined) {
            setCommentCount(_id, commentCount);
        }
    }, [_id, commentCount, storeCommentCount, setCommentCount]);

    return (
        <div className="border bg-white dark:bg-gray-300 rounded-lg shadow p-4 mb-4 w-full">
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
                        <Link href={`/profile/${user.username}`}>
                            <p className="font-semibold dark:text-black">{user.firstName} {user.lastName}</p>
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-700">
                            {new Date(createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Own post options (Edit and Delete) */}
                {user._id.toString() === loggedInUserId?.toString() && !isEditing && (
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
                        <div
                            className='text-sm text-blue-600 font-semibold w-fit cursor-pointer mb-2'
                            onClick={handleCaptionExpand}
                        >
                            Read more...
                        </div>
                    )}

                    {/* media files */}
                    {image && (
                        <div className="relative w-full max-h-[600px] flex items-center justify-center rounded-md overflow-hidden mb-3 bg-black">
                            <Image
                                src={image}
                                alt="Post Image"
                                width={800}
                                height={600}
                                className="object-contain w-full h-auto max-h-[600px]"
                                priority
                            />
                        </div>
                    )}

                    {video && (
                        <div className="relative w-full max-h-[600px] flex items-center justify-center rounded-md overflow-hidden mb-3 bg-black">
                            <video
                                src={video}
                                controls
                                className="object-contain w-full h-auto max-h-[600px]"
                            />
                        </div>
                    )}
                </>
            ) : (
                <EditPost post={post} />
            )}

            {/* user actions */}
            <div className="flex justify-between pt-2 border-t text-sm text-gray-600 dark:text-gray-800">
                <LikeButton postId={_id} likes={likes} />
                <CommentButton
                    commentCount={displayCommentCount}
                    setopenCommentBox={setopenCommentBox}
                    openCommentBox={openCommentBox}
                />
            </div>

            {/* comment box */}
            {(openCommentBox || postPage) && (
                <Comments postId={_id} />
            )}
        </div>
    )
})

PostCard.displayName = 'PostCard';
export default PostCard;
