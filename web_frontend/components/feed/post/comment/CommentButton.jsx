import { MessageCircle } from 'lucide-react'
import React from 'react'

const CommentButton = ({ postId, commentCount, setopenCommentBox, openCommentBox }) => {
    return (
        <button
            onClick={() => setopenCommentBox(!openCommentBox)}
            className="group flex items-center gap-1 hover:text-blue-600 cursor-pointer"
        >
            <MessageCircle
                className="w-4 h-4"
            />
            <span className="group-hover:underline group-hover:underline-offset-2 group-hover:decoration-blue-600">
                {commentCount > 0 ? `${commentCount} ` : ''}{commentCount > 1 ? "Comments" : "Comment"}
            </span>
        </button>
    )
}

export default CommentButton
