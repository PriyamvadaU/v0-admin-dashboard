"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import Header from "@/components/admin/header"
import UserListView from "@/components/admin/user-list-view"
import AllPostsView from "@/components/admin/all-posts-view"
import AllUsernamesView from "@/components/admin/all-usernames-view"

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
}

interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

interface PostWithMetrics extends Post {
  likes: number
  comments: number
  reposts: number
  shares: number
  views: number
}

type Theme = "sage" | "lavender" | "ocean" | "sunset"
type Mode = "light" | "dark"

export default function AdminDashboard() {
  const [view, setView] = useState<"users" | "posts" | "usernames">("users")
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<Theme>("sage")
  const [mode, setMode] = useState<Mode>("light")
  const [showLoadingTransition, setShowLoadingTransition] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
          fetch("https://jsonplaceholder.typicode.com/comments"),
        ])

        const usersData = await usersRes.json()
        const postsData = await postsRes.json()
        const commentsData = await commentsRes.json()

        setUsers(usersData)
        setPosts(postsData)
        setComments(commentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewChange = (newView: "users" | "posts" | "usernames") => {
    setShowLoadingTransition(true)
    setTimeout(() => {
      setView(newView)
      setShowLoadingTransition(false)
    }, 2000)
  }

  const postsWithMetrics: PostWithMetrics[] = useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 150),
        reposts: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 80),
        views: Math.floor(Math.random() * 4500) + 500,
      })),
    [posts],
  )

  const postCountMap = useMemo(() => {
    const map: Record<number, number> = {}
    posts.forEach((post) => {
      map[post.userId] = (map[post.userId] || 0) + 1
    })
    return map
  }, [posts])

  const commentsByPostId = useMemo(() => {
    const map: Record<number, Comment[]> = {}
    comments.forEach((comment) => {
      if (!map[comment.postId]) map[comment.postId] = []
      map[comment.postId].push(comment)
    })
    return map
  }, [comments])

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={
        {
          "--theme": theme,
          "--mode": mode,
        } as React.CSSProperties & { "--theme": string; "--mode": string }
      }
      data-theme={theme}
      data-mode={mode}
    >
      <Header
        view={view}
        onViewChange={handleViewChange}
        theme={theme}
        onThemeChange={setTheme}
        mode={mode}
        onModeChange={setMode}
        userCount={users.length}
        postCount={posts.length}
      />

      {loading || showLoadingTransition ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin theme-spinner" />
            <p className="theme-text-muted">{loading ? "Loading dashboard..." : "Loading view..."}</p>
          </div>
        </div>
      ) : (
        <>
          {view === "users" ? (
            <UserListView
              users={users}
              posts={postsWithMetrics}
              postCountMap={postCountMap}
              commentsByPostId={commentsByPostId}
            />
          ) : view === "posts" ? (
            <AllPostsView posts={postsWithMetrics} users={users} commentsByPostId={commentsByPostId} />
          ) : (
            <AllUsernamesView users={users} />
          )}
        </>
      )}

      <footer
        className="text-center py-4 text-xs font-medium transition-colors"
        style={{ color: "var(--text-secondary-light)" }}
      >
        <p>Profile photos provided by RandomUser.me API</p>
      </footer>
    </div>
  )
}
