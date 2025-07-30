'use client'

import React from 'react'
import useUserStore from '../../stores/userStore'

const page = () => {
  const token = useUserStore(state => state.token)
  const user = useUserStore(state => state.user)

  return (
    <div>
      feed
      <div>User Data: <pre>{JSON.stringify(user, null, 2)}</pre></div>
      <div>token: {token}</div>
    </div>
  )
}

export default page