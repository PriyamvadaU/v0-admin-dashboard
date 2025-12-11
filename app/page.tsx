"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import Header from "@/components/admin/header"
import UserListView from "@/components/admin/user-list-view"
import AllPostsView from "@/components/admin/all-posts-view"

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
  const [view, setView] = useState<"users" | "posts">("users")
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<Theme>("sage")
  const [mode, setMode] = useState<Mode>("light")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
        ])

        const usersData = await usersRes.json()
        const postsData = await postsRes.json()

        setUsers(usersData)
        setPosts(postsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
        onViewChange={setView}
        theme={theme}
        onThemeChange={setTheme}
        mode={mode}
        onModeChange={setMode}
        userCount={users.length}
      />

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin theme-spinner" />
            <p className="theme-text-muted">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {view === "users" ? (
            <UserListView users={users} posts={postsWithMetrics} postCountMap={postCountMap} />
          ) : (
            <AllPostsView posts={postsWithMetrics} users={users} />
          )}
        </>
      )}
    </div>
  )
}
