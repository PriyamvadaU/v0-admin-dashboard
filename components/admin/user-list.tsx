"use client"

import { Search, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface User {
  id: number
  name: string
  username: string
  email: string
  company: { name: string }
}

interface UserListProps {
  users: User[]
  selectedUserId: number | null
  onSelectUser: (userId: number) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  postCountMap: Record<number, number>
}

export default function UserList({
  users,
  selectedUserId,
  onSelectUser,
  searchQuery,
  onSearchChange,
  postCountMap,
}: UserListProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-9 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <Card
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedUserId === user.id
                  ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50"
                  : "hover:border-indigo-300"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                  <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{user.company.name}</p>

                  {/* Badge */}
                  <div className="mt-2">
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                      {postCountMap[user.id] || 0} posts
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
