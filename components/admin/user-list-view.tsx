"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Search, X, ChevronDown, ChevronUp, SortAsc, BarChart3, TrendingUp } from "lucide-react"

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

type SortOption = "name" | "active" | "comments" | "interactions"
type UserPostSortOption =
  | "chronological"
  | "mostLiked"
  | "leastLiked"
  | "mostCommented"
  | "mostPopularTopic"
  | "leastPopularTopic"
  | "mostShared"
  | "mostViewed"

export default function UserListView({ users, posts, postCountMap, commentsByPostId }: UserListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [userPostSortMap, setUserPostSortMap] = useState<Record<number, UserPostSortOption>>({})
  const mode = typeof window !== "undefined" ? document.documentElement.getAttribute("data-mode") : "light"

  const extractHashtags = (text: string): string[] => {
    const regex = /#\w+/g
    return text.match(regex) || []
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase()

      if (query.startsWith("#")) {
        const userPosts = posts.filter((p) => p.userId === user.id)
        return userPosts.some((post) => {
          const hashtags = extractHashtags(post.body.toLowerCase())
          return hashtags.includes(query)
        })
      }

      return (
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [users, searchQuery, posts])

  const userPostsMap = useMemo(() => {
    const map: Record<number, Post[]> = {}
    posts.forEach((post) => {
      if (!map[post.userId]) map[post.userId] = []
      map[post.userId].push(post)
    })
    return map
  }, [posts])

  const userStatsMap = useMemo(() => {
    const stats: Record<
      number,
      {
        avgInteractions: number
        mostLikedPost: { title: string; likes: number } | null
        avgPostsPerMonth: number
        totalComments: number
        totalLikes: number
        reachabilityScore: number
      }
    > = {}

    users.forEach((user) => {
      const userPosts = userPostsMap[user.id] || []
      if (userPosts.length === 0) {
        stats[user.id] = {
          avgInteractions: 0,
          mostLikedPost: null,
          avgPostsPerMonth: 0,
          totalComments: 0,
          totalLikes: 0,
          reachabilityScore: 0,
        }
        return
      }

      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0)
      const totalComments = userPosts.reduce((sum, post) => sum + post.comments, 0)
      const totalShares = userPosts.reduce((sum, post) => sum + post.shares, 0)
      const totalViews = userPosts.reduce((sum, post) => sum + post.views, 0)
      const totalInteractions = totalLikes + totalComments + totalShares

      const avgInteractions = Math.round(totalInteractions / userPosts.length)
      const avgPostsPerMonth = Math.round((userPosts.length / 12) * 10) / 10

      const mostLikedPost = userPosts.reduce((max, post) => (post.likes > (max?.likes || 0) ? post : max), userPosts[0])

      const reachabilityScore = Math.round((totalViews * (totalInteractions / userPosts.length)) / 10)

      stats[user.id] = {
        avgInteractions,
        mostLikedPost: mostLikedPost ? { title: mostLikedPost.title, likes: mostLikedPost.likes } : null,
        avgPostsPerMonth,
        totalComments,
        totalLikes,
        reachabilityScore,
      }
    })

    return stats
  }, [users, userPostsMap])

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers]

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "active":
        return sorted.sort((a, b) => (postCountMap[b.id] || 0) - (postCountMap[a.id] || 0))
      case "comments":
        return sorted.sort((a, b) => userStatsMap[b.id].totalComments - userStatsMap[a.id].totalComments)
      case "interactions":
        return sorted.sort((a, b) => userStatsMap[b.id].avgInteractions - userStatsMap[a.id].avgInteractions)
      default:
        return sorted
    }
  }, [filteredUsers, sortBy, postCountMap, userStatsMap])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleUserPostSort = useCallback((userId: number, sortOption: UserPostSortOption) => {
    setUserPostSortMap((prev) => ({ ...prev, [userId]: sortOption }))
  }, [])

  const getSortedUserPosts = useCallback(
    (userId: number, userPosts: Post[]) => {
      const sortOption = userPostSortMap[userId] || "chronological"
      const sorted = [...userPosts]

      switch (sortOption) {
        case "mostLiked":
          return sorted.sort((a, b) => b.likes - a.likes)
        case "leastLiked":
          return sorted.sort((a, b) => a.likes - b.likes)
        case "mostCommented":
          return sorted.sort((a, b) => b.comments - a.comments)
        case "mostShared":
          return sorted.sort((a, b) => b.shares - a.shares)
        case "mostViewed":
          return sorted.sort((a, b) => b.views - a.views)
        case "mostPopularTopic": {
          const hashtagFrequency: Record<string, number> = {}
          userPosts.forEach((post) => {
            const hashtags = extractHashtags(post.body.toLowerCase())
            hashtags.forEach((tag) => {
              hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1
            })
          })

          return sorted.sort((a, b) => {
            const aHashtags = extractHashtags(a.body.toLowerCase())
            const bHashtags = extractHashtags(b.body.toLowerCase())
            const aScore = aHashtags.reduce((sum, tag) => sum + (hashtagFrequency[tag] || 0), 0)
            const bScore = bHashtags.reduce((sum, tag) => sum + (hashtagFrequency[tag] || 0), 0)
            return bScore - aScore || b.likes + b.comments - (a.likes + a.comments)
          })
        }
        case "leastPopularTopic": {
          const hashtagFrequency: Record<string, number> = {}
          userPosts.forEach((post) => {
            const hashtags = extractHashtags(post.body.toLowerCase())
            hashtags.forEach((tag) => {
              hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1
            })
          })

          return sorted.sort((a, b) => {
            const aHashtags = extractHashtags(a.body.toLowerCase())
            const bHashtags = extractHashtags(b.body.toLowerCase())
            const aScore = aHashtags.reduce((sum, tag) => sum + (hashtagFrequency[tag] || 0), 0)
            const bScore = bHashtags.reduce((sum, tag) => sum + (hashtagFrequency[tag] || 0), 0)
            return aScore - bScore || a.likes + a.comments - (b.likes + b.comments)
          })
        }
        case "chronological":
        default:
          return sorted
      }
    },
    [userPostSortMap],
  )

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      {/* Search Bar and Sort Options */}
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
              placeholder="Search by name, email, username, or #hashtag..."
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
            Total: {sortedUsers.length}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SortAsc className="w-4 h-4" style={{ color: "var(--current-primary)" }} />
          <span className="text-xs sm:text-sm font-medium" style={{ color: mode === "light" ? "#6b7280" : "#d1d5db" }}>
            Sort by:
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "name", label: "Name (A-Z)" },
              { value: "active", label: "Most Active" },
              { value: "comments", label: "Most Comments" },
              { value: "interactions", label: "Most Interactions" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-base font-medium transition-colors ${
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

      {/* User Cards - Accordion Style */}
      <div className="space-y-3">
        {sortedUsers.length === 0 ? (
          <div
            className={`text-center py-8 sm:py-12 rounded-lg ${
              mode === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-700 text-gray-400"
            }`}
          >
            <p className="font-medium text-sm sm:text-base">No users found</p>
          </div>
        ) : (
          sortedUsers.map((user) => {
            const isExpanded = expandedUserId === user.id
            const userPosts = userPostsMap[user.id] || []
            const userStats = userStatsMap[user.id]
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
                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Avatar - Circular Photo from randomuser.me */}
                    <img
                      src={`https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`}
                      alt={user.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 object-cover border-2"
                      style={{ borderColor: "var(--current-primary)" }}
                    />

                    {/* User Info */}
                    <div className="text-left min-w-0 flex-1">
                      <h3
                        className={`font-semibold text-sm sm:text-base md:text-lg truncate ${mode === "light" ? "text-gray-900" : "text-white"}`}
                      >
                        {user.name}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm truncate ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}
                      >
                        @{user.username}
                      </p>
                    </div>

                    {/* Post Count Badge */}
                    <div
                      className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white whitespace-nowrap flex-shrink-0"
                      style={{ backgroundColor: "var(--current-primary)" }}
                    >
                      {postCountMap[user.id] || 0} posts
                    </div>
                  </div>

                  {/* Chevron Icon - Always Visible */}
                  <div className="ml-2 sm:ml-4 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--current-primary)" }} />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--current-primary)" }} />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div
                    className={`border-t px-3 sm:px-4 py-3 sm:py-4 space-y-4 ${
                      mode === "light" ? "border-gray-200 bg-current-light" : "border-gray-600"
                    }`}
                    style={
                      {
                        "--current-light": "var(--current-light)",
                      } as React.CSSProperties
                    }
                  >
                    <div className="mb-4">
                      <h4
                        className={`font-semibold text-sm mb-3 flex items-center gap-2 ${mode === "light" ? "text-gray-900" : "text-white"}`}
                      >
                        <BarChart3 className="w-4 h-4" style={{ color: "var(--current-primary)" }} />
                        User Statistics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                        {/* Average Interactions */}
                        <div
                          className={`p-2 sm:p-3 rounded-lg border ${
                            mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "var(--current-primary)" }} />
                            <p
                              className={`text-xs font-semibold ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Avg Interactions
                            </p>
                          </div>
                          <p
                            className={`text-lg sm:text-xl font-bold ${mode === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userStats?.avgInteractions || 0}
                          </p>
                        </div>

                        {/* Most Liked Post */}
                        <div
                          className={`p-2 sm:p-3 rounded-lg border ${
                            mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base">❤️</span>
                            <p
                              className={`text-xs font-semibold ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Most Liked Post
                            </p>
                          </div>
                          <p
                            className={`text-xs sm:text-sm font-medium line-clamp-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userStats?.mostLikedPost?.title || "N/A"}
                          </p>
                          <p className={`text-xs ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}>
                            {userStats?.mostLikedPost?.likes || 0} likes
                          </p>
                        </div>

                        {/* Avg Posts Per Month */}
                        <div
                          className={`p-2 sm:p-3 rounded-lg border ${
                            mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base">📅</span>
                            <p
                              className={`text-xs font-semibold ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Posts/Month
                            </p>
                          </div>
                          <p
                            className={`text-lg sm:text-xl font-bold ${mode === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userStats?.avgPostsPerMonth || 0}
                          </p>
                        </div>

                        {/* Total Comments */}
                        <div
                          className={`p-2 sm:p-3 rounded-lg border ${
                            mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base">💬</span>
                            <p
                              className={`text-xs font-semibold ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Total Comments
                            </p>
                          </div>
                          <p
                            className={`text-lg sm:text-xl font-bold ${mode === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userStats?.totalComments || 0}
                          </p>
                        </div>

                        {/* Total Likes */}
                        <div
                          className={`p-2 sm:p-3 rounded-lg border ${
                            mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base">❤️</span>
                            <p
                              className={`text-xs font-semibold ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Total Likes
                            </p>
                          </div>
                          <p
                            className={`text-lg sm:text-xl font-bold ${mode === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userStats?.totalLikes || 0}
                          </p>
                        </div>

                        {/* Reachability Score */}
                        <div
                          className={`p-2 sm:p-3 rounded-lg border ${
                            mode === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base">🎯</span>
                            <p
                              className={`text-xs font-semibold ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Reach Score
                            </p>
                          </div>
                          <p
                            className={`text-lg sm:text-xl font-bold ${mode === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userStats?.reachabilityScore || 0}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Email
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-medium mt-1 break-all ${
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
                        <p
                          className={`text-xs sm:text-sm font-medium mt-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}
                        >
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
                          className={`text-xs sm:text-sm font-medium mt-1 truncate ${
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
                          className={`text-xs sm:text-sm font-medium mt-1 truncate ${
                            mode === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {user.company.name}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Address
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-medium mt-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {user.address.street}, {user.address.city} {user.address.zipcode}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p
                          className={`text-xs font-semibold uppercase ${
                            mode === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Company Catchphrase
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-medium mt-1 ${mode === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          "{user.company.catchPhrase}"
                        </p>
                      </div>
                    </div>

                    {/* Individual Post Sort Bar */}
                    <div className="border-t pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                        <label
                          className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                            mode === "light" ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          Sort Posts By:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "chronological", label: "Chronological", icon: "📅" },
                            { value: "mostLiked", label: "Most Liked", icon: "❤️" },
                            { value: "leastLiked", label: "Least Liked", icon: "💔" },
                            { value: "mostCommented", label: "Most Commented", icon: "💬" },
                            { value: "mostPopularTopic", label: "Popular Topic", icon: "🔥" },
                            { value: "leastPopularTopic", label: "Niche Topic", icon: "🌱" },
                            { value: "mostShared", label: "Most Shared", icon: "📤" },
                            { value: "mostViewed", label: "Most Viewed", icon: "👁️" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleUserPostSort(user.id, option.value as UserPostSortOption)}
                              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all ${
                                (userPostSortMap[user.id] || "chronological") === option.value
                                  ? "text-white shadow-md"
                                  : mode === "light"
                                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    : "bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
                              }`}
                              style={
                                (userPostSortMap[user.id] || "chronological") === option.value
                                  ? { backgroundColor: "var(--current-primary)" }
                                  : {}
                              }
                            >
                              <span className="text-xs">{option.icon}</span>
                              <span className="hidden sm:inline">{option.label}</span>
                              <span className="sm:hidden">{option.label.split(" ")[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* User Posts */}
                    <div className="border-t pt-4">
                      <h4 className={`font-semibold text-sm mb-4 ${mode === "light" ? "text-gray-900" : "text-white"}`}>
                        Posts ({userPosts.length})
                      </h4>
                      <div className="space-y-3">
                        {userPosts.length === 0 ? (
                          <p className={`text-xs ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            No posts from this user
                          </p>
                        ) : (
                          getSortedUserPosts(user.id, userPosts).map((post) => (
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

  const renderBodyWithHashtags = (body: string) => {
    const parts = body.split(/(#\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span key={index} className="font-semibold" style={{ color: "var(--current-primary)" }}>
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div
      className={`p-3 sm:p-4 rounded-lg border transition-all ${
        mode === "light" ? "bg-white border-gray-200 hover:shadow-md" : "bg-gray-800 border-gray-700 hover:shadow-md"
      }`}
    >
      <h5
        className={`font-semibold text-xs sm:text-sm line-clamp-2 mb-2 capitalize ${
          mode === "light" ? "text-gray-900" : "text-white"
        }`}
      >
        {post.title}
      </h5>
      <p className={`text-xs sm:text-sm line-clamp-2 mb-3 ${mode === "light" ? "text-gray-600" : "text-gray-400"}`}>
        {renderBodyWithHashtags(post.body)}
      </p>

      {/* Interaction Metrics */}
      <div className="flex items-center justify-between text-xs gap-2 mb-3 flex-wrap">
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
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 text-white font-bold text-xs flex items-center justify-center"
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
