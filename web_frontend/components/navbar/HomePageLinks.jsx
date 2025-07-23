'use client'

import React from 'react'
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, CircleQuestionMark, House, Info } from "lucide-react";
import Link from 'next/link';

const HomePageLinks = () => {
    const pathname = usePathname();
    const isAbout = pathname === "/about";
    const isHelp = pathname === "/help";

    return (
        <div className="flex items-center lg:gap-8 gap-4 lg:mr-5 mr-2">
            {(isAbout || isHelp) && (
                <Link
                    href="/"
                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline hover:underline-offset-4 transition"
                >
                    <span className="hidden lg:flex items-center gap-1">
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Home
                    </span>
                    <House className="lg:hidden" />
                </Link>
            )}

            <Link
                href="/about"
                className={`font-semibold text-blue-700 transition ${isAbout ? "underline underline-offset-4 decoration-2" : "hover:underline hover:underline-offset-4 hover:text-blue-800"}`}
            >
                <span className="hidden lg:block">About Us</span>
                <Info className="lg:hidden" />
            </Link>

            <Link
                href="/help"
                className={`font-semibold text-blue-700 transition ${isHelp ? "underline underline-offset-4 decoration-2" : "hover:underline hover:underline-offset-4 hover:text-blue-800"}`}
            >
                <span className="hidden lg:block">Help & Support</span>
                <CircleQuestionMark className="lg:hidden" />
            </Link>
        </div>
    )
}

export default HomePageLinks
