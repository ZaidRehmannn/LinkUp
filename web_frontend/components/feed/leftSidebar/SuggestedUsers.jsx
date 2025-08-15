import React from 'react'
import ProfileIcon from './ProfileIcon';
import ExploreUserList from './ExploreUserList';

const SuggestedUsers = () => {
  return (
    <div className='flex flex-col gap-3 h-full'>
      {/* profile section */}
      <ProfileIcon />

      {/* explore new people section */}
      <ExploreUserList />
    </div>
  )
}

export default SuggestedUsers
