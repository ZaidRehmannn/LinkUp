'use client'

import React from 'react'
import InitAuth from './InitAuth'

export default function AuthWrapper({ children }) {
    return (
        <>
            <InitAuth />
            {children}
        </>
    )
}
