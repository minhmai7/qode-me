'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Category } from '@/types';

function Icon({ name, className }: { name: 'logo' | 'code' | 'terminal' | 'brain' | 'chart' | 'trophy' | 'target'; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  switch (name) {
    case 'logo':
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M7 7.5 3.5 12 7 16.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 7.5 20.5 12 17 16.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.25 5.5 9.75 18.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'code':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 18 3 12 9 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 6 21 12 15 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'terminal':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M7 9.5 9.5 12 7 14.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 14.5H16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'brain':
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M9 7a3 3 0 0 0-3 3v1a2.5 2.5 0 0 0 0 5v.5A2.5 2.5 0 0 0 8.5 19H10"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 7a3 3 0 0 1 3 3v1a2.5 2.5 0 0 1 0 5v.5A2.5 2.5 0 0 1 15.5 19H14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 7.25c.75-.5 1.6-.75 2.5-.75S14.25 6.75 15 7.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 10v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 19V5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M4 19h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M7.5 16V11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 16V8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M16.5 16V13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'trophy':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M6 6H4v2a4 4 0 0 0 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 6h2v2a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M9 20h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M10 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'target':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 21a9 9 0 1 0-9-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 18a6 6 0 1 0-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 15a3 3 0 1 0-3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M21 3 14 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M16 3h5v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function categoryIconName(slug: string): 'code' | 'terminal' | 'brain' {
  switch (slug) {
    case 'javascript':
      return 'code';
    case 'python':
      return 'terminal';
    default:
      return 'brain';
  }
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const categories = useMemo<Category[]>(
    () => [
      { id: 1, name: 'JavaScript', slug: 'javascript', icon: 'code', description: 'Core language fundamentals and modern syntax.' },
      { id: 2, name: 'Python', slug: 'python', icon: 'terminal', description: 'From basics to practical problem solving.' },
      { id: 3, name: 'Algorithms', slug: 'algorithms', icon: 'brain', description: 'Data structures, complexity, and patterns.' },
    ],
    []
  );

  const handleStartQuiz = (categorySlug: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/quiz/' + categorySlug);
      return;
    }
    router.push('/quiz/' + categorySlug);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <Icon name="logo" className="h-5 w-5 text-indigo-200" />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">QodeMe</h1>
              <p className="text-xs text-slate-300">Professional coding quizzes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push('/leaderboard')}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Leaderboard
                </button>
                <div className="hidden items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                  <span className="text-sm text-slate-200">
                    <span className="font-medium text-white">{user?.username}</span>
                    <span className="text-slate-400"> • </span>
                    <span className="text-slate-300">{user?.totalScore} pts</span>
                  </span>
                </div>
                <button
                  onClick={() => router.push('/profile')}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              Structured practice for developers
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Practice coding concepts with focused quizzes.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              QodeMe helps you build confidence with short, high-signal questions across languages and fundamentals.
              Track progress, sharpen weak areas, and keep momentum.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleStartQuiz('javascript')}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Start a Quiz
              </button>
              <button
                onClick={() => router.push('/leaderboard')}
                className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                View Leaderboard
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Your snapshot</p>
                  <p className="mt-1 text-xs text-slate-400">Updated live when you’re signed in</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/15 ring-1 ring-indigo-400/30">
                  <Icon name="chart" className="h-5 w-5 text-indigo-200" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="mt-1 text-sm font-semibold text-white">{isAuthenticated ? 'Signed in' : 'Guest'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="mt-1 text-sm font-semibold text-white">{isAuthenticated ? `${user?.totalScore ?? 0} pts` : '—'}</p>
                </div>
              </div>
              {!isAuthenticated && (
                <div className="mt-5 rounded-xl border border-indigo-400/20 bg-indigo-600/10 p-4">
                  <p className="text-sm font-semibold text-white">Create an account to track progress</p>
                  <p className="mt-1 text-sm text-slate-300">Save your score, compare with others, and keep a consistent streak.</p>
                  <button
                    onClick={() => router.push('/auth/register')}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Create account
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Choose a track</h3>
              <p className="mt-1 text-sm text-slate-300">Short quizzes organized by language and fundamentals.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/15 ring-1 ring-indigo-400/30">
                    <Icon name={categoryIconName(category.slug)} className="h-5 w-5 text-indigo-200" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Category</span>
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">{category.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{category.description}</p>
                <button
                  onClick={() => handleStartQuiz(category.slug)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Start quiz
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon name="chart" className="h-5 w-5 text-slate-200" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Track progress</h3>
              <p className="mt-2 text-sm text-slate-300">Keep a clear view of improvement and total score over time.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon name="trophy" className="h-5 w-5 text-slate-200" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Compete</h3>
              <p className="mt-2 text-sm text-slate-300">Compare results with others on the leaderboard.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon name="target" className="h-5 w-5 text-slate-200" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Stay focused</h3>
              <p className="mt-2 text-sm text-slate-300">Short sessions that target fundamentals and weak spots.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
