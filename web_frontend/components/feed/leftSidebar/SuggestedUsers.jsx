import React from 'react'
import ProfileIcon from './ProfileIcon';
import ExploreUserList from './ExploreUserList';

const SuggestedUsers = () => {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Profile Section */}
      <ProfileIcon />

      {/* Explore New People Section */}
      <div className="flex-1 overflow-y-auto">
        <ExploreUserList />
      </div>
    </div>
  )
}

export default SuggestedUsers
