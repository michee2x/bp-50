import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { BrandLoader } from '../../components/BrandLoader';
import {
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiLock,
  FiMessageCircle,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiVideo,
  FiZap
} from 'react-icons/fi';

interface Challenge {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'entry' | 'pro' | 'diagnostic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  daily_time_commitment_minutes: number;
  is_pro: boolean;
  reward_points: number;
  durations: Array<{
    id: string;
    duration_days: number;
    name: string;
    description: string;
  }>;
  user_participation?: {
    status: 'active' | 'completed' | 'archived';
    current_day: number;
    completed_days: number[];
  };
}

interface UserChallenge {
  id: string;
  challenge_id: string;
  challenge_name: string;
  status: string;
  current_day: number;
  completed_days: number[];
  start_date: string;
  end_date: string;
  streak_days: number;
}

const SUITES = [
  {
    title: 'Entry / Community Challenges',
    accent: 'from-blue-500 to-cyan-500',
    description: 'Activation-focused programs that help users build consistency, show up publicly, and gain confidence.',
    items: ['Visibility Challenge', 'Book Reading Challenge', 'Video Storytelling Challenge']
  },
  {
    title: 'Pro / Growth Challenges',
    accent: 'from-purple-500 to-pink-500',
    description: 'Outcome-driven systems built for authority, growth, monetization, and deeper strategic execution.',
    items: ['Authority Challenge', 'Marketing Challenge', 'Audience Growth Challenge', 'Brand Clarity & Positioning', 'Offer & Revenue Growth']
  },
  {
    title: 'Diagnostic-Triggered Challenges',
    accent: 'from-emerald-500 to-teal-500',
    description: 'Smart recommendations based on BrandPawa Score, diagnostics, and observed brand gaps.',
    items: ['Low visibility gaps', 'Weak authority signals', 'Poor positioning clarity', 'Monetization bottlenecks']
  }
];

const SYSTEM_BLOCKS = [
  {
    title: 'Core Principle',
    text: 'Diagnostics tell you what is wrong. Challenges help you fix it with time-bound execution.'
  },
  {
    title: 'Delivery Model',
    text: 'Every challenge is built with a clear objective, daily focus, action tasks, and measurable completion logic.'
  },
  {
    title: 'Completion Output',
    text: 'Users finish with a summary, next-step recommendations, and a stronger path into diagnostics, upgrades, or calls.'
  }
];

const STANDARD_TEMPLATE = [
  'Challenge metadata: category, duration, difficulty, brand type, diagnostics, time commitment',
  'Entry flow: objective, success definition, duration selection, brand type selection, start',
  'Daily content units: theme, why it matters, 1-3 action tasks, optional prompt or example',
  'Completion logic: completed, skipped, automatic progress updates, no punishment for missed days',
  'Gamification: progress %, streaks, BrandPawa Score impact, unlocks, share triggers'
];

export default function ChallengesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profilePlan, setProfilePlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'entry' | 'pro' | 'diagnostic'>('all');

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchChallenges();
      fetchUserChallenges();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    setProfilePlan((profile?.plan as 'free' | 'pro' | 'enterprise') || 'free');
  };

  const fetchChallenges = async () => {
    try {
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select(`
          *,
          durations:challenge_durations(*)
        `)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('difficulty', { ascending: true });

      if (challengesError) throw challengesError;

      const { data: participationData } = await supabase
        .from('user_challenges')
        .select('challenge_id, status, current_day, completed_days')
        .eq('user_id', user.id)
        .eq('status', 'active');

      const mapped = (challengesData || []).map((challenge: any) => ({
        ...challenge,
        user_participation: participationData?.find((entry: any) => entry.challenge_id === challenge.id)
      }));

      setChallenges(mapped);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      const { data: activeData } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenges:challenge_id (name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('start_date', { ascending: false });

      const { data: completedData } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenges:challenge_id (name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      setActiveChallenges((activeData || []).map((item: any) => ({
        ...item,
        challenge_name: item.challenges?.name || 'Unknown Challenge'
      })));

      setCompletedChallenges((completedData || []).map((item: any) => ({
        ...item,
        challenge_name: item.challenges?.name || 'Unknown Challenge'
      })));
    } catch (error) {
      console.error('Error fetching user challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = useMemo(
    () => challenges.filter((challenge) => activeFilter === 'all' || challenge.category === activeFilter),
    [challenges, activeFilter]
  );

  const activeStreakPeak = useMemo(
    () => (activeChallenges.length ? Math.max(...activeChallenges.map((item) => item.streak_days || 0)) : 0),
    [activeChallenges]
  );

  const totalPrograms = challenges.length;
  const totalEngaged = activeChallenges.length + completedChallenges.length;

  const getChallengeRoute = (challenge: { challenge_id?: string; challenge_name?: string }) => {
    if (challenge.challenge_name?.toLowerCase().includes('visibility')) {
      return '/challenges/visibility';
    }
    if (challenge.challenge_name?.toLowerCase().includes('authority')) {
      return '/challenges/authority';
    }
    return challenge.challenge_id ? `/challenges/${challenge.challenge_id}` : '/challenges';
  };

  const handleStartChallenge = (challenge: Challenge) => {
    if (challenge.slug === 'visibility') {
      router.push('/challenges/visibility/start');
      return;
    }
    if (challenge.slug === 'authority') {
      router.push('/challenges/authority');
      return;
    }
    router.push(`/challenges/${challenge.id}/start`);
  };

  const handleContinueChallenge = (challengeId: string) => {
    const active = activeChallenges.find((item) => item.challenge_id === challengeId);
    if (active?.challenge_name?.toLowerCase().includes('visibility')) {
      router.push('/challenges/visibility');
      return;
    }
    if (active?.challenge_name?.toLowerCase().includes('authority')) {
      router.push('/challenges/authority');
      return;
    }
    router.push(`/challenges/${challengeId}`);
  };

  const renderChallengeCard = (challenge: Challenge) => {
    const isActive = challenge.user_participation?.status === 'active';
    const isLocked = challenge.is_pro && profilePlan === 'free';
    const durationLabel = challenge.durations.length
      ? `${Math.min(...challenge.durations.map((item) => item.duration_days))}-${Math.max(...challenge.durations.map((item) => item.duration_days))} days`
      : 'Custom duration';

    return (
      <div key={challenge.id} className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
        <div className={`h-2 bg-gradient-to-r ${challenge.is_pro ? 'from-purple-500 to-pink-500' : challenge.category === 'diagnostic' ? 'from-emerald-500 to-teal-500' : 'from-blue-500 to-cyan-500'}`}></div>
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {challenge.category === 'entry' ? 'Entry Suite' : challenge.category === 'pro' ? 'Pro Suite' : 'Diagnostic Triggered'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {challenge.difficulty}
                </span>
                {challenge.is_pro && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">PRO</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{challenge.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{challenge.description}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
              <div className="text-sm font-semibold text-slate-500">Impact</div>
              <div className="text-lg font-bold text-slate-900">{challenge.reward_points} pts</div>
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Duration</div>
              <div className="font-semibold text-slate-900">{durationLabel}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Time</div>
              <div className="font-semibold text-slate-900">{challenge.daily_time_commitment_minutes} min/day</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Structure</div>
              <div className="font-semibold text-slate-900">Daily actions + outputs</div>
            </div>
          </div>

          {isActive ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-purple-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-purple-700">
                  <span>Current path</span>
                  <span>Day {challenge.user_participation?.current_day || 1}</span>
                </div>
                <div className="h-2 rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((((challenge.user_participation?.completed_days?.length || 0) + 1) / Math.max(challenge.durations[0]?.duration_days || 1, 1)) * 100)
                      )}%`
                    }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => handleContinueChallenge(challenge.id)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg"
              >
                <FiPlay />
                <span>Continue Challenge</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {isLocked && (
                <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700">
                  This suite is part of Pro. Free users can start BrandPawa Score, Color Power, and the Visibility Challenge.
                </div>
              )}
              <button
                onClick={() => (isLocked ? router.push('/dashboard/billing') : handleStartChallenge(challenge))}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition ${
                  isLocked
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                }`}
              >
                {isLocked ? <FiLock /> : <FiArrowRight />}
                <span>{isLocked ? 'Go Premium' : 'Open Challenge'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF0FF]">
        <BrandLoader label="Loading challenges..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0FF] pb-16">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_35%),linear-gradient(135deg,#2f1b52_0%,#6a2fb6_48%,#eb5ba7_100%)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
                BrandPawa Challenge Suites
              </div>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                A more organized path from diagnostics to daily execution.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                BrandPawa Challenges are time-bound, outcome-driven growth programs built to move users from insight to visible brand action.
                Diagnostics identify what is broken. Challenges help users fix it with structured, repeatable momentum.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">Purpose</div>
                  <div className="mt-2 font-semibold">Action over passive insight</div>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">Users</div>
                  <div className="mt-2 font-semibold">Founders, creators, SMEs, professionals</div>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">Flow</div>
                  <div className="mt-2 font-semibold">Diagnostics → Execution → Results</div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">Suite Snapshot</div>
                  <h2 className="mt-2 text-2xl font-bold">Challenge System</h2>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                >
                  Dashboard
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <FiTarget />, label: 'Programs live', value: totalPrograms },
                  { icon: <FiPlay />, label: 'In progress', value: activeChallenges.length },
                  { icon: <FiCheckCircle />, label: 'Completed', value: completedChallenges.length },
                  { icon: <FiZap />, label: 'Best streak', value: activeStreakPeak }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                        {item.icon}
                      </div>
                      <span className="text-sm text-white/80">{item.label}</span>
                    </div>
                    <span className="text-xl font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-6 lg:grid-cols-3">
          {SYSTEM_BLOCKS.map((block) => (
            <div key={block.title} className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
              <h2 className="text-lg font-bold text-slate-900">{block.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{block.text}</p>
            </div>
          ))}
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <FiBarChart2 />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Challenge Categories</div>
                <h2 className="text-2xl font-bold text-slate-900">Three suite levels</h2>
              </div>
            </div>

            <div className="space-y-4">
              {SUITES.map((suite) => (
                <div key={suite.title} className="rounded-3xl border border-slate-200 p-5">
                  <div className={`inline-flex rounded-full bg-gradient-to-r ${suite.accent} px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white`}>
                    {suite.title}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{suite.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suite.items.map((item) => (
                      <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <FiBookOpen />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Development Standard</div>
                <h2 className="text-2xl font-bold text-slate-900">Internal challenge template</h2>
              </div>
            </div>

            <div className="space-y-3">
              {STANDARD_TEMPLATE.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <FiCheckCircle className="mt-0.5 text-green-500" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Launch Scope</div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">MVP to v2.0</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="mb-2 font-semibold text-slate-900">v1.0</div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Core challenge system with fixed task sets</li>
                  <li>Manual content with basic progress tracking</li>
                  <li>Share links and challenge completion summaries</li>
                  <li>Visibility challenge launches first with 7, 14, and 30-day tracks</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="mb-2 font-semibold text-slate-900">v2.0</div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Friends and group challenge participation</li>
                  <li>Stronger challenge automation and reminders</li>
                  <li>More challenge suites triggered by diagnostics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Your Momentum</div>
                <h2 className="text-2xl font-bold text-slate-900">Challenge progress snapshot</h2>
              </div>
              <div className="rounded-2xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                {totalEngaged} programs touched
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{activeChallenges.length}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Completed</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{completedChallenges.length}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Best streak</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{activeStreakPeak}</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {activeChallenges.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                  No active challenge yet. Start with Visibility if you need consistency, then graduate into Authority when you are ready to build premium trust signals.
                </div>
              ) : (
                activeChallenges.slice(0, 3).map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleContinueChallenge(challenge.challenge_id)}
                    className="flex w-full items-center justify-between rounded-3xl border border-slate-200 px-5 py-4 text-left transition hover:border-purple-300 hover:bg-purple-50"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{challenge.challenge_name}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Day {challenge.current_day} • Streak {challenge.streak_days} • Started {new Date(challenge.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    <FiArrowRight className="text-slate-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Challenges In Progress</div>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Keep moving with the programs you already started</h2>
            </div>
            <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {activeChallenges.length} active
            </div>
          </div>

          {activeChallenges.length === 0 ? (
            <div className="rounded-[30px] border border-white/70 bg-white p-8 text-center shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <FiPlay className="text-2xl" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-900">No challenges in progress yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Start a challenge and it will show up here with progress, streaks, and quick access back into today&apos;s work.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {activeChallenges.map((challenge) => {
                const completedCount = challenge.completed_days?.length || 0;
                const progressBase = Math.max(challenge.current_day, completedCount || 1);
                const progressPercent = Math.min(100, Math.round((progressBase / 30) * 100));
                const challengeRoute = getChallengeRoute(challenge);

                return (
                  <div
                    key={challenge.id}
                    className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                          In progress
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{challenge.challenge_name}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Day {challenge.current_day} • Started {new Date(challenge.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Streak</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">{challenge.streak_days || 0}</div>
                      </div>
                    </div>

                    <div className="mb-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed</div>
                        <div className="mt-2 text-lg font-bold text-slate-900">{completedCount}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Day</div>
                        <div className="mt-2 text-lg font-bold text-slate-900">{challenge.current_day}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</div>
                        <div className="mt-2 text-lg font-bold capitalize text-slate-900">{challenge.status}</div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Momentum progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => handleContinueChallenge(challenge.challenge_id)}
                        className="flex-1 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg"
                      >
                        Continue Today&apos;s Task
                      </button>
                      <button
                        onClick={() => router.push(challengeRoute)}
                        className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Available Programs</div>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Choose the suite that matches your next move</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'entry', label: 'Entry' },
                { id: 'pro', label: 'Pro' },
                { id: 'diagnostic', label: 'Triggered' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as 'all' | 'entry' | 'pro' | 'diagnostic')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-slate-600 shadow-sm hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredChallenges.map(renderChallengeCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
