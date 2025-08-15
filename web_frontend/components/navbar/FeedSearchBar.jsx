"use client"

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import axios from '@/lib/axios';
import useUserStore from '@/stores/userStore';
import ExploreUserCard from '../feed/leftSidebar/ExploreUserCard';

const FeedSearchBar = () => {
  const token = useUserStore(state => state.token);
  const [query, setquery] = useState("");
  const [results, setresults] = useState([]);

  const resetOnSelect = () => {
    setquery("");
    setresults([]);
  }

  useEffect(() => {
    if (!token) return;

    if (query.trim().length === 0) {
      setresults([]);
      return;
    }

    // wait 0.3 second before firing API for optimization
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/search?q=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setresults(response.data.users);
        }
      } catch (error) {
        console.error("Search users error:", error);
      }
    }, 300);

    // clear timeout if user keeps typing
    return () => clearTimeout(timeoutId);
  }, [query, token]);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-full px-4 py-2 shadow-sm">
        <Search className="h-5 w-5 text-gray-500 dark:text-gray-700" />
        <input
          type="text"
          value={query}
          onChange={(e) => setquery(e.target.value)}
          placeholder="Search LinkUp..."
          className="text-black ml-3 bg-transparent outline-none flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
        />
      </div>

      {results.length > 0 && (
        <ul className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto z-50">
          {results.map((user) => (
            <li key={user._id} onClick={resetOnSelect}>
              <ExploreUserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FeedSearchBar
