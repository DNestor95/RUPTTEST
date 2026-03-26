"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-500/30">
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in to BluePulse</h1>
          <p className="text-sm text-gray-400">Track major moves in blue chip stocks</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 space-y-5"
        >
          {error && (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500/50 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              placeholder="admin"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500/50 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
