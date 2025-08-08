import { Button } from '@/components/ui/button'
import React from 'react'

const Comments = ({ postId }) => {
  return (
    <div className='border p-3'>
      {/* add a new comment box */}
      <div className="flex items-center gap-2 w-full border">
        <textarea
          placeholder="Write a comment..."
          className="w-full resize-none"
        />
        <div className="flex justify-end">
          <Button size="sm">Post</Button>
        </div>
      </div>

      {/* previous comments list */}
      <div>

      </div>
    </div>
  )
}

export default Comments
