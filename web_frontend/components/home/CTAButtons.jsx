"use client";

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const CTAButtons = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 2.2,
                duration: 0.6,
                type: "spring",
                stiffness: 80,
            }}
            className="flex gap-4"
        >
            <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-xl cursor-pointer">
                    Get Started
                </Button>
            </Link>
            <Link href="/auth/login">
                <Button variant="outline" className="text-blue-700 border-blue-600 hover:bg-blue-100 px-7 py-4 rounded-xl cursor-pointer">
                    Login
                </Button>
            </Link>
        </motion.section>
    )
}

export default CTAButtons
