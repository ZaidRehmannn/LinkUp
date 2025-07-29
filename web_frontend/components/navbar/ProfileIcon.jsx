'use client'

import React from 'react'
import { UserCircle } from 'lucide-react'
import useUserStore from '@/app/stores/userStore'
import Image from 'next/image'

const ProfileIcon = () => {
  const user = useUserStore(state => state.user);
  const loading = useUserStore(state => state.loading);

  if (!user) return null

  if (loading) {
    return <div>Loading user info...</div>
  }

  return (
    <div className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 lg:px-3 py-1 rounded-full cursor-pointer transition">
      {/* Profile Image or Icon */}
      {user.profilePic ? (
        <Image
          src={user.profilePic}
          alt="User profile"
          width={36}
          height={36}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <UserCircle className="w-9 h-9 text-gray-500 dark:text-gray-300" />
      )}

      {/* User Info */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-300 ">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</span>
      </div>
    </div>
  )
}

export default ProfileIcon
