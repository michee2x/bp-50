// src/components/LiveBrandWall.tsx
import { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiAward, FiTrendingUp } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

type ScoreEntry = {
  userId: string;
  name: string;
  score: number;
  takenAt: string;
};

type LiveBrandWallProps = {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showRecent?: boolean;
  hideHeader?: boolean;
};

const fallbackRecent: ScoreEntry[] = [
  { userId: 'fallback-1', name: 'Maya O.', score: 84, takenAt: new Date().toISOString() },
  { userId: 'fallback-2', name: 'David A.', score: 77, takenAt: new Date(Date.now() - 1000 * 60 * 43).toISOString() },
  { userId: 'fallback-3', name: 'Ada C.', score: 91, takenAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { userId: 'fallback-4', name: 'Jason K.', score: 69, takenAt: new Date(Date.now() - 1000 * 60 * 140).toISOString() },
];

const fallbackTop: ScoreEntry[] = [
  { userId: 'leader-1', name: 'Ada C.', score: 91, takenAt: new Date().toISOString() },
  { userId: 'leader-2', name: 'Maya O.', score: 84, takenAt: new Date().toISOString() },
  { userId: 'leader-3', name: 'David A.', score: 77, takenAt: new Date().toISOString() },
];

function formatDisplayName(fullName?: string | null) {
  if (!fullName || !fullName.trim()) {
    return null;
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} ${parts[1].charAt(0)}.`;
}

// FIXED: Use a stable time calculation that doesn't change during hydration
// Store the time difference as a string that won't change between server/client
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

// FIXED: Client-side only component for time display to prevent hydration mismatch
function TimeAgo({ date }: { date: string }) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    setTimeAgo(getTimeAgo(date));
    
    // Optional: Update every minute
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(date));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [date]);

  return <>{timeAgo}</>;
}

export function LiveBrandWall({
  title = 'Live BrandPawa Wall',
  subtitle = 'Recent BrandPawa Score results and this week\'s strongest performances.',
  compact = false,
  showRecent = true,
  hideHeader = false,
}: LiveBrandWallProps) {
  const [recentScores, setRecentScores] = useState<ScoreEntry[]>(fallbackRecent);
  const [topScores, setTopScores] = useState<ScoreEntry[]>(fallbackTop);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchWallData() {
      try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const { data: recentHistory, error: recentError } = await supabase
          .from('recent_scores')
          .select('*')
          .limit(compact ? 4 : 8);

        if (recentError) throw recentError;

        const { data: weeklyHistory, error: weeklyError } = await supabase
          .from('weekly_leaderboard')
          .select('*')
          .limit(compact ? 3 : 5);

        if (weeklyError) throw weeklyError;

        if (!cancelled) {
          if (recentHistory && recentHistory.length > 0) {
            const mappedRecent = recentHistory.map((entry) => {
              const displayName = formatDisplayName(entry.full_name);
              return {
                userId: entry.user_id,
                name: displayName || 'Brand Builder',
                score: entry.score,
                takenAt: entry.taken_at
              };
            });
            setRecentScores(mappedRecent);
          }

          if (weeklyHistory && weeklyHistory.length > 0) {
            const mappedTop = weeklyHistory.map((entry) => {
              const displayName = formatDisplayName(entry.full_name);
              return {
                userId: entry.user_id,
                name: displayName || 'Brand Builder',
                score: entry.score,
                takenAt: entry.taken_at
              };
            });
            setTopScores(mappedTop);
          }
        }
      } catch (error) {
        console.error('Failed to load Live BrandPawa Wall data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWallData();
    return () => {
      cancelled = true;
    };
  }, [compact]);

  const recentCountLabel = useMemo(
    () => `${recentScores.length} recent ${recentScores.length === 1 ? 'score' : 'scores'}`,
    [recentScores.length]
  );

  // Don't render time-sensitive content during SSR
  if (!isMounted) {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_48px_rgba(80,43,133,0.08)] sm:p-6">
        {!hideHeader ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
                <FiActivity />
                Live Signals
              </div>
              {title ? <h2 className="mt-3 text-2xl font-bold text-slate-900">{title}</h2> : null}
              {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p> : null}
            </div>
            {showRecent ? (
              <div className="text-sm text-slate-500">
                {loading ? 'Loading live scores...' : recentCountLabel}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={`${hideHeader ? '' : 'mt-6'} grid gap-5 ${showRecent ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
          {showRecent ? (
            <div className="rounded-[24px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_30%),linear-gradient(135deg,#28163f_0%,#5826a4_52%,#e4559f_100%)] p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                <FiTrendingUp />
                Recent BrandPawa Scores
              </div>
              <div className={`mt-5 grid gap-3 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
                {recentScores.slice(0, compact ? 4 : 8).map((entry) => (
                  <div key={`${entry.userId}-${entry.takenAt}`} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <div className="text-sm font-semibold text-white">{entry.name}</div>
                    <div className="mt-3 text-3xl font-bold">
                      {entry.score}
                      <span className="text-lg text-white/65">/100</span>
                    </div>
                    <div className="mt-2 text-xs text-white/70">--</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <FiAward />
              Leaderboard
            </div>
            <h3 className="mt-3 text-xl font-bold text-slate-900">Top scores of the week</h3>
            <div className="mt-5 space-y-3">
              {topScores.slice(0, compact ? 3 : 5).map((entry, index) => (
                <div key={`${entry.userId}-leader-${index}`} className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-slate-200 text-slate-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{entry.name}</div>
                      <div className="text-xs text-slate-500">--</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-700">{entry.score}</div>
                    <div className="text-xs text-slate-500">BrandPawa Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_48px_rgba(80,43,133,0.08)] sm:p-6">
      {!hideHeader ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
              <FiActivity />
              Live Signals
            </div>
            {title ? <h2 className="mt-3 text-2xl font-bold text-slate-900">{title}</h2> : null}
            {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p> : null}
          </div>
          {showRecent ? (
            <div className="text-sm text-slate-500">
              {loading ? 'Loading live scores...' : recentCountLabel}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={`${hideHeader ? '' : 'mt-6'} grid gap-5 ${showRecent ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
        {showRecent ? (
          <div className="rounded-[24px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_30%),linear-gradient(135deg,#28163f_0%,#5826a4_52%,#e4559f_100%)] p-5 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              <FiTrendingUp />
              Recent BrandPawa Scores
            </div>
            <div className={`mt-5 grid gap-3 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
              {recentScores.slice(0, compact ? 4 : 8).map((entry) => (
                <div key={`${entry.userId}-${entry.takenAt}`} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-sm font-semibold text-white">{entry.name}</div>
                  <div className="mt-3 text-3xl font-bold">
                    {entry.score}
                    <span className="text-lg text-white/65">/100</span>
                  </div>
                  <div className="mt-2 text-xs text-white/70">
                    <TimeAgo date={entry.takenAt} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            <FiAward />
            Leaderboard
          </div>
          <h3 className="mt-3 text-xl font-bold text-slate-900">Top scores of the week</h3>
          <div className="mt-5 space-y-3">
            {topScores.slice(0, compact ? 3 : 5).map((entry, index) => (
              <div key={`${entry.userId}-leader-${index}`} className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-slate-200 text-slate-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{entry.name}</div>
                    <div className="text-xs text-slate-500">
                      <TimeAgo date={entry.takenAt} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-700">{entry.score}</div>
                  <div className="text-xs text-slate-500">BrandPawa Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
