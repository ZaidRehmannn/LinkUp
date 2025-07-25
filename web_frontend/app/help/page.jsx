import React from 'react'
import { LockIcon, PencilIcon, UsersIcon, SmartphoneIcon } from "lucide-react";

const page = () => {
  return (
    <main className="px-6 md:px-20 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-5">Help & Support</h1>

      <section className="mb-5">
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          Need assistance or have questions about using LinkUp? You're in the right place.
          Whether you're having trouble with your account or just want to understand how something works,
          we're here to help.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-500 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <span className='flex items-center gap-3'>
              <LockIcon className="text-blue-700 dark:text-blue-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">How do I reset my password?</h4>
            </span>
            <p className="text-gray-600 dark:text-gray-300">
              Go to the login page and click on "Forgot Password". Follow the instructions sent to your email to reset it.
            </p>
          </div>

          <div>
            <span className='flex items-center gap-3'>
              <PencilIcon className="text-blue-700 dark:text-blue-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">How can I create a post?</h4>
            </span>
            <p className="text-gray-600 dark:text-gray-300">
              After logging in, navigate to your feed and click on the "Create Post" button. Add your content and hit publish!
            </p>
          </div>

          <div>
            <span className='flex items-center gap-3'>
              <UsersIcon className="text-blue-700 dark:text-blue-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">How do I connect with others?</h4>
            </span>
            <p className="text-gray-600 dark:text-gray-300">
              Search for users by name or explore suggested profiles on your feed. You can follow, like, or start chatting instantly.
            </p>
          </div>

          <div>
            <span className='flex items-center gap-3'>
              <SmartphoneIcon className="text-blue-700 dark:text-blue-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">Is LinkUp available on mobile?</h4>
            </span>
            <p className="text-gray-600 dark:text-gray-300">
              We're working on mobile apps for iOS and Android. Stay tuned!
            </p>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-500 mb-4">Still Need Help?</h2>
        <p className="text-gray-700 dark:text-gray-100 mb-2">
          If you didn't find what you were looking for, feel free to reach out to us.
        </p>
        <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside">
          <li>Email us at <span className="font-medium text-blue-700 dark:text-blue-500">support@linkup.com</span></li>
        </ul>
      </section>
    </main>
  )
}

export default page
