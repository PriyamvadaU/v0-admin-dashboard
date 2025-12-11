"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string }
}

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

interface UserDetailsProps {
  selectedUser: User | null
  posts: Post[]
  onClose: () => void
}

export default function UserDetails({ selectedUser, posts, onClose }: UserDetailsProps) {
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)

  if (!selectedUser) {
    return null
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold">{selectedUser.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
            <p className="text-indigo-100">@{selectedUser.username}</p>
          </div>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Details Grid */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
            <p className="text-sm font-medium text-gray-900 mt-1 break-all">{selectedUser.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{selectedUser.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Website</p>
            <p className="text-sm font-medium text-gray-900 mt-1 truncate">{selectedUser.website}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Company</p>
            <p className="text-sm font-medium text-gray-900 mt-1 truncate">{selectedUser.company.name}</p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-3 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">Posts ({posts.length})</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {posts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No posts found for this user</p>
            </div>
          ) : (
            <div className="space-y-3 p-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 capitalize line-clamp-2">{post.title}</h4>
                    {expandedPostId === post.id ? (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{post.body}</p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.body}</p>
                    )}
                    <button
                      onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-flex items-center gap-1"
                    >
                      {expandedPostId === post.id ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Read more
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
