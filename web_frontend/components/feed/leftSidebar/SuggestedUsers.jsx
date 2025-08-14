import React from 'react'
import ProfileIcon from '@/components/feed/leftSidebar/ProfileIcon';

const SuggestedUsers = () => {
  return (
    <div className='flex flex-col gap-3 h-full'>
      {/* profile section */}
      <ProfileIcon />

      {/* explore new people section */}
      <div className='bg-gray-200 dark:bg-gray-300 rounded-md border-2 h-full p-2'>
        <p className='font-semibold text-gray-900 text-lg'>Explore New People</p>
      </div>
    </div>
  )
}

export default SuggestedUsers
