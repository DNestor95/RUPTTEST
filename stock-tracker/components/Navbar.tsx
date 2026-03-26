"use client";

import Link from "next/link";
import { useUser } from "@/lib/userContext";
import { TrendingUp, LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <span className="text-lg tracking-tight">BluePulse</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 text-sm text-gray-400 sm:flex">
          <Link href="/" className="transition-colors hover:text-white">
            Markets
          </Link>
          {user && (
            <Link href="/dashboard" className="transition-colors hover:text-white">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-white/10" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-sm text-gray-300 sm:flex">
                <User className="h-4 w-4" />
                {user.name ?? user.email}
              </span>
              <a
                href="/api/auth/logout"
                className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-white/30 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </a>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
