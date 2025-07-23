'use client'

import React from 'react'
import { UserCircle } from 'lucide-react'
import useUserStore from '@/app/stores/userStore'
import Image from 'next/image'

const ProfileIcon = () => {
  const user = useUserStore(state => state.user)
  console.log(user);

  if (!user) return null

  return (
    <div className="flex items-center gap-2 hover:bg-gray-200 px-3 py-1 rounded-full cursor-pointer transition">
      {/* Profile Image or Icon */}
      {user.profilePic ? (
        <Image
          src={user.profilePic}
          alt="User profile"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      ) : (
        <UserCircle className="w-9 h-9 text-gray-500" />
      )}

      {/* User Name */}
      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
        {user.firstName} {user.lastName}
      </span>
    </div>
  )
}

export default ProfileIcon
