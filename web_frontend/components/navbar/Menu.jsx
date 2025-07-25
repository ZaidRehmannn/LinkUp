'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUserStore from '@/app/stores/userStore'
import { Settings, Moon, LogOut } from 'lucide-react'
import Loader from '../loader/Loader'
import { Switch } from "@/components/ui/switch"
import ThemeSwitcher from '../ThemeSwitcher'

const Menu = () => {
    const openMenu = useUserStore(state => state.openMenu);
    const token = useUserStore(state => state.token);
    const [logoutSuccess, setlogoutSuccess] = useState(false);
    const [isDark, setisDark] = useState(false);

    const toggleDarkMode = () => {
        setisDark(!isDark);
    }

    return (
        <>
            <AnimatePresence>
                {openMenu && token && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-gray-100 shadow-lg z-50"
                    >
                        <div className="p-4">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer w-fit">
                                    <Settings size={18} />
                                    Profile Settings
                                </li>

                                <li className="flex items-center justify-between w-full">
                                    <div className='flex items-center gap-2 hover:text-blue-600'>
                                        <Moon size={18} />
                                        Dark Mode
                                    </div>
                                    <ThemeSwitcher />
                                </li>

                                <li className="flex items-center gap-2 hover:text-blue-600 cursor-pointer w-fit" onClick={() => setlogoutSuccess(true)}>
                                    <LogOut size={18} />
                                    Logout
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {logoutSuccess && (
                <Loader title="Logging Out..." path="/" logoutSuccess={true} />
            )}
        </>
    )
}

export default Menu
