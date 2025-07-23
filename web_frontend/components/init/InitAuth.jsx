import useUserStore from '@/app/stores/userStore'
import React, { useEffect } from 'react'

const InitAuth = () => {
    const setToken = useUserStore(state => state.setToken)
    const setUser = useUserStore(state => state.setUser)

    useEffect(() => {
      const token = localStorage.getItem("token");

      if(token){
        setToken(token);

        // const user = axios.get('/')
      }
    }, [])
    
    return null
}

export default InitAuth