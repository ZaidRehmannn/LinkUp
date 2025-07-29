import React from 'react'

const About = ({ user }) => {
    const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <main className="space-y-4 text-gray-800 w-full max-w-xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <span className="text-blue-600 font-semibold">
                    First Name: <span className="text-gray-700 dark:text-gray-300">{user.firstName}</span>
                </span>
                <span className="text-blue-600 font-semibold">
                    Last Name: <span className="text-gray-700 dark:text-gray-300">{user.lastName}</span>
                </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <span className="text-blue-600 font-semibold">
                    Username: <span className="text-gray-700 dark:text-gray-300">@{user.username}</span>
                </span>
                <span className="text-blue-600 font-semibold">
                    Email: <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                </span>
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-blue-600 font-semibold">Bio:</span>
                <p className="text-gray-700 dark:text-gray-300">
                    {user.bio || 'No bio added.'}
                </p>
            </div>

            <div className="text-sm">
                <span className='text-blue-600 font-semibold'>Joined on: </span> 
                <span className="font-medium text-gray-700 dark:text-gray-300">{formattedDate}</span>
            </div>
        </main>
    )
}

export default About
