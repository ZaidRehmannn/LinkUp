'use client'

import React from 'react'
import { UserCircle } from 'lucide-react'
import useUserStore from '@/stores/userStore'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ProfileIcon = () => {
  const user = useUserStore(state => state.user);
  const loading = useUserStore(state => state.loading);

  if (!user) return null

  if (loading) {
    return <div>Loading user info...</div>
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-200 dark:bg-gray-300 lg:px-3 py-2 rounded-lg transition">
      <div className='flex items-center gap-3'>
        {/* Profile Image or Icon */}
        {user.profilePic ? (
          <Image
            src={user.profilePic}
            alt="User profile"
            width={36}
            height={36}
            className="w-10 h-10 rounded-full border border-gray-700 object-cover"
          />
        ) : (
          <UserCircle className="w-9 h-9 text-gray-500 bg-gray-200 border border-gray-700 p-0.5 rounded-full" />
        )}

        {/* User Info */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-700">@{user.username}</span>
        </div>
      </div>

      {/* view profile button */}
      <Link href={`/profile/${user?.username}`}>
        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-800 cursor-pointer w-full">
          View Profile
        </Button>
      </Link>
    </div>
  )
}

export default ProfileIcon
