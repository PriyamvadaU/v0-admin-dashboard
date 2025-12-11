"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"

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
  commentsByPostId: Record<number, { postId: number; id: number; name: string; email: string; body: string }[]>
}

export default function UserListView({ users, posts, postCountMap, commentsByPostId }: UserListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)
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
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-colors ${
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
          className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
          style={{ backgroundColor: "var(--current-primary)" }}
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
            const photoGender = user.id % 2 === 0 ? "men" : "women"
            const photoIndex = (user.id % 50) + 1

            return (
              <div
                key={user.id}
                className={`rounded-lg border transition-all ${
                  isExpanded
                    ? mode === "light"
                      ? "bg-current-light shadow-lg"
                      : "bg-gray-700 shadow-lg"
                    : mode === "light"
                      ? "bg-white shadow-sm hover:shadow-md"
                      : "bg-gray-800 shadow-sm hover:shadow-md"
                }`}
                style={
                  {
                    borderColor: "var(--current-primary)",
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
                    {/* Avatar - Circular Photo from randomuser.me */}
                    <img
                      src={`https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2"
                      style={{ borderColor: "var(--current-primary)" }}
                    />

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

                  {/* Chevron Icon - Always Visible */}
                  <div className="ml-4 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" style={{ color: "var(--current-primary)" }} />
                    ) : (
                      <ChevronDown className="w-5 h-5" style={{ color: "var(--current-primary)" }} />
                    )}
                  </div>
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
                          userPosts.map((post) => (
                            <PostCard
                              key={post.id}
                              post={post}
                              postComments={commentsByPostId[post.id] || []}
                              expandedPostId={expandedPostId}
                              setExpandedPostId={setExpandedPostId}
                            />
                          ))
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

function PostCard({
  post,
  postComments,
  expandedPostId,
  setExpandedPostId,
}: {
  post: Post
  postComments: { postId: number; id: number; name: string; email: string; body: string }[]
  expandedPostId: number | null
  setExpandedPostId: (id: number | null) => void
}) {
  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"
  const isExpanded = expandedPostId === post.id

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
      <div className="flex items-center justify-between text-xs gap-2 mb-3">
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

      <button
        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
        className="text-xs font-semibold transition-colors"
        style={{ color: "var(--current-primary)" }}
      >
        {isExpanded ? "Hide Comments" : "View All Comments"} ({postComments.length})
      </button>

      {/* Comments Section */}
      {isExpanded && (
        <div className={`mt-4 pt-4 border-t space-y-3 ${mode === "light" ? "border-gray-200" : "border-gray-700"}`}>
          {postComments.length === 0 ? (
            <p className={`text-xs ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>No comments yet</p>
          ) : (
            postComments.map((comment) => (
              <div key={comment.id} className={`text-xs ${mode === "light" ? "" : ""}`}>
                <div className="flex items-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 text-white font-bold text-xs flex items-center justify-center"
                    style={{ backgroundColor: "var(--current-primary)" }}
                  >
                    {comment.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                      {comment.name}
                    </p>
                    <p className={`text-xs ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>{comment.email}</p>
                    <p className={`text-xs mt-1 ${mode === "light" ? "text-gray-600" : "text-gray-300"}`}>
                      {comment.body}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
