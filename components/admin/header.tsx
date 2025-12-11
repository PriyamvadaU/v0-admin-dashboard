"use client"

import type React from "react"

import { Users, FileText, Sun, Moon, Palette } from "lucide-react"

interface HeaderProps {
  view: "users" | "posts" | "usernames"
  onViewChange: (view: "users" | "posts" | "usernames") => void
  theme: "sage" | "lavender" | "ocean" | "sunset"
  onThemeChange: (theme: "sage" | "lavender" | "ocean" | "sunset") => void
  mode: "light" | "dark"
  onModeChange: (mode: "light" | "dark") => void
  userCount: number
  postCount: number
}

export default function Header({
  view,
  onViewChange,
  theme,
  onThemeChange,
  mode,
  onModeChange,
  userCount,
  postCount,
}: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        mode === "light"
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-gray-800 shadow-lg border-b border-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Header layout */}
        <div className="flex items-center justify-between gap-6">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2.5 rounded-lg transition-colors" style={{ backgroundColor: "var(--current-primary)" }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold transition-colors" style={{ color: "var(--current-primary)" }}>
                Admin Dashboard
              </h1>
              <p className={`text-sm ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>Manage users & posts</p>
            </div>
          </div>

          {/* Center: View Toggle and Stats */}
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div
              className={`flex gap-2 p-1 rounded-lg ${
                mode === "light" ? "bg-gray-100 border border-gray-200" : "bg-gray-700 border border-gray-600"
              }`}
              style={
                {
                  "--current-primary": "var(--current-primary)",
                } as React.CSSProperties
              }
            >
              <button
                onClick={() => onViewChange("users")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                  view === "users"
                    ? mode === "light"
                      ? "shadow-sm text-white"
                      : "text-white"
                    : mode === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-300 hover:text-white"
                }`}
                style={{
                  backgroundColor: view === "users" ? "var(--current-primary)" : "transparent",
                }}
              >
                <Users className="w-4 h-4" />
                Users ({userCount})
              </button>
              <button
                onClick={() => onViewChange("posts")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                  view === "posts"
                    ? mode === "light"
                      ? "shadow-sm text-white"
                      : "text-white"
                    : mode === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-300 hover:text-white"
                }`}
                style={{
                  backgroundColor: view === "posts" ? "var(--current-primary)" : "transparent",
                }}
              >
                <FileText className="w-4 h-4" />
                All Posts ({postCount})
              </button>
              <button
                onClick={() => onViewChange("usernames")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                  view === "usernames"
                    ? mode === "light"
                      ? "shadow-sm text-white"
                      : "text-white"
                    : mode === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-300 hover:text-white"
                }`}
                style={{
                  backgroundColor: view === "usernames" ? "var(--current-primary)" : "transparent",
                }}
              >
                <Users className="w-4 h-4" />
                All Usernames
              </button>
            </div>
          </div>

          {/* Right: Theme and Mode Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Selector */}
            <div className="relative group">
              <button
                className={`p-2.5 rounded-lg transition-colors ${
                  mode === "light" ? "hover:bg-gray-100 text-gray-600" : "hover:bg-gray-700 text-gray-300"
                }`}
                title="Select theme"
              >
                <Palette className="w-5 h-5" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg p-3 invisible group-hover:visible transition-all ${
                  mode === "light" ? "bg-white border border-gray-200" : "bg-gray-700 border border-gray-600"
                }`}
              >
                <p className={`text-xs font-semibold mb-3 ${mode === "light" ? "text-gray-600" : "text-gray-300"}`}>
                  SELECT THEME
                </p>
                <div className="space-y-2">
                  {(["sage", "lavender", "ocean", "sunset"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => onThemeChange(t)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-medium capitalize ${
                        theme === t
                          ? mode === "light"
                            ? "bg-gray-100 text-gray-900"
                            : "bg-gray-600 text-white"
                          : mode === "light"
                            ? "text-gray-700 hover:bg-gray-50"
                            : "text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <button
              onClick={() => onModeChange(mode === "light" ? "dark" : "light")}
              className={`p-2.5 rounded-lg transition-colors ${
                mode === "light" ? "hover:bg-gray-100 text-gray-600" : "hover:bg-gray-700 text-gray-300"
              }`}
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
