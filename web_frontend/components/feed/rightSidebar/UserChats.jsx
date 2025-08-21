import React from 'react'

const UserChats = ({ results, resetOnSelect }) => {
  return (
    <div>
      {results.length > 0 && (
        <ul className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto z-50">
          {results.map((user) => (
            <li key={user._id} onClick={resetOnSelect}>
              <ExploreUserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserChats
