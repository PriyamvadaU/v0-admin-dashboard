"use client"

import type React from "react"

import { useMemo } from "react"

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
}

export default function AllPostsView({ posts, users }: AllPostsViewProps) {
  const userMap = useMemo(() => {
    const map: Record<number, User> = {}
    users.forEach((user) => {
      map[user.id] = user
    })
    return map
  }, [users])

  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className={`space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pb-6`}>
        {posts.map((post) => {
          const author = userMap[post.userId]

          return (
            <div
              key={post.id}
              className={`p-6 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
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
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                  style={{ backgroundColor: "var(--current-primary)" }}
                >
                  {author?.name.charAt(0) || "?"}
                </div>
                <div>
                  <h4 className={`font-semibold ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                    {author?.name || "Unknown"}
                  </h4>
                  <p className={`text-xs ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    @{author?.username || "unknown"}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <h3
                className={`text-lg font-semibold mb-2 capitalize line-clamp-2 ${
                  mode === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {post.title}
              </h3>
              <p
                className={`leading-relaxed line-clamp-3 mb-4 ${mode === "light" ? "text-gray-700" : "text-gray-300"}`}
              >
                {post.body}
              </p>

              {/* Interaction Metrics */}
              <div className="flex items-center justify-between text-sm gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <span style={{ color: "var(--current-primary)" }}>❤️</span>
                  <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ color: "var(--current-primary)" }}>💬</span>
                  <span className={mode === "light" ? "text-gray-700" : "text-gray-300"}>{post.comments} comments</span>
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
