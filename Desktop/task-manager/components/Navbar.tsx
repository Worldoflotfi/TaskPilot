"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isDark = theme === "dark";

  // Get the current authenticated user from Better Auth.
  const { data: session, isPending } = authClient.useSession();

  // Set mounted after the first render.
  // This effect is declared below through React's useEffect.
  // See the import and effect in the next step.

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await authClient.signOut();
      setMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setSigningOut(false);
    }
  }

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Main navigation"
        className="glass mx-auto flex max-w-7xl items-center justify-between gap-4
  rounded-2xl px-4 py-3
  transition-all duration-300"
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="TaskPilot home"
        >
          <span
            className="flex size-10 items-center justify-center rounded-xl
              bg-gradient-to-br from-indigo-500 to-violet-600
              text-white shadow-md shadow-indigo-500/25"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-6"
              aria-hidden="true"
            >
              <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            TaskPilot
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-1 rounded-xl
  border border-slate-200/80 bg-slate-900/6 p-1 sm:flex
  dark:border-white/10 dark:bg-white/6">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-white text-indigo-600 shadow-sm dark:bg-white/10 dark:text-indigo-300"
                : "text-slate-700 hover:bg-white/70 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-indigo-300"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/#tasks"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600
              transition-colors hover:text-indigo-600 dark:text-slate-300
              dark:hover:text-indigo-300"
          >
            Tasks
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            title={isDark ? "Light theme" : "Dark theme"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex size-10 items-center justify-center rounded-xl
            border border-indigo-200 bg-indigo-50
            shadow-md shadow-indigo-200/40
            transition-all hover:scale-105 hover:border-indigo-300
            hover:bg-indigo-100 hover:text-indigo-800
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-indigo-600
            dark:border-white/15 dark:bg-white/10 dark:text-indigo-300
            dark:shadow-black/20 dark:hover:border-indigo-400
            dark:hover:bg-indigo-400/15"
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-xl
                bg-indigo-100 font-semibold text-indigo-700 ring-1
                ring-indigo-200/80 transition-colors hover:bg-indigo-200
                dark:bg-indigo-400/15 dark:text-indigo-200 dark:ring-indigo-300/20"
            >
              {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
            </button>

            {menuOpen && (
              <div
              className="absolute right-0 mt-3 w-64 rounded-2xl border
              border-slate-200 bg-white/95 p-3
              shadow-xl shadow-slate-900/15 backdrop-blur-2xl
              dark:border-white/10 dark:bg-zinc-900/95
              dark:shadow-black/30"
              >
                <div className="border-b border-slate-200/70 px-3 py-3 dark:border-white/10">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {isPending
                      ? "Loading account..."
                      : user?.name || "TaskPilot user"}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || "No account email available"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={signingOut}
                  onClick={handleSignOut}
                  className="mt-2 w-full rounded-xl px-3 py-2.5 text-left
  text-sm font-medium text-slate-800 transition-colors
  hover:bg-red-50 hover:text-red-700
  focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-red-600 disabled:opacity-50
  dark:text-slate-200 dark:hover:bg-red-500/10
  dark:hover:text-red-300"
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
