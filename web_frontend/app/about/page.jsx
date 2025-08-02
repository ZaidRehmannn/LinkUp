import Link from 'next/link'
import React from 'react'
import { FileText, Users, MessageCircle, ShieldCheck } from 'lucide-react'

const page = () => {
  return (
    <main className="px-6 md:px-20 py-10 pt-28 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">About LinkUp</h1>

      <section className="mb-5">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Who We Are</h4>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          At LinkUp, we're passionate about bringing people together. Whether you're sharing moments,
          finding like-minded individuals, or growing your personal network, LinkUp is your space to connect
          authentically and meaningfully.
        </p>
      </section>

      <section className="mb-5">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Our Mission</h4>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          To empower individuals to build communities, express themselves freely, and engage in real-time
          conversations — all on a fast, modern, and secure platform.
        </p>
      </section>

      <section className="mb-5">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Why LinkUp?</h4>
        <ol className="space-y-4">
          <li className="flex items-center gap-3">
            <FileText className="text-blue-700 dark:text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">Create and share posts effortlessly</span>
          </li>
          <li className="flex items-center gap-3">
            <Users className="text-blue-700 dark:text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">Build genuine connections with others</span>
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle className="text-blue-700 dark:text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">Chat in real-time with a smooth, intuitive interface</span>
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheck className="text-blue-700 dark:text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">Privacy-focused — your data stays yours</span>
          </li>
        </ol>
      </section>

      <section className="mb-5">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Our Vision</h4>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          We envision a digital space where social media goes beyond likes and follows —
          a place where real conversations and real connections thrive.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-500 mb-2">Want to be part of the journey?</h3>
        <p className="text-gray-600 dark:text-gray-300">
          <Link href='/auth/signup' className='text-blue-800 dark:text-blue-400 font-semibold'>Join us today</Link> and help shape the future of social connection.
        </p>
      </section>
    </main>
  )
}

export default page
