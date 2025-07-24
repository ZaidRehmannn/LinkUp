'use client'

import React from 'react'
import { UserCircle } from 'lucide-react'
import useUserStore from '@/app/stores/userStore'
import Image from 'next/image'

const ProfileIcon = () => {
  const user = useUserStore(state => state.user);
  const loading = useUserStore(state => state.loading);

  if (!user) return null

  const capitalize = (name) => {
    return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : ''
  }

  const firstName = capitalize(user.firstName)
  const lastName = capitalize(user.lastName)

  if (loading) {
    return <div>Loading user info...</div>
  }

  return (
    <div className="flex items-center gap-3 hover:bg-gray-200 px-3 py-1 rounded-full cursor-pointer transition">
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

      {/* User Info */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-gray-800">
          {firstName} {lastName}
        </span>
        <span className="text-xs text-gray-500">@{user.username}</span>
      </div>
    </div>
  )
}

export default ProfileIcon
