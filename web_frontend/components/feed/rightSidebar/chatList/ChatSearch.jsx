'use client'

import { searchService } from '@/services/searchService';
import { Search } from 'lucide-react';
import React, { useEffect } from 'react';

const ChatSearch = ({ setsearchResults, query, setquery, token }) => {
    useEffect(() => {
        if (!token) return;

        if (query.trim().length === 0) {
            setsearchResults([]);
            return;
        }

        // wait 0.3 second before firing API for optimization
        const timeoutId = setTimeout(async () => {
            try {
                const result = await searchService.searchChats(query, token);
                if (result.success) {
                    setsearchResults(result.chatUsers);
                }
            } catch (error) {
                console.error("Search users error:", error);
            }
        }, 300);

        // clear timeout if user keeps typing
        return () => clearTimeout(timeoutId);
    }, [query, token]);

    return (
        <div className="flex items-center bg-white dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-full p-2 shadow-sm">
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-700 ml-1" />
            <input
                type="text"
                value={query}
                onChange={(e) => setquery(e.target.value)}
                placeholder="Search Chats..."
                className="text-black ml-3 bg-transparent outline-none flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
            />
        </div>
    )
}

export default ChatSearch
