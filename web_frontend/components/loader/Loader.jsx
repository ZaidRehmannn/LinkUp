'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Loader.css';
import { useRouter } from 'next/navigation';
import useUserStore from '@/stores/userStore';

const Loader = ({ title, path, logoutSuccess = false }) => {
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();
    const logout = useUserStore(state => state.logout);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (logoutSuccess) {
                logout();
            }
            
            router.push(path);
            setIsComplete(true);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [logoutSuccess, logout, path, router]);

    const letters = title.split('');

    if (isComplete) return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isComplete ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="wrapper"
        >
            {/* Spinner */}
            <div className="spinner" />

            {/* Animated title */}
            <div className="text">
                {letters.map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="letter"
                    >
                        {char}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
};

export default Loader;
