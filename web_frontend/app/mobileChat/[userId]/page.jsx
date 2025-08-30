import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const page = () => {
    const params = useParams();
    const router = useRouter();
    const { userId } = params;

    return (
        <main className="h-[calc(100vh-4rem)] pt-16 py-4 w-11/12 mx-auto flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white shadow-md">
                <button
                    onClick={() => router.back()}
                    className="p-1 rounded-md hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold">Chat</h1>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto">
                <ChatWindow userId={id} />
            </div>
        </main>
    )
}

export default page
