'use client'

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isHelp = pathname === "/help";

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

      {/* Right Side - Links */}
      <div className="flex items-center gap-8 mr-5">
        {(isAbout || isHelp) && (
          <Link
            href="/"
            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline hover:underline-offset-4 transition"
          >
            <span className="flex items-center gap-1">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </span>
          </Link>
        )}

        <Link
          href="/about"
          className={`font-semibold text-blue-700 transition ${isAbout ? "underline underline-offset-4 decoration-2" : "hover:underline hover:underline-offset-4 hover:text-blue-800"}`}
        >
          About Us
        </Link>
        <Link
          href="/help"
          className={`font-semibold text-blue-700 transition ${isHelp ? "underline underline-offset-4 decoration-2" : "hover:underline hover:underline-offset-4 hover:text-blue-800"}`}
        >
          Help & Support
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
