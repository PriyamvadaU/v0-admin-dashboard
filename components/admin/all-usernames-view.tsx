"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"

interface User {
  id: number
  name: string
  username: string
}

interface AllUsernamesViewProps {
  users: User[]
}

export default function AllUsernamesView({ users }: AllUsernamesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase()
      return user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
    })
  }, [users, searchQuery])

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => a.username.localeCompare(b.username))
  }, [filteredUsers])

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      {/* Search Bar */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="flex-1 relative max-w-md">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              mode === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-10 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border-2 transition-colors ${
              mode === "light"
                ? "bg-white text-gray-900 placeholder-gray-400"
                : "bg-gray-700 text-white placeholder-gray-400"
            }`}
            style={
              {
                borderColor: "var(--current-primary)",
              } as React.CSSProperties
            }
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                mode === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div
          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-center ${
            mode === "light" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-200"
          }`}
        >
          Total: {sortedUsers.length}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {sortedUsers.length === 0 ? (
          <div
            className={`col-span-full text-center py-8 sm:py-12 rounded-lg ${
              mode === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-700 text-gray-400"
            }`}
          >
            <p className="font-medium text-sm sm:text-base">No users found</p>
          </div>
        ) : (
          sortedUsers.map((user) => {
            const photoGender = user.id % 2 === 0 ? "men" : "women"
            const photoIndex = (user.id % 50) + 1

            return (
              <div
                key={user.id}
                className={`text-center rounded-lg p-3 sm:p-4 transition-all cursor-pointer ${
                  mode === "light"
                    ? "bg-white border border-gray-200 hover:shadow-lg hover:border-current-primary"
                    : "bg-gray-800 border border-gray-700 hover:shadow-lg hover:border-current-primary"
                }`}
                style={
                  {
                    "--current-primary": "var(--current-primary)",
                  } as React.CSSProperties
                }
              >
                {/* Circular Avatar */}
                <img
                  src={`https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`}
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto mb-2 sm:mb-3 object-cover border-2"
                  style={{ borderColor: "var(--current-primary)" }}
                />

                {/* Name and Username */}
                <h3
                  className={`font-semibold text-xs sm:text-sm line-clamp-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}
                >
                  {user.name}
                </h3>
                <p
                  className={`text-xs sm:text-sm line-clamp-1 ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  @{user.username}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
