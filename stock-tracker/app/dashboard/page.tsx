import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Settings, BarChart2, LogOut } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Profile header */}
      <div
        className="mb-8 flex items-center gap-5 rounded-2xl p-6"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 0 40px rgba(37,99,235,0.06)",
        }}
      >
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            boxShadow: "0 0 20px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {initials}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Signed in as
          </p>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {user.name ?? user.email}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
        </div>
      </div>

      {/* Settings card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <Settings className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Preferences
          </h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Your alert threshold is stored in your browser. Adjust it on the{" "}
          <Link href="/" className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-400/40 hover:decoration-blue-300/60 transition-colors">
            Markets page
          </Link>{" "}
          using the slider.
        </p>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Quick Links
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-2xl p-4 transition-all duration-150"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              e.currentTarget.style.background = "var(--surface-hover)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.background = "var(--surface-card)";
            }}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                View Today&apos;s Movers
              </span>
            </div>
            <span style={{ color: "var(--text-muted)" }}>→</span>
          </Link>
          <a
            href="/api/auth/logout"
            className="group flex items-center justify-between rounded-2xl p-4 transition-all duration-150"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(248,113,113,0.35)";
              e.currentTarget.style.background = "rgba(248,113,113,0.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.background = "var(--surface-card)";
            }}
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4" style={{ color: "#f87171" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Sign Out
              </span>
            </div>
            <span style={{ color: "var(--text-muted)" }}>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
