"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Search, X, SortAsc } from "lucide-react"

interface User {
  id: number
  name: string
  username: string
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

interface AllPostsViewProps {
  posts: Post[]
  users: User[]
  commentsByPostId: Record<number, { postId: number; id: number; name: string; email: string; body: string }[]>
}

type SortOption = "comments" | "likes" | "recent" | "interactions"

export default function AllPostsView({ posts, users, commentsByPostId }: AllPostsViewProps) {
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("recent")

  const userMap = useMemo(() => {
    const map: Record<number, User> = {}
    users.forEach((user) => {
      map[user.id] = user
    })
    return map
  }, [users])

  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"

  const extractHashtags = (text: string): string[] => {
    const regex = /#\w+/g
    return text.match(regex) || []
  }

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts

    const query = searchQuery.toLowerCase()

    return posts.filter((post) => {
      // Hashtag search
      if (query.startsWith("#")) {
        const hashtags = extractHashtags(post.body.toLowerCase())
        return hashtags.includes(query)
      }

      // Text search in title and body
      return post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
    })
  }, [posts, searchQuery])

  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts]

    switch (sortBy) {
      case "comments":
        return sorted.sort((a, b) => b.comments - a.comments)
      case "likes":
        return sorted.sort((a, b) => b.likes - a.likes)
      case "recent":
        return sorted.sort((a, b) => b.id - a.id)
      case "interactions":
        return sorted.sort((a, b) => {
          const aTotal = a.likes + a.comments + a.shares
          const bTotal = b.likes + b.comments + b.shares
          return bTotal - aTotal
        })
      default:
        return sorted
    }
  }, [filteredPosts, sortBy])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const renderBodyWithHashtags = (body: string) => {
    const parts = body.split(/(#\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span
            key={index}
            className="font-semibold cursor-pointer hover:underline"
            style={{ color: "var(--current-primary)" }}
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <div className="mb-4 md:mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                mode === "light" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search posts by text or #hashtag..."
              value={searchQuery}
              onChange={handleSearchChange}
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
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white whitespace-nowrap text-center"
            style={{ backgroundColor: "var(--current-primary)" }}
          >
            Total: {sortedPosts.length}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <SortAsc className="w-4 h-4" style={{ color: "var(--current-primary)" }} />
          <span className="text-xs sm:text-sm font-medium" style={{ color: mode === "light" ? "#6b7280" : "#d1d5db" }}>
            Sort by:
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "recent", label: "Most Recent" },
              { value: "comments", label: "Most Comments" },
              { value: "likes", label: "Most Likes" },
              { value: "interactions", label: "Most Interactions" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? "text-white"
                    : mode === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-300 hover:text-white"
                }`}
                style={{
                  backgroundColor:
                    sortBy === option.value ? "var(--current-primary)" : mode === "light" ? "#f3f4f6" : "#374151",
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pb-6`}>
        {sortedPosts.length === 0 ? (
          <div
            className={`text-center py-8 sm:py-12 rounded-lg ${
              mode === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-700 text-gray-400"
            }`}
          >
            <p className="font-medium text-sm sm:text-base">No posts found</p>
          </div>
        ) : (
          sortedPosts.map((post) => {
            const author = userMap[post.userId]
            const photoGender = post.userId % 2 === 0 ? "men" : "women"
            const photoIndex = (post.userId % 50) + 1
            const isExpanded = expandedPostId === post.id
            const postComments = commentsByPostId[post.id] || []

            return (
              <div
                key={post.id}
                className={`p-4 sm:p-6 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
                  mode === "light"
                    ? "bg-white border-gray-200 hover:border-current-primary"
                    : "bg-gray-800 border-gray-700 hover:border-current-primary"
                }`}
                style={
                  {
                    "--current-primary": "var(--current-primary)",
                  } as React.CSSProperties
                }
              >
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`}
                    alt={author?.name || "Unknown"}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 object-cover border-2"
                    style={{ borderColor: "var(--current-primary)" }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`font-semibold text-sm sm:text-base truncate ${mode === "light" ? "text-gray-900" : "text-white"}`}
                    >
                      {author?.name || "Unknown"}
                    </h4>
                    <p className={`text-xs truncate ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                      @{author?.username || "unknown"}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <h3
                  className={`text-base sm:text-lg font-semibold mb-2 capitalize line-clamp-2 ${
                    mode === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {post.title}
                </h3>
                <p
                  className={`leading-relaxed line-clamp-3 mb-4 text-sm sm:text-base ${mode === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  {renderBodyWithHashtags(post.body)}
                </p>

                {/* Interaction Metrics */}
                <div className="flex items-center justify-between text-xs sm:text-sm gap-2 sm:gap-3 flex-wrap mb-4">
                  <div className="flex items-center gap-1">
                    <span style={{ color: "var(--current-primary)" }}>❤️</span>
                    <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: "var(--current-primary)" }}>💬</span>
                    <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>
                      {post.comments} comments
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: "var(--current-primary)" }}>🔄</span>
                    <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.reposts} reposts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: "var(--current-primary)" }}>📤</span>
                    <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.shares} shares</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: "var(--current-primary)" }}>👁️</span>
                    <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.views} views</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="text-xs sm:text-sm font-semibold transition-colors"
                  style={{ color: "var(--current-primary)" }}
                >
                  {isExpanded ? "Hide Comments" : "View All Comments"} ({postComments.length})
                </button>

                {/* Comments Section */}
                {isExpanded && (
                  <div
                    className={`mt-4 pt-4 border-t space-y-3 ${mode === "light" ? "border-gray-200" : "border-gray-700"}`}
                  >
                    {postComments.length === 0 ? (
                      <p className={`text-xs sm:text-sm ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                        No comments yet
                      </p>
                    ) : (
                      postComments.map((comment) => (
                        <div key={comment.id} className={`text-xs sm:text-sm ${mode === "light" ? "" : ""}`}>
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0 text-white font-bold text-xs flex items-center justify-center"
                              style={{ backgroundColor: "var(--current-primary)" }}
                            >
                              {comment.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-semibold text-xs sm:text-sm ${mode === "light" ? "text-gray-900" : "text-white"}`}
                              >
                                {comment.name}
                              </p>
                              <p className={`text-xs ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                                {comment.email}
                              </p>
                              <p
                                className={`text-xs sm:text-sm mt-1 ${mode === "light" ? "text-gray-600" : "text-gray-300"}`}
                              >
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
          })
        )}
      </div>
    </div>
  )
}
