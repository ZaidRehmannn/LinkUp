import Link from "next/link";
import Image from "next/image";
import React from "react";

const Navbar = () => {
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
      <div className="flex gap-8 mr-5">
        <Link
          href="/about"
          className="font-semibold text-green-700 hover:underline hover:text-green-800 transition"
        >
          About Us
        </Link>
        <Link
          href="/help"
          className="font-semibold text-green-700 hover:underline hover:text-green-800 transition"
        >
          Help
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
