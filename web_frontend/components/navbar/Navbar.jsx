'use client'

import Link from "next/link"
import Image from "next/image"
import React from "react"
import HomePageLinks from "./HomePageLinks"
import useUserStore from "@/app/stores/userStore"
import FeedSearchBar from "./FeedSearchBar"
import ProfileIcon from "./ProfileIcon"
import { Menu, Moon } from "lucide-react"
import ThemeSwitcher from "../ThemeSwitcher"

const Navbar = () => {
  const token = useUserStore(state => state.token);
  const toggleMenu = useUserStore(state => state.toggleMenu);

  return (
    <div className="h-16 flex justify-between items-center px-6 py-3 border-b bg-gray-100 dark:bg-gray-900">
      {/* Left Side - Logo */}
      <Link href="/" className="flex items-center relative h-10 w-[120px]">
        <Image
          src="/logo.png"
          alt="LinkUp Logo"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Right Side */}
      {token ? (
        <>
          <FeedSearchBar />
          <div className="flex gap-2 items-center">
            <ProfileIcon />
            <Menu className="text-gray-500 cursor-pointer" onClick={toggleMenu} />
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
