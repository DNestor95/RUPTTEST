"use client";

import Link from "next/link";
import { useUser } from "@/lib/userContext";
import { TrendingUp, LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-lg tracking-tight">BlueTracker</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 text-sm text-gray-400 sm:flex">
          <Link href="/" className="rounded-full px-4 py-1.5 transition-colors hover:bg-white/[0.06] hover:text-white">
            Markets
          </Link>
          {user && (
            <Link href="/dashboard" className="rounded-full px-4 py-1.5 transition-colors hover:bg-white/[0.06] hover:text-white">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-white/[0.08]" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-sm text-gray-400 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User className="h-3.5 w-3.5" />
                </div>
                {user.name ?? user.email}
              </span>
              <a
                href="/api/auth/logout"
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </a>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
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
