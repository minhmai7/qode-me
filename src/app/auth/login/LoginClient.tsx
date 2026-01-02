'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

function LogoMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
      <svg
        className="h-5 w-5 text-indigo-200"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M7 7.5 3.5 12 7 16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7.5 20.5 12 17 16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.25 5.5 9.75 18.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function LoginClient() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = useMemo(() => {
    const value = searchParams.get('redirect');
    return value && value.startsWith('/') ? value : '/';
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight text-white">QodeMe</div>
              <div className="text-xs text-slate-300">Professional coding quizzes</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Sign in</h1>
              <p className="mt-1 text-sm text-slate-300">Continue to your quizzes and progress.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/15 ring-1 ring-indigo-400/30">
              <svg className="h-5 w-5 text-indigo-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 3a7 7 0 0 1 7 7v4a7 7 0 1 1-14 0v-4a7 7 0 0 1 7-7Z" stroke="currentColor" strokeWidth="1.75" />
                <path d="M9.5 11.5h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none ring-indigo-500/30 focus:ring-2"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none ring-indigo-500/30 focus:ring-2"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="text-sm text-slate-300">
              New to QodeMe?{' '}
              <Link href="/auth/register" className="font-semibold text-indigo-200 hover:text-indigo-100">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
