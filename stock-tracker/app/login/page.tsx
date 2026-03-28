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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.35) 0%, rgba(59,130,246,0.2) 100%)",
              boxShadow: "0 0 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              border: "1px solid rgba(59,130,246,0.4)",
            }}
          >
            <TrendingUp className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Sign in to{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                BlueTracker
              </span>
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              Track major moves in blue chip stocks
            </p>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {error && (
            <p
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder-gray-600 transition-all duration-150 outline-none"
              style={{
                background: "var(--surface-hover)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.boxShadow = "none";
              }}
              placeholder="admin"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder-gray-600 transition-all duration-150 outline-none"
              style={{
                background: "var(--surface-hover)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.boxShadow = "none";
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-2.5 text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 0 0 1px rgba(59,130,246,0.4), 0 4px 16px rgba(59,130,246,0.25)",
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(59,130,246,0.6), 0 4px 24px rgba(59,130,246,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 0 1px rgba(59,130,246,0.4), 0 4px 16px rgba(59,130,246,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
