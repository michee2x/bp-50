import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiLock,
  FiMessageCircle,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { BrandLoader } from '../../../components/BrandLoader';
import { supabase } from '../../../lib/supabase';
import { buildAuthorityTasks } from '../../../lib/challengeTemplates';

type ChallengeDuration = {
  id: string;
  days: number;
  name: string;
  description: string;
  timeCommitment: string;
  goal: string;
};

const DURATIONS: ChallengeDuration[] = [
  {
    id: '30-day',
    days: 30,
    name: '30 Days → Authority Foundation',
    description: 'The MVP authority system for stronger positioning, proof, and trust.',
    timeCommitment: '20-35 min/day',
    goal: 'Build clear authority and premium trust signals',
  },
  {
    id: '40-day',
    days: 40,
    name: '40 Days → Authority Expansion',
    description: 'Deepen authority assets and market confidence.',
    timeCommitment: '20-35 min/day',
    goal: 'Expand proof, perspective, and commercial leverage',
  },
  {
    id: '60-day',
    days: 60,
    name: '60 Days → Market Authority System',
    description: 'A longer run for stronger authority and market positioning.',
    timeCommitment: '25-40 min/day',
    goal: 'Build a durable authority engine',
  },
];

export default function StartAuthorityChallenge() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState('30-day');
  const [selectedBrandType, setSelectedBrandType] = useState<'personal' | 'business'>('personal');
  const [startingChallenge, setStartingChallenge] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [hasVisibilityChallenge, setHasVisibilityChallenge] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/');
        return;
      }

      setUser(authUser);

      const [{ data: profile }, { data: completedChallenges }] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', authUser.id).single(),
        supabase
          .from('user_challenges')
          .select(`
            id,
            challenges:challenge_id (name)
          `)
          .eq('user_id', authUser.id)
          .eq('status', 'completed'),
      ]);

      setIsPro(profile?.plan === 'pro' || profile?.plan === 'enterprise');
      setHasVisibilityChallenge(
        (completedChallenges || []).some((item: any) =>
          item.challenges?.name?.toLowerCase().includes('visibility')
        )
      );
    } catch (authError) {
      console.error('Error checking authority challenge access:', authError);
      setError('Failed to load authority challenge access.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDuration = () => DURATIONS.find((duration) => duration.id === selectedDuration) || DURATIONS[0];

  const handleStartChallenge = async () => {
    const duration = getSelectedDuration();

    if (!user) {
      setError('Please sign in before starting a challenge.');
      return;
    }

    if (!isPro) {
      router.push('/dashboard/billing');
      return;
    }

    if (!hasVisibilityChallenge) {
      setError('Complete the Visibility Challenge first so the Authority Challenge builds on a real visibility foundation.');
      return;
    }

    if (startingChallenge) return;

    setStartingChallenge(true);
    setError(null);

    try {
      let challengeRecord: any = null;
      const { data: existingChallenge, error: challengeLookupError } = await supabase
        .from('challenges')
        .select('id, slug')
        .eq('slug', 'authority')
        .single();

      if (challengeLookupError && challengeLookupError.code !== 'PGRST116') {
        throw challengeLookupError;
      }

      challengeRecord = existingChallenge;

      if (!challengeRecord) {
        const { data: newChallenge, error: createChallengeError } = await supabase
          .from('challenges')
          .insert({
            name: 'Authority Challenge',
            slug: 'authority',
            description: 'Transform visibility into trust, authority, and premium positioning.',
            category: 'pro',
            difficulty: 'intermediate',
            daily_time_commitment_minutes: 30,
            is_pro: true,
            reward_points: 250,
          })
          .select('id, slug')
          .single();

        if (createChallengeError) throw createChallengeError;
        challengeRecord = newChallenge;
      }

      const { data: activeChallenge, error: activeChallengeError } = await supabase
        .from('user_challenges')
        .select('id')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeRecord.id)
        .eq('status', 'active')
        .single();

      if (activeChallengeError && activeChallengeError.code !== 'PGRST116') {
        throw activeChallengeError;
      }

      if (activeChallenge) {
        router.push('/challenges/authority');
        return;
      }

      let durationRecord: any = null;
      const { data: existingDuration, error: existingDurationError } = await supabase
        .from('challenge_durations')
        .select('*')
        .eq('challenge_id', challengeRecord.id)
        .eq('duration_days', duration.days)
        .single();

      if (existingDurationError && existingDurationError.code !== 'PGRST116') {
        throw existingDurationError;
      }

      durationRecord = existingDuration;

      if (!durationRecord) {
        const { data: newDuration, error: createDurationError } = await supabase
          .from('challenge_durations')
          .insert({
            challenge_id: challengeRecord.id,
            duration_days: duration.days,
            name: duration.name,
            description: duration.description,
            sort_order: DURATIONS.findIndex((item) => item.id === duration.id),
          })
          .select('*')
          .single();

        if (createDurationError) throw createDurationError;
        durationRecord = newDuration;
      }

      const seededTasks = buildAuthorityTasks(duration.days);
      const { data: existingTasks, error: existingTasksError } = await supabase
        .from('challenge_tasks')
        .select('id, day_number')
        .eq('challenge_duration_id', durationRecord.id)
        .order('day_number', { ascending: true });

      if (existingTasksError) throw existingTasksError;

      if (!existingTasks || existingTasks.length < seededTasks.length) {
        const existingDays = new Set((existingTasks || []).map((task) => task.day_number));
        const missingTasks = seededTasks
          .filter((task) => !existingDays.has(task.day_number))
          .map((task) => ({
            challenge_duration_id: durationRecord.id,
            ...task,
          }));

        if (missingTasks.length > 0) {
          const { error: taskInsertError } = await supabase
            .from('challenge_tasks')
            .insert(missingTasks);

          if (taskInsertError) throw taskInsertError;
        }
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration.days);

      const { error: userChallengeError } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeRecord.id,
          challenge_duration_id: durationRecord.id,
          brand_type: selectedBrandType,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          current_day: 1,
          streak_days: 0,
          completed_days: [],
          last_activity_date: startDate.toISOString().split('T')[0],
        });

      if (userChallengeError) throw userChallengeError;

      await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'challenge_started',
        metadata: {
          challenge: 'Authority Challenge',
          duration: duration.days,
          duration_name: duration.name,
          brand_type: selectedBrandType,
        },
        created_at: new Date().toISOString(),
      });

      router.push('/challenges/authority');
    } catch (startError: any) {
      console.error('Failed to start authority challenge:', startError);
      setError(startError.message || 'Failed to start the Authority Challenge.');
    } finally {
      setStartingChallenge(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF0FF]">
        <BrandLoader label="Loading authority challenge setup..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0FF] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <button
          onClick={() => router.push('/challenges/authority')}
          className="mb-8 flex items-center gap-2 text-purple-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          <span>Back to Authority Challenge</span>
        </button>

        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(80,43,133,0.12)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_30%),linear-gradient(135deg,#28163f_0%,#5826a4_52%,#e4559f_100%)] px-8 py-10 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                Pro Growth Challenge
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Start the BrandPawa Authority Challenge</h1>
              <p className="mt-4 text-sm leading-7 text-white/82 sm:text-base">
                Visibility gets attention. Authority earns trust, pricing power, and better opportunities.
                This setup lets users choose a duration and brand type before building proof assets, perspective, and premium authority.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: <FiTarget />, title: 'Clarity', text: 'Define what your market should trust you for.' },
                { icon: <FiShield />, title: 'Proof', text: 'Turn results, experience, and insight into visible authority signals.' },
                { icon: <FiTrendingUp />, title: 'Monetization', text: 'Build the trust that supports stronger pricing and better opportunities.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl bg-slate-50 p-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    {item.icon}
                  </div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Step 1: Choose your duration</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`rounded-3xl border-2 p-5 text-left transition ${
                      selectedDuration === duration.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{duration.name}</div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <FiClock />
                      {duration.timeCommitment}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{duration.description}</p>
                    <div className="mt-4 text-sm font-semibold text-purple-700">{duration.goal}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Step 2: Choose your brand type</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setSelectedBrandType('personal')}
                  className={`rounded-3xl border-2 p-5 text-left transition ${
                    selectedBrandType === 'personal'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                      <FiUsers />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Personal Brand Authority</div>
                      <div className="text-sm text-slate-600">Story-driven, perspective-led, expert-focused</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2"><FiCheck className="mt-1 text-green-500" /> Uses “I” language and expertise-led authority.</li>
                    <li className="flex items-start gap-2"><FiCheck className="mt-1 text-green-500" /> Best for founders, consultants, coaches, and creators.</li>
                  </ul>
                </button>

                <button
                  onClick={() => setSelectedBrandType('business')}
                  className={`rounded-3xl border-2 p-5 text-left transition ${
                    selectedBrandType === 'business'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
                      <FiMessageCircle />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Business Brand Authority</div>
                      <div className="text-sm text-slate-600">Offer-led, customer-facing, trust-system focused</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2"><FiCheck className="mt-1 text-green-500" /> Uses “we” language and brand-level proof.</li>
                    <li className="flex items-start gap-2"><FiCheck className="mt-1 text-green-500" /> Best for business brands building premium market trust.</li>
                  </ul>
                </button>
              </div>
            </div>

            <div className="mb-8 rounded-[28px] bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                <FiLock />
                Entry Requirements
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className={`rounded-2xl p-4 ${isPro ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {isPro ? 'Pro plan confirmed.' : 'Pro plan required for Authority Challenge.'}
                </div>
                <div className={`rounded-2xl p-4 ${hasVisibilityChallenge ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {hasVisibilityChallenge ? 'Visibility Challenge completed.' : 'Finish Visibility Challenge first.'}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartChallenge}
              disabled={startingChallenge}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-4 text-lg font-bold text-white transition hover:shadow-xl disabled:opacity-60"
            >
              {startingChallenge ? 'Starting Authority Challenge...' : 'Start Authority Challenge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
