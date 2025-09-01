import React from 'react'

const NavbarSkeleton = () => {
    return (
        <div className="fixed w-full top-0 z-50 shadow h-16 flex justify-between items-center gap-4 md:gap-0 px-6 py-3 border-b bg-gray-100 dark:bg-gray-900">
            {/* Logo placeholder */}
            <div className="hidden lg:flex items-center relative h-10 w-[120px]">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>

            {/* Center placeholder */}
            <div className="flex-1 flex justify-center">
                <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>

            {/* Right side placeholder */}
            <div className="flex gap-3 items-center">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
        </div>
    )
}

export default NavbarSkeleton
