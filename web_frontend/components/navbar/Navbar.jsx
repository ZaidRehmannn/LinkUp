'use client'

import Link from "next/link"
import Image from "next/image"
import React from "react"
import HomePageLinks from "./HomePageLinks"
import useUserStore from "@/app/stores/userStore"
import FeedSearchBar from "./FeedSearchBar"
import ProfileIcon from "./ProfileIcon"

const Navbar = () => {
  const token = useUserStore(state => state.token)

  return (
    <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-100">
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
          <ProfileIcon />
        </>
      ) : (
        <HomePageLinks />
      )}
    </div>
  )
}

export default Navbar
