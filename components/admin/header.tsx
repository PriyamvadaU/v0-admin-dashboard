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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        {/* Header layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start">
            <div
              className="p-2 md:p-2.5 rounded-lg transition-colors"
              style={{ backgroundColor: "var(--current-primary)" }}
            >
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-lg sm:text-xl md:text-2xl font-bold transition-colors"
                style={{ color: "var(--current-primary)" }}
              >
                Admin Dashboard
              </h1>
              <p
                className={`text-xs md:text-sm hidden sm:block ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}
              >
                Manage users & posts
              </p>
            </div>
          </div>

          {/* Center: View Toggle and Stats */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center w-full sm:w-auto">
            <div
              className={`flex gap-1 sm:gap-2 p-1 rounded-lg w-full sm:w-auto ${
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
                className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md transition-all font-medium text-xs sm:text-sm flex-1 sm:flex-none ${
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
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Users</span> ({userCount})
              </button>
              <button
                onClick={() => onViewChange("posts")}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md transition-all font-medium text-xs sm:text-sm flex-1 sm:flex-none ${
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
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Posts</span> ({postCount})
              </button>
              <button
                onClick={() => onViewChange("usernames")}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md transition-all font-medium text-xs sm:text-sm flex-1 sm:flex-none ${
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
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden lg:inline">Usernames</span>
                <span className="lg:hidden">Names</span>
              </button>
            </div>
          </div>

          {/* Right: Theme and Mode Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Selector */}
            <div className="relative group">
              <button
                className={`p-2 sm:p-2.5 rounded-lg transition-colors ${
                  mode === "light" ? "hover:bg-gray-100 text-gray-600" : "hover:bg-gray-700 text-gray-300"
                }`}
                title="Select theme"
              >
                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div
                className={`absolute right-0 mt-2 w-40 sm:w-48 rounded-lg shadow-lg p-3 invisible group-hover:visible transition-all ${
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
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-xs sm:text-sm font-medium capitalize ${
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
              className={`p-2 sm:p-2.5 rounded-lg transition-colors ${
                mode === "light" ? "hover:bg-gray-100 text-gray-600" : "hover:bg-gray-700 text-gray-300"
              }`}
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              {mode === "light" ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
