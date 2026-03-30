"use client";

import Link from "next/link";
import { useUser } from "@/lib/userContext";
import { TrendingUp, LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-xl"
      style={{
        background: "linear-gradient(180deg, rgba(2,12,27,0.97) 0%, rgba(2,12,27,0.92) 100%)",
        borderBottom: "1px solid var(--border-subtle)",
        boxShadow: "0 1px 0 0 rgba(59,130,246,0.07), 0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.4) 0%, rgba(59,130,246,0.2) 100%)",
              boxShadow: "0 0 12px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              border: "1px solid rgba(59,130,246,0.4)",
            }}
          >
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <span
            className="text-lg tracking-tight transition-colors duration-200 group-hover:text-blue-200"
            style={{ letterSpacing: "-0.02em" }}
          >
            Blue<span className="text-blue-400">Tracker</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 text-sm sm:flex" style={{ color: "var(--text-secondary)" }}>
          <Link
            href="/"
            className="rounded-lg px-4 py-1.5 transition-all duration-150 hover:text-white"
            style={{ transitionProperty: "color, background" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Markets
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-1.5 transition-all duration-150 hover:text-white"
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full skeleton" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-sm sm:flex" style={{ color: "var(--text-secondary)" }}>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                  }}
                >
                  <User className="h-3.5 w-3.5" />
                </div>
                {user.name ?? user.email}
              </span>
              <a
                href="/api/auth/logout"
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-all duration-150"
                style={{
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
                  e.currentTarget.style.color = "#f87171";
                  e.currentTarget.style.background = "rgba(248,113,113,0.07)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </a>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white transition-all duration-150"
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                boxShadow: "0 0 0 1px rgba(59,130,246,0.5), 0 4px 12px rgba(59,130,246,0.25)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(59,130,246,0.7), 0 4px 20px rgba(59,130,246,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(59,130,246,0.5), 0 4px 12px rgba(59,130,246,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
