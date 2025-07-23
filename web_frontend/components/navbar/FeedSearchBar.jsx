import React from 'react'
import { Search } from 'lucide-react'

const FeedSearchBar = () => {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm w-full max-w-md">
      <Search className="h-5 w-5 text-gray-500" />
      <input
        type="text"
        placeholder="Search LinkUp..."
        className="ml-3 bg-transparent outline-none flex-1 placeholder:text-gray-400 text-sm"
      />
    </div>
  )
}

export default FeedSearchBar
