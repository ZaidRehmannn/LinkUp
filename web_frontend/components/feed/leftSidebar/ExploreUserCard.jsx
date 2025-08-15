import { UserCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ExploreUserCard = ({ user }) => {
    return (
        <Link href={`/profile/${user.username}`}>
            <div className="flex items-center gap-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-200 dark:hover:bg-gray-400 lg:px-3 py-2 rounded-lg transition cursor-pointer border border-gray-400">
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
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-700">@{user.username}</span>
                </div>
            </div>
        </Link>
    )
}

export default ExploreUserCard
