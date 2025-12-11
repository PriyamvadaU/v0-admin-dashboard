"use client"

import type React from "react"

import { useState, useMemo } from "react"

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

export default function AllPostsView({ posts, users, commentsByPostId }: AllPostsViewProps) {
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)

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
          const photoGender = post.userId % 2 === 0 ? "men" : "women"
          const photoIndex = (post.userId % 50) + 1
          const isExpanded = expandedPostId === post.id
          const postComments = commentsByPostId[post.id] || []

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
                <img
                  src={`https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`}
                  alt={author?.name || "Unknown"}
                  className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2"
                  style={{ borderColor: "var(--current-primary)" }}
                />
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
              <div className="flex items-center justify-between text-sm gap-3 flex-wrap mb-4">
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

              <button
                onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                className="text-sm font-semibold transition-colors"
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
                    <p className={`text-sm ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>No comments yet</p>
                  ) : (
                    postComments.map((comment) => (
                      <div key={comment.id} className={`text-sm ${mode === "light" ? "" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex-shrink-0 text-white font-bold text-xs flex items-center justify-center"
                            style={{ backgroundColor: "var(--current-primary)" }}
                          >
                            {comment.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                              {comment.name}
                            </p>
                            <p className={`text-xs ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                              {comment.email}
                            </p>
                            <p className={`text-sm mt-1 ${mode === "light" ? "text-gray-600" : "text-gray-300"}`}>
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
        })}
      </div>
    </div>
  )
}
