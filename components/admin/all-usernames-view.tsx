"use client"

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Search Bar */}
      <div className="mb-8 flex items-center gap-3">
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
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${
              mode === "light"
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-current-primary focus:ring-1"
                : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-current-primary focus:ring-1"
            }`}
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
          className={`px-3 py-2.5 rounded-lg text-sm font-semibold ${
            mode === "light" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-200"
          }`}
        >
          Total: {filteredUsers.length}
        </div>
      </div>

      {/* Grid of Usernames with Avatars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.length === 0 ? (
          <div
            className={`col-span-full text-center py-12 rounded-lg ${
              mode === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-700 text-gray-400"
            }`}
          >
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const photoGender = user.id % 2 === 0 ? "men" : "women"
            const photoIndex = (user.id % 50) + 1

            return (
              <div
                key={user.id}
                className={`text-center rounded-lg p-4 transition-all cursor-pointer ${
                  mode === "light"
                    ? "bg-white border border-gray-200 hover:shadow-lg hover:border-current-primary"
                    : "bg-gray-800 border border-gray-700 hover:shadow-lg hover:border-current-primary"
                }`}
              >
                {/* Circular Avatar */}
                <img
                  src={`https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2"
                  style={{ borderColor: "var(--current-primary)" }}
                />

                {/* Name and Username */}
                <h3 className={`font-semibold line-clamp-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                  {user.name}
                </h3>
                <p className={`text-sm line-clamp-1 ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}>
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
