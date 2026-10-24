"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (error) {
          setMessage(error.message ?? "Could not create your account.");
          return;
        }

        setMessage("Account created! You can now sign in.");
        setIsSignUp(false);
        setPassword("");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setMessage(error.message ?? "Could not sign in.");
          return;
        }

        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setMessage("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setMessage(error.message ?? "Google sign-in failed.");
        setIsLoading(false);
      }
    } catch {
      setMessage("Could not start Google sign-in. Please try again.");
      setIsLoading(false);
    }
  }

  function switchMode() {
    setIsSignUp((current) => !current);
    setMessage("");
    setPassword("");
  }

  const isSuccessMessage = message.startsWith("Account created");

  const fieldClassName =
    "glass w-full rounded-xl px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20";

  const labelClassName =
    "mb-2 block text-sm font-semibold text-[var(--foreground)]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-4 py-8 text-[var(--foreground)] sm:px-8 sm:py-12">
      <section className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">
            Your productivity space
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            TaskPilot
            <span className="text-indigo-600 dark:text-indigo-400">.</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {isSignUp
              ? "Create your account and make room for what matters."
              : "Your goals, your tasks, your next big thing."}
          </p>
        </div>

        <div className="glass overflow-hidden rounded-2xl">
          <div className="relative border-b border-[var(--surface-border)] bg-transparent px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  {isSignUp ? (
                    <path
                      d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </span>
              <div>
                <h2 className="font-bold tracking-tight text-[var(--foreground)]">
                  {isSignUp ? "Get started" : "Welcome back"}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  {isSignUp
                    ? "Fill in your details to join."
                    : "Enter your details to continue."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isSignUp) switchMode();
                }}
                aria-pressed={!isSignUp}
                className={`glass-interactive inline-flex flex-1 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-95 ${
                  !isSignUp
                    ? "border-indigo-400/50 bg-indigo-500/10 text-indigo-700 shadow-sm dark:text-indigo-300"
                    : "border-transparent bg-transparent text-[var(--muted)] hover:border-[var(--surface-border)] hover:bg-white/30 dark:hover:bg-white/5"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isSignUp) switchMode();
                }}
                aria-pressed={isSignUp}
                className={`glass-interactive inline-flex flex-1 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-95 ${
                  isSignUp
                    ? "border-indigo-400/50 bg-indigo-500/10 text-indigo-700 shadow-sm dark:text-indigo-300"
                    : "border-transparent bg-transparent text-[var(--muted)] hover:border-[var(--surface-border)] hover:bg-white/30 dark:hover:bg-white/5"
                }`}
              >
                Create account
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="glass glass-interactive flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--foreground)] transition duration-200 hover:border-indigo-400/50 hover:shadow-indigo-500/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-5 w-5 shrink-0"
              >
                <path
                  fill="#4285F4"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z"
                />
                <path
                  fill="#EA4335"
                  d="M24 12.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 7 29.5 5 24 5A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-7.4 11.4-7.4Z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--surface-border)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-[var(--surface-border)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className={labelClassName}>
                    Full name <span className="text-indigo-600">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    className={fieldClassName}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClassName}>
                  Email address <span className="text-indigo-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClassName}>
                  Password <span className="text-indigo-600">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder={
                    isSignUp ? "At least 8 characters" : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={fieldClassName}
                />
              </div>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm leading-5 ${
                    isSuccessMessage
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-[var(--surface-border)] pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </>
                  ) : isSignUp ? (
                    "Create account"
                  ) : (
                    "Sign in"
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-[var(--muted)]">
                  {isSignUp
                    ? "By creating an account, you can keep your tasks organized in one place."
                    : "Your productivity journey continues here."}
                </p>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-[var(--muted)]">
          Built for focus. Designed for progress.
        </p>
      </section>
    </main>
  );
}
