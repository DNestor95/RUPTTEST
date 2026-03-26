import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Settings } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
          <User className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.name ?? user.email}
          </h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Settings card */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
            Preferences
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your alert threshold is stored in your browser. Adjust it on the{" "}
          <Link href="/" className="text-blue-400 hover:underline">
            Markets page
          </Link>{" "}
          using the slider.
        </p>
      </div>

      {/* Quick links */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-sm text-gray-300 transition-all hover:border-blue-500/30 hover:bg-white/[0.06] hover:text-white"
          >
            View Today&apos;s Movers &rarr;
          </Link>
          <a
            href="/api/auth/logout"
            className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-sm text-gray-300 transition-all hover:border-red-500/30 hover:bg-white/[0.06] hover:text-white"
          >
            Sign Out &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
