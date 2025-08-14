'use client'

import Link from "next/link"
import Image from "next/image"
import React from "react"
import HomePageLinks from "./HomePageLinks"
import useUserStore from "@/stores/userStore"
import FeedSearchBar from "./FeedSearchBar"
import { Bell, House, Menu, Moon } from "lucide-react"
import ThemeSwitcher from "../ThemeSwitcher"

const Navbar = () => {
  const token = useUserStore(state => state.token);
  const user = useUserStore(state => state.user);
  const toggleMenu = useUserStore(state => state.toggleMenu);

  return (
    <div className="fixed w-full top-0 z-50 shadow h-16 flex justify-end lg:justify-between items-center gap-4 md:gap-0 px-6 py-3 border-b bg-gray-100 dark:bg-gray-900">
      {/* Left Side - Logo (Desktop View) */}
      <Link href={token ? "/feed" : "/"} className="hidden lg:flex items-center relative h-10 w-[120px]">
        <Image
          src="/logo.png"
          alt="LinkUp Logo"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Left Side - Home Icon (Tablet and Mobile View) */}
      {token && (
        <Link href="/feed" className="lg:hidden">
          <House />
        </Link>
      )}

      {/* Right Side */}
      {token ? (
        <>
          <FeedSearchBar />
          <div className="flex gap-5 items-center">
            <Bell className="text-gray-500 dark:text-gray-300 cursor-pointer" />
            <Menu className="text-gray-500 dark:text-gray-300 cursor-pointer" onClick={toggleMenu} />
          </div>
        </>
      ) : (
        <div className="mr-2 gap-2 flex items-center">
          <HomePageLinks />
          <span className="flex items-center gap-1">
            <Moon size={20} className="text-blue-700 dark:text-blue-400" />
            <ThemeSwitcher />
          </span>
        </div>
      )}
    </div>
  )
}

export default Navbar
