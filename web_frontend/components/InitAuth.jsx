'use client'

import useUserStore from '@/app/stores/userStore'
import React, { useEffect } from 'react'
import axios from '@/lib/axios'

const InitAuth = () => {
    const setToken = useUserStore(state => state.setToken)
    const setUser = useUserStore(state => state.setUser)

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                setToken(token)

                try {
                    const response = await axios.get('/api/profile/userInfo', {
                        headers: { token }
                    })

                    if (response.data.success) {
                        setUser(response.data.user)
                    }
                } catch (err) {
                    console.error('Auth restore failed:', err)
                }
            }
        }

        init()
    }, [])

    return null
}

export default InitAuth
