import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const SenderUser = ({ user }) => {
  return (
    <div className='flex items-center gap-2'>
        {/* sender profile picture */}
        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-700 flex items-center justify-center">
            {user.profilePic ? (
                <Image
                    src={user.profilePic}
                    alt={user.firstName}
                    width={38}
                    height={38}
                    className="object-cover w-full h-full"
                    priority
                />
            ) : (
                <UserCircle className="text-gray-500 w-6 h-6 lg:w-8 lg:h-8" />
            )}
        </div>
        {/* sender full name */}
        <p className="font-semibold dark:text-black text-xs lg:text-base">{user.firstName} {user.lastName}</p>
    </div>
  )
}

export default SenderUser
