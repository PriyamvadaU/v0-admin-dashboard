"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string; catchPhrase: string }
  address: { street: string; city: string; zipcode: string }
}

interface Post {
  userId: number
  id: number
  title: string
  body: string
  likes: number
  comments: number
  reposts: number
  shares: number
  views: number
}

interface UserListViewProps {
  users: User[]
  posts: Post[]
  postCountMap: Record<number, number>
}

export default function UserListView({ users, posts, postCountMap }: UserListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)
  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [users, searchQuery])

  const userPostsMap = useMemo(() => {
    const map: Record<number, Post[]> = {}
    posts.forEach((post) => {
      if (!map[post.userId]) map[post.userId] = []
      map[post.userId].push(post)
    })
    return map
  }, [posts])

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              mode === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${
              mode === "light"
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-current-primary focus:ring-1"
                : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-current-primary focus:ring-1"
            }`}
            style={
              {
                "--current-primary": "var(--current-primary)",
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
          className={`px-3 py-2.5 rounded-lg text-sm font-semibold ${
            mode === "light" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-200"
          }`}
        >
          Total: {filteredUsers.length}
        </div>
      </div>

      {/* User Cards - Accordion Style */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg ${
              mode === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-700 text-gray-400"
            }`}
          >
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isExpanded = expandedUserId === user.id
            const userPosts = userPostsMap[user.id] || []

            return (
              <div
                key={user.id}
                className={`rounded-lg border transition-all ${
                  isExpanded
                    ? mode === "light"
                      ? "border-current-primary bg-current-light shadow-lg"
                      : "border-current-primary bg-gray-700 shadow-lg"
                    : mode === "light"
                      ? "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-current-primary"
                      : "border-gray-600 bg-gray-800 shadow-sm hover:shadow-md hover:border-current-primary"
                }`}
                style={
                  {
                    "--current-primary": "var(--current-primary)",
                    "--current-light": "var(--current-light)",
                  } as React.CSSProperties
                }
              >
                {/* User Header - Always Visible */}
                <button
                  onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                  className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                      style={{ backgroundColor: "var(--current-primary)" }}
                    >
                      {user.name.charAt(0)}
                    </div>

                    {/* User Info */}
                    <div className="text-left">
                      <h3 className={`font-semibold text-lg ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        @{user.username}
                      </p>
                    </div>

                    {/* Post Count Badge */}
                    <div
                      className="ml-auto px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: "var(--current-primary)" }}
                    >
                      {postCountMap[user.id] || 0} posts
                    </div>
                  </div>

                  {/* Chevron Icon */}
                  <div className="ml-4">{isExpanded ? "▼" : "▶"}</div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div
                    className={`border-t px-4 py-4 space-y-4 ${
                      mode === "light" ? "border-gray-200 bg-current-light" : "border-gray-600"
                    }`}
                    style={
                      {
                        "--current-light": "var(--current-light)",
                      } as React.CSSProperties
                    }
                  >
                    {/* User Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Email
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 break-all ${
                            mode === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Phone
                        </p>
                        <p className={`text-sm font-medium mt-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                          {user.phone}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Website
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 truncate ${
                            mode === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {user.website}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Company
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 truncate ${
                            mode === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {user.company.name}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Address
                        </p>
                        <p className={`text-sm font-medium mt-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                          {user.address.street}, {user.address.city} {user.address.zipcode}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Company Catchphrase
                        </p>
                        <p className={`text-sm font-medium mt-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                          "{user.company.catchPhrase}"
                        </p>
                      </div>
                    </div>

                    {/* User Posts */}
                    <div className="border-t pt-4">
                      <h4 className={`font-semibold text-sm mb-4 ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                        Posts ({userPosts.length})
                      </h4>
                      <div className="space-y-3">
                        {userPosts.length === 0 ? (
                          <p className={`text-sm ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            No posts from this user
                          </p>
                        ) : (
                          userPosts.map((post) => <PostCard key={post.id} post={post} />)
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        mode === "light" ? "bg-white border-gray-200 hover:shadow-md" : "bg-gray-800 border-gray-700 hover:shadow-md"
      }`}
    >
      <h5
        className={`font-semibold text-sm line-clamp-2 mb-2 capitalize ${
          mode === "light" ? "text-gray-900" : "text-white"
        }`}
      >
        {post.title}
      </h5>
      <p className={`text-sm line-clamp-2 mb-3 ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}>{post.body}</p>

      {/* Interaction Metrics */}
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1">
          <span style={{ color: "var(--current-primary)" }}>❤️</span>
          <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: "var(--current-primary)" }}>💬</span>
          <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: "var(--current-primary)" }}>🔄</span>
          <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.reposts}</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: "var(--current-primary)" }}>📤</span>
          <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.shares}</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: "var(--current-primary)" }}>👁️</span>
          <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.views}</span>
        </div>
      </div>
    </div>
  )
}
