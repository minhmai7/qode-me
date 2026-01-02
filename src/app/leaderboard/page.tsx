import Link from 'next/link';
import { prisma } from '@/lib/prisma';

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

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const topUsers = await prisma.user.findMany({
    take: 50,
    orderBy: { totalScore: 'desc' },
    select: {
      id: true,
      username: true,
      totalScore: true,
      createdAt: true,
      attempts: {
        where: { isCorrect: true },
        select: { id: true },
      },
    },
  });

  const leaderboard = topUsers.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    totalScore: user.totalScore,
    correctAnswers: user.attempts.length,
    joinedAt: user.createdAt,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight text-white">QodeMe</div>
              <div className="text-xs text-slate-300">Professional coding quizzes</div>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Leaderboard</h1>
            <p className="mt-1 text-sm text-slate-300">Top performers by total score.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Updated live
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <th className="border-b border-white/10 px-5 py-3">Rank</th>
                  <th className="border-b border-white/10 px-5 py-3">User</th>
                  <th className="border-b border-white/10 px-5 py-3">Score</th>
                  <th className="border-b border-white/10 px-5 py-3">Correct</th>
                  <th className="border-b border-white/10 px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {leaderboard.map((row) => (
                  <tr key={row.username} className="hover:bg-white/5">
                    <td className="border-b border-white/10 px-5 py-3 text-slate-200">
                      <span
                        className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ${
                          row.rank <= 3 ? 'bg-indigo-600/15 text-indigo-100 ring-indigo-400/30' : 'bg-slate-950/40 text-slate-200 ring-white/10'
                        }`}
                      >
                        #{row.rank}
                      </span>
                    </td>
                    <td className="border-b border-white/10 px-5 py-3 font-medium text-white">{row.username}</td>
                    <td className="border-b border-white/10 px-5 py-3 text-slate-200">{row.totalScore}</td>
                    <td className="border-b border-white/10 px-5 py-3 text-slate-200">{row.correctAnswers}</td>
                    <td className="border-b border-white/10 px-5 py-3 text-slate-300">
                      {row.joinedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-300">No results yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}
