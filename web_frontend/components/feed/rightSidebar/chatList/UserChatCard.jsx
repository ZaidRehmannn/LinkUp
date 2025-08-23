import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const UserChatCard = ({ user }) => {
    return (
        <div className="flex items-center gap-3 bg-gray-100 hover:bg-gray-300 dark:bg-gray-100 dark:hover:bg-gray-400 lg:px-2 py-1 rounded-lg transition cursor-pointer border border-gray-400">
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
                <UserCircle className="w-9 h-9 text-gray-500" />
            )}

            {/* User Info */}
            <span className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
            </span>
        </div>
    )
}

export default UserChatCard
